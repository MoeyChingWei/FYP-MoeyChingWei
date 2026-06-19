import OpenAI from 'openai';
import logger from './simple-logger.js';

class DeepSeekAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
      timeout: 30000, // 30秒API超时
      maxRetries: 0,  // 我们自己控制重试逻辑
    });

    this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    this.maxTokens = parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 4096;

    logger.success('DeepSeekService', 'Initialized with model: ' + this.model);
  }

  /**
   * 判断错误是否可重试
   */
  isRetryableError(error) {
    // 网络错误
    if (error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED') {
      return true;
    }

    // HTTP 状态码
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
   * 延迟函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 带重试机制的API调用
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

        // 判断是否应该重试
        const shouldRetry = this.isRetryableError(error) && attempt < maxRetries;

        if (shouldRetry) {
          // 指数退避：1s, 2s, 4s
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          logger.logRetry('DeepSeek', attempt, maxRetries, error.message);
          await this.sleep(delay);
        } else {
          // 不重试，记录最终错误
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

    // 所有重试都失败
    throw lastError;
  }

  /**
   * 基础聊天方法（带重试）
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
          // 过滤掉无效的消息格式
          if (msg.role === 'tool' && !msg.tool_call_id) return false;
          return true;
        }).map(msg => {
          // 只传递 DeepSeek 接受的字段
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

      // 使用带重试的API调用
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
        reasoningContent: message.reasoning_content, // 保存思考内容
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
   * 带工具调用的聊天（带超时保护）
   */
  async chatWithTools({
    systemPrompt,
    messages,
    availableTools = [],
    toolHandlers = {},
    maxIterations = 5,
    overallTimeoutMs = 90000,  // 整体90秒超时
    toolTimeoutMs = 30000,     // 单个工具30秒超时
  }) {
    const startTime = Date.now();
    let currentMessages = [...messages];
    let iterations = 0;

    while (iterations < maxIterations) {
      // ✅ 检查总超时
      const elapsed = Date.now() - startTime;
      if (elapsed > overallTimeoutMs) {
        logger.logTimeout('ChatWithTools', 'Overall execution', overallTimeoutMs);
        return {
          success: false,
          error: `Request timeout after ${Math.floor(elapsed / 1000)} seconds. Please try a simpler query.`,
          reason: 'TIMEOUT',
        };
      }

      // Step 1: 调用LLM
      const response = await this.chat({
        systemPrompt,
        messages: currentMessages,
        tools: availableTools,
      });

      if (!response.success) {
        return response;
      }

      const toolUseBlock = response.content.find(block => block.type === 'tool_use');

      // Step 2: 如果没有工具调用，返回文本响应
      if (!toolUseBlock) {
        const textBlock = response.content.find(block => block.type === 'text');
        return {
          success: true,
          content: textBlock?.text || '',
          usage: response.usage,
        };
      }

      // Step 3: 执行工具调用（带超时）
      const toolName = toolUseBlock.name;
      const toolInput = toolUseBlock.input;
      const toolStartTime = Date.now();

      logger.info('ToolExecution', `Calling ${toolName}`, { input: toolInput });

      let toolResult;
      try {
        // ✅ 工具调用带超时保护
        toolResult = await Promise.race([
          toolHandlers[toolName] ?
            toolHandlers[toolName](toolInput) :
            Promise.resolve({ error: `Tool handler not found: ${toolName}` }),

          // 超时Promise
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

      // Step 4: 添加对话历史
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

      // 如果有 reasoning_content，添加它
      if (response.reasoningContent) {
        assistantMsg.reasoning_content = response.reasoningContent;
      }

      currentMessages.push(assistantMsg);

      // 添加 tool 消息（工具结果）
      currentMessages.push({
        role: 'tool',
        tool_call_id: toolUseBlock.id,
        content: JSON.stringify(toolResult),
      });

      iterations++;
    }

    // 达到最大迭代次数
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
