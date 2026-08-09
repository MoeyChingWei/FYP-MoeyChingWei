import OpenAI from 'openai';
import logger from './simple-logger.js';

class DeepSeekAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
      timeout: 30000, // 30 second API timeout
      maxRetries: 0,  // We control retry logic ourselves
    });

    this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    this.maxTokens = parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 4096;

    logger.success('DeepSeekService', 'Initialized with model: ' + this.model);
  }

  /**
   * Determine whether an error is retryable
   */
  isRetryableError(error) {
    // Network errors
    if (error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED') {
      return true;
    }

    // HTTP status codes
    const status = error.response?.status || error.status;
    if (status === 429 || // Rate limit
        status === 500 || // Server error
        status === 502 || // Bad gateway
        status === 503 || // Service unavailable
        status === 504) { // Gateway timeout
      return true;
    }

    return false;
  }

  /**
   * Delay function
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * API call with retry mechanism
   */
  async chatWithRetry(params, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const startTime = Date.now();

      try {
        logger.debug('DeepSeekAPI', `Attempt ${attempt}/${maxRetries}`, {
          model: params.model,
          messagesCount: params.messages?.length
        });

        const response = await this.client.chat.completions.create(params);

        const duration = Date.now() - startTime;
        logger.logAPICall('DeepSeek', 'chat.completions', duration, true, attempt);

        return response;

      } catch (error) {
        lastError = error;
        const duration = Date.now() - startTime;

        logger.logAPICall('DeepSeek', 'chat.completions', duration, false, attempt);

        // Determine whether to retry
        const shouldRetry = this.isRetryableError(error) && attempt < maxRetries;

        if (shouldRetry) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          logger.logRetry('DeepSeek', attempt, maxRetries, error.message);
          await this.sleep(delay);
        } else {
          // No more retries, log the final error
          logger.error('DeepSeekAPI', `Failed after ${attempt} attempts: ${error.message}`, {
            attempts: attempt,
            error: error.message,
            code: error.code,
            status: error.response?.status,
          });
          break;
        }
      }
    }

    // All retries failed
    throw lastError;
  }

  /**
   * Basic chat method (with retry)
   */
  async chat({
    systemPrompt,
    messages,
    tools = [],
    maxTokens = this.maxTokens,
    temperature = 1.0,
  }) {
    try {
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.filter(msg => {
          // Filter out invalid message formats
          if (msg.role === 'tool' && !msg.tool_call_id) return false;
          return true;
        }).map(msg => {
          // Only pass fields accepted by DeepSeek
          if (msg.role === 'assistant') {
            const assistantMsg = { role: 'assistant', content: msg.content || '' };
            if (msg.tool_calls) assistantMsg.tool_calls = msg.tool_calls;
            if (msg.reasoning_content) assistantMsg.reasoning_content = msg.reasoning_content;
            return assistantMsg;
          }
          if (msg.role === 'tool') {
            return { role: 'tool', tool_call_id: msg.tool_call_id, content: msg.content };
          }
          return { role: msg.role, content: msg.content };
        })
      ];

      const requestPayload = {
        model: this.model,
        max_tokens: maxTokens,
        temperature,
        messages: formattedMessages,
      };

      if (tools && tools.length > 0) {
        requestPayload.tools = tools.map(tool => ({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          }
        }));
      }

      // Use the API call with retry
      const response = await this.chatWithRetry(requestPayload);

      const message = response.choices[0].message;

      return {
        success: true,
        content: message.tool_calls ?
          message.tool_calls.map(tc => ({
            type: 'tool_use',
            id: tc.id,
            name: tc.function.name,
            input: JSON.parse(tc.function.arguments)
          })) :
          [{ type: 'text', text: message.content }],
        usage: {
          input_tokens: response.usage.prompt_tokens,
          output_tokens: response.usage.completion_tokens,
        },
        stopReason: response.choices[0].finish_reason,
        reasoningContent: message.reasoning_content, // Save reasoning content
      };
    } catch (error) {
      logger.error('DeepSeekChat', `API Error: ${error.message}`, {
        error: error.message,
        code: error.code,
        status: error.response?.status,
      });

      return {
        success: false,
        error: error.message,
        reason: 'API_ERROR',
      };
    }
  }

  /**
   * Chat with tool calling (with timeout protection)
   */
  async chatWithTools({
    systemPrompt,
    messages,
    availableTools = [],
    toolHandlers = {},
    maxIterations = 5,
    overallTimeoutMs = 90000,  // Overall 90 second timeout
    toolTimeoutMs = 30000,     // Single tool 30 second timeout
  }) {
    const startTime = Date.now();
    let currentMessages = [...messages];
    let iterations = 0;

    while (iterations < maxIterations) {
      // ✅ Check overall timeout
      const elapsed = Date.now() - startTime;
      if (elapsed > overallTimeoutMs) {
        logger.logTimeout('ChatWithTools', 'Overall execution', overallTimeoutMs);
        return {
          success: false,
          error: `Request timeout after ${Math.floor(elapsed / 1000)} seconds. Please try a simpler query.`,
          reason: 'TIMEOUT',
        };
      }

      // Step 1: Call the LLM
      const response = await this.chat({
        systemPrompt,
        messages: currentMessages,
        tools: availableTools,
      });

      if (!response.success) {
        return response;
      }

      const toolUseBlock = response.content.find(block => block.type === 'tool_use');

      // Step 2: If there's no tool call, return the text response
      if (!toolUseBlock) {
        const textBlock = response.content.find(block => block.type === 'text');
        return {
          success: true,
          content: textBlock?.text || '',
          usage: response.usage,
        };
      }

      // Step 3: Execute the tool call (with timeout)
      const toolName = toolUseBlock.name;
      const toolInput = toolUseBlock.input;
      const toolStartTime = Date.now();

      logger.info('ToolExecution', `Calling ${toolName}`, { input: toolInput });

      let toolResult;
      try {
        // ✅ Tool call with timeout protection
        toolResult = await Promise.race([
          toolHandlers[toolName] ?
            toolHandlers[toolName](toolInput) :
            Promise.resolve({ error: `Tool handler not found: ${toolName}` }),

          // Timeout promise
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error(`Tool ${toolName} timeout after ${toolTimeoutMs}ms`)),
              toolTimeoutMs
            )
          ),
        ]);

        const toolDuration = Date.now() - toolStartTime;
        logger.logToolCall('DeepSeek', toolName, toolDuration, true);

      } catch (error) {
        const toolDuration = Date.now() - toolStartTime;
        logger.logToolCall('DeepSeek', toolName, toolDuration, false);

        logger.error('ToolExecution', `${toolName} failed: ${error.message}`, {
          toolName,
          duration: toolDuration,
          error: error.message,
        });

        toolResult = {
          success: false,
          error: error.message.includes('timeout') ?
            `Operation timed out. Please try a narrower query.` :
            `Tool execution failed: ${error.message}`,
        };
      }

      // Step 4: Add to conversation history
      const assistantMsg = {
        role: 'assistant',
        content: '',
        tool_calls: [{
          id: toolUseBlock.id,
          type: 'function',
          function: {
            name: toolName,
            arguments: JSON.stringify(toolInput)
          }
        }]
      };

      // If there is reasoning_content, add it
      if (response.reasoningContent) {
        assistantMsg.reasoning_content = response.reasoningContent;
      }

      currentMessages.push(assistantMsg);

      // Add the tool message (tool result)
      currentMessages.push({
        role: 'tool',
        tool_call_id: toolUseBlock.id,
        content: JSON.stringify(toolResult),
      });

      iterations++;
    }

    // Reached the maximum number of iterations
    logger.warn('ChatWithTools', `Max iterations (${maxIterations}) reached`);
    return {
      success: false,
      error: 'Request too complex. Please simplify your query.',
      reason: 'MAX_ITERATIONS',
    };
  }

  extractText(content) {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      const textBlock = content.find(block => block.type === 'text');
      return textBlock?.text || '';
    }

    return '';
  }
}

export default new DeepSeekAIService();
