import deepseekService from '../services/deepseek-ai-service.js';
import prisma from '../config/prisma.js';
import logger from '../services/simple-logger.js';
import titleGenerator from '../services/title-generator.js';

/**
 * Base Agent Class
 *
 * 所有AI Agent的基类，提供通用功能：
 * - 对话管理（标准 & 流式）
 * - 会话持久化
 * - 历史记录管理
 * - 工具调用框架
 *
 * 每个具体的Agent只需要：
 * 1. 继承这个类
 * 2. 定义自己的 systemPrompt
 * 3. 定义自己的 tools
 * 4. 实现自己的 toolHandlers
 */
class BaseAgent {
  /**
   * @param {Object} config - Agent配置
   * @param {string} config.agentType - Agent类型标识（如 'chatbot', 'purchase', 'analytics'）
   * @param {string} config.name - Agent显示名称
   * @param {string} config.description - Agent描述
   * @param {string} config.personality - Agent个性描述
   * @param {string} config.expertise - Agent专长领域
   * @param {string} config.systemPromptTemplate - System Prompt模板（支持变量替换）
   * @param {Array} config.tools - Agent可用的工具定义
   * @param {Object} config.toolHandlers - 工具处理函数映射
   */
  constructor(config) {
    this.agentType = config.agentType;
    this.name = config.name || config.agentType;
    this.description = config.description || '';
    this.personality = config.personality || 'Professional and helpful';
    this.expertise = config.expertise || 'General assistance';
    this.systemPromptTemplate = config.systemPromptTemplate;
    this.tools = config.tools || [];
    this.toolHandlers = config.toolHandlers || {};

    logger.success('AgentInit', `${this.name} (${this.agentType}) initialized with ${this.tools.length} tools`);
  }

  /**
   * 构建System Prompt，替换用户变量
   */
  buildSystemPrompt(user) {
    return this.systemPromptTemplate
      .replace('{userName}', user.name || 'User')
      .replace('{userRole}', user.role || 'Employee')
      .replace('{userDepartment}', user.department || 'Not set')
      .replace('{userEmail}', user.email || '');
  }

  /**
   * 标准对话接口（带日志和错误处理）
   */
  async chat({ userId, message, sessionId }) {
    const startTime = Date.now();

    try {
      // 记录请求
      logger.logAgentRequest(this.agentType, userId, sessionId, message.length);

      // 1. 加载用户信息
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, role: true, department: true },
      });

      if (!user) {
        logger.error('AgentChat', `User ${userId} not found`, { agentType: this.agentType });
        return {
          success: false,
          error: 'User not found',
        };
      }

      // 2. 确保会话存在
      await this.ensureSession(sessionId, userId);

      // 3. 加载会话历史（带token限制）
      const history = await this.loadSessionHistory(sessionId);

      // 4. 构建System Prompt
      const systemPrompt = this.buildSystemPrompt(user);

      // 5. 构建消息数组
      const messages = [
        ...history,
        {
          role: 'user',
          content: message,
        },
      ];

      // 6. 调用DeepSeek API（带工具调用）
      const response = await deepseekService.chatWithTools({
        agentType: this.agentType,
        systemPrompt,
        messages,
        availableTools: this.tools,
        toolHandlers: this.enrichToolHandlers(userId, user),
      });

      // 7. 保存对话历史
      await this.saveMessage(sessionId, 'user', message);

      if (response.success) {
        await this.saveMessage(sessionId, 'assistant', response.content);
      }

      // 8. 如果是第一条消息，自动生成标题
      if (history.length === 0) {
        try {
          await this.generateSessionTitle(sessionId, message);
        } catch (error) {
          // 标题生成失败不影响主流程
          logger.warn('TitleGeneration', `Failed for session ${sessionId}: ${error.message}`);
        }
      }

      // 记录响应
      const duration = Date.now() - startTime;
      logger.logAgentResponse(
        this.agentType,
        userId,
        duration,
        response.usage?.output_tokens || 0,
        response.success
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error(
        'AgentChat',
        `${this.agentType} crashed: ${error.message}`,
        {
          agentType: this.agentType,
          userId,
          sessionId,
          duration,
          stack: error.stack?.split('\n').slice(0, 3).join(' | '),
        }
      );

      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        reason: 'SYSTEM_ERROR',
      };
    }
  }

  /**
   * 流式对话接口（Server-Sent Events）
   */
  async chatStream({ userId, message, sessionId }) {
    // 1. 加载用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true, department: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 2. 确保会话存在
    await this.ensureSession(sessionId, userId);

    // 3. 加载会话历史
    const history = await this.loadSessionHistory(sessionId);

    // 4. 构建System Prompt
    const systemPrompt = this.buildSystemPrompt(user);

    // 5. 保存用户消息
    await this.saveMessage(sessionId, 'user', message);

    // 6. 返回流式迭代器
    return deepseekService.chatStream({
      agentType: this.agentType,
      systemPrompt,
      messages: [
        ...history,
        { role: 'user', content: message },
      ],
    });
  }

  /**
   * 为工具注入userId和user对象
   */
  enrichToolHandlers(userId, user) {
    const enriched = {};
    for (const [name, handler] of Object.entries(this.toolHandlers)) {
      enriched[name] = (input) => handler({ ...input, userId, user });
    }
    return enriched;
  }

  /**
   * 确保会话存在
   */
  async ensureSession(sessionId, userId) {
    const exists = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!exists) {
      await prisma.chatSession.create({
        data: {
          id: sessionId,
          userId,
          title: `${this.name} Conversation`,
        },
      });
    }
  }

  /**
   * 加载会话历史（带token限制和智能裁剪）
   */
  async loadSessionHistory(sessionId, maxMessages = 20, maxTokens = 3000, includeAttachments = false) {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: maxMessages, // 最多取20条最新的
      ...(includeAttachments ? { include: { attachments: true } } : {}),
    });

    // 反转顺序（从旧到新）
    const sortedMessages = messages.reverse();

    // 估算token并裁剪
    let totalTokens = 0;
    const result = [];

    for (const msg of sortedMessages) {
      const tokens = this.estimateTokens(msg.content);

      // 如果超过限制且已有至少5条消息，停止
      if (totalTokens + tokens > maxTokens && result.length >= 5) {
        logger.warn(
          'HistoryTruncated',
          `Session ${sessionId} truncated at ${result.length} messages (${totalTokens} tokens)`,
          { sessionId, messageCount: result.length, tokens: totalTokens }
        );
        break;
      }

      const historyMessage = {
        role: msg.role,
        content: msg.content,
      };

      if (includeAttachments && msg.attachments?.length) {
        historyMessage.attachments = msg.attachments;
      }

      result.push(historyMessage);

      totalTokens += tokens;
    }

    logger.debug(
      'HistoryLoaded',
      `Loaded ${result.length}/${sortedMessages.length} messages (~${totalTokens} tokens)`,
      { sessionId, messageCount: result.length, tokens: totalTokens }
    );

    return result;
  }

  /**
   * 简单token估算
   * 中文约1字符=1token，英文约4字符=1token
   */
  estimateTokens(text) {
    if (!text) return 0;
    const chineseChars = (text.match(/[一-龥]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return chineseChars + Math.ceil(otherChars / 4);
  }

  /**
   * 保存消息
   */
  async saveMessage(sessionId, role, content, metadata = null) {
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

    await prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content: contentStr,
        metadata: metadata ? metadata : undefined,
      },
    });

    // 更新会话的updatedAt
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });
  }

  /**
   * 获取用户的所有会话
   */
  async getUserSessions(userId, limit = 100) {
    return await prisma.chatSession.findMany({
      // Empty sessions are transient UI state and should never appear in history.
      where: {
        userId,
        messages: { some: {} },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  /**
   * 删除单个会话
   */
  async deleteSession(sessionId) {
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }

  /**
   * 删除用户的所有会话
   */
  async deleteAllUserSessions(userId) {
    // 先删除消息
    await prisma.chatMessage.deleteMany({
      where: {
        session: { userId },
      },
    });

    // 再删除会话
    const result = await prisma.chatSession.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  /**
   * 自动生成会话标题
   */
  async generateSessionTitle(sessionId, firstMessage) {
    try {
      // 获取当前会话
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: { title: true },
      });

      if (!session) {
        logger.warn('TitleGeneration', `Session ${sessionId} not found`);
        return;
      }

      // 检查是否需要生成标题
      if (!titleGenerator.shouldGenerateTitle(session.title)) {
        logger.debug('TitleGeneration', `Session ${sessionId} already has a custom title`);
        return;
      }

      // 生成标题
      const newTitle = await titleGenerator.generateTitle(firstMessage);

      // 更新数据库
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { title: newTitle },
      });

      logger.success('TitleGeneration', `Updated session ${sessionId} title to: "${newTitle}"`);
    } catch (error) {
      logger.error('TitleGeneration', `Failed for session ${sessionId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取Agent信息
   */
  getInfo() {
    return {
      type: this.agentType,
      name: this.name,
      description: this.description,
      personality: this.personality,
      expertise: this.expertise,
      toolCount: this.tools.length,
      tools: this.tools.map(t => t.name),
    };
  }
}

export default BaseAgent;
