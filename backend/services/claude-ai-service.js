import Anthropic from '@anthropic-ai/sdk';

class ClaudeAIService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // 不同Agent使用的模型配置
    this.models = {
      chatbot: process.env.CLAUDE_DEFAULT_MODEL || 'claude-opus-4-20250514',
      procurement: process.env.CLAUDE_DEFAULT_MODEL || 'claude-opus-4-20250514',
      approval: process.env.CLAUDE_DEFAULT_MODEL || 'claude-opus-4-20250514',
      analytics: process.env.CLAUDE_DEFAULT_MODEL || 'claude-opus-4-20250514',
      supplier: process.env.CLAUDE_DEFAULT_MODEL || 'claude-opus-4-20250514',
      notification: process.env.CLAUDE_DEFAULT_MODEL || 'claude-opus-4-20250514',
    };

    this.maxTokens = parseInt(process.env.CLAUDE_MAX_TOKENS) || 4096;
  }

  /**
   * 统一的Claude API调用方法
   */
  async chat({
    agentType = 'chatbot',
    systemPrompt,
    messages,
    tools = [],
    maxTokens = this.maxTokens,
    temperature = 1.0,
  }) {
    try {
      const requestPayload = {
        model: this.models[agentType] || this.models.chatbot,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages,
      };

      // 只有在有工具时才添加tools参数
      if (tools && tools.length > 0) {
        requestPayload.tools = tools;
      }

      const response = await this.client.messages.create(requestPayload);

      return {
        success: true,
        content: response.content,
        usage: response.usage,
        stopReason: response.stop_reason,
      };
    } catch (error) {
      console.error(`❌ Claude API Error (${agentType}):`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 流式响应（用于ChatBot实时显示）
   */
  async *chatStream({
    agentType = 'chatbot',
    systemPrompt,
    messages,
    maxTokens = this.maxTokens,
  }) {
    try {
      const stream = await this.client.messages.stream({
        model: this.models[agentType] || this.models.chatbot,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      console.error(`❌ Claude Stream Error (${agentType}):`, error.message);
      throw error;
    }
  }

  /**
   * 带工具调用的智能路由
   */
  async chatWithTools({
    agentType = 'chatbot',
    systemPrompt,
    messages,
    availableTools = [],
    toolHandlers = {},
    maxIterations = 5,
  }) {
    let currentMessages = [...messages];
    let iterations = 0;

    while (iterations < maxIterations) {
      const response = await this.chat({
        agentType,
        systemPrompt,
        messages: currentMessages,
        tools: availableTools,
      });

      if (!response.success) {
        return response;
      }

      // 查找是否有工具调用
      const toolUseBlock = response.content.find(block => block.type === 'tool_use');

      if (!toolUseBlock) {
        // 没有工具调用，返回最终文本响应
        const textBlock = response.content.find(block => block.type === 'text');
        return {
          success: true,
          content: textBlock?.text || '',
          usage: response.usage,
        };
      }

      // 执行工具调用
      const toolName = toolUseBlock.name;
      const toolInput = toolUseBlock.input;

      console.log(`🔧 Tool called: ${toolName}`, toolInput);

      let toolResult;
      if (toolHandlers[toolName]) {
        try {
          toolResult = await toolHandlers[toolName](toolInput);
        } catch (error) {
          toolResult = {
            error: error.message,
          };
        }
      } else {
        toolResult = {
          error: `Tool handler not found: ${toolName}`,
        };
      }

      // 将工具结果添加到对话历史
      currentMessages.push({
        role: 'assistant',
        content: response.content,
      });

      currentMessages.push({
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult),
        }],
      });

      iterations++;
    }

    return {
      success: false,
      error: 'Max tool iterations reached',
    };
  }

  /**
   * 提取文本响应
   */
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

export default new ClaudeAIService();
