import deepseekService from '../services/deepseek-ai-service.js';
import prisma from '../config/prisma.js';
import logger from '../services/simple-logger.js';
import titleGenerator from '../services/title-generator.js';

/**
 * Base Agent Class
 *
 * Base class for all AI agents, providing common functionality:
 * - Chat management (standard & streaming)
 * - Session persistence
 * - History management
 * - Tool-calling framework
 *
 * Each concrete agent only needs to:
 * 1. Extend this class
 * 2. Define its own systemPrompt
 * 3. Define its own tools
 * 4. Implement its own toolHandlers
 */
class BaseAgent {
  /**
   * @param {Object} config - Agent configuration
   * @param {string} config.agentType - Agent type identifier (e.g. 'chatbot', 'purchase', 'analytics')
   * @param {string} config.name - Agent display name
   * @param {string} config.description - Agent description
   * @param {string} config.personality - Agent personality description
   * @param {string} config.expertise - Agent area of expertise
   * @param {string} config.systemPromptTemplate - System prompt template (supports variable substitution)
   * @param {Array} config.tools - Tool definitions available to the agent
   * @param {Object} config.toolHandlers - Map of tool handler functions
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
   * Build the system prompt, substituting user variables
   */
  buildSystemPrompt(user) {
    return this.systemPromptTemplate
      .replace('{userName}', user.name || 'User')
      .replace('{userRole}', user.role || 'Employee')
      .replace('{userDepartment}', user.department || 'Not set')
      .replace('{userEmail}', user.email || '');
  }

  /**
   * Standard chat interface (with logging and error handling)
   */
  async chat({ userId, message, sessionId }) {
    const startTime = Date.now();

    try {
      // Log the request
      logger.logAgentRequest(this.agentType, userId, sessionId, message.length);

      // 1. Load user info
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

      // 2. Ensure the session exists
      await this.ensureSession(sessionId, userId);

      // 3. Load session history (with token limit)
      const history = await this.loadSessionHistory(sessionId);

      // 4. Build the system prompt
      const systemPrompt = this.buildSystemPrompt(user);

      // 5. Build the messages array
      const messages = [
        ...history,
        {
          role: 'user',
          content: message,
        },
      ];

      // 6. Call the DeepSeek API (with tool calling)
      const response = await deepseekService.chatWithTools({
        agentType: this.agentType,
        systemPrompt,
        messages,
        availableTools: this.tools,
        toolHandlers: this.enrichToolHandlers(userId, user),
      });

      // 7. Save chat history
      await this.saveMessage(sessionId, 'user', message);

      if (response.success) {
        await this.saveMessage(sessionId, 'assistant', response.content);
      }

      // 8. Auto-generate a title if this is the first message
      if (history.length === 0) {
        try {
          await this.generateSessionTitle(sessionId, message);
        } catch (error) {
          // Title generation failure doesn't affect the main flow
          logger.warn('TitleGeneration', `Failed for session ${sessionId}: ${error.message}`);
        }
      }

      // Log the response
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
   * Streaming chat interface (Server-Sent Events)
   */
  async chatStream({ userId, message, sessionId }) {
    // 1. Load user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true, department: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 2. Ensure the session exists
    await this.ensureSession(sessionId, userId);

    // 3. Load session history
    const history = await this.loadSessionHistory(sessionId);

    // 4. Build the system prompt
    const systemPrompt = this.buildSystemPrompt(user);

    // 5. Save the user message
    await this.saveMessage(sessionId, 'user', message);

    // 6. Return the streaming iterator
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
   * Inject userId and the user object into tool handlers
   */
  enrichToolHandlers(userId, user) {
    const enriched = {};
    for (const [name, handler] of Object.entries(this.toolHandlers)) {
      enriched[name] = (input) => handler({ ...input, userId, user });
    }
    return enriched;
  }

  /**
   * Ensure the session exists
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
          updatedAt: new Date(),
        },
      });
    }
  }

  /**
   * Load session history (with token limit and smart trimming)
   */
  async loadSessionHistory(sessionId, maxMessages = 20, maxTokens = 3000, includeAttachments = false) {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: maxMessages, // Take at most the 20 most recent
      ...(includeAttachments ? { include: { message_attachments: true } } : {}),
    });

    // Reverse order (oldest to newest)
    const sortedMessages = messages.reverse();

    // Estimate tokens and trim
    let totalTokens = 0;
    const result = [];

    for (const msg of sortedMessages) {
      const tokens = this.estimateTokens(msg.content);

      // Stop if over the limit and we already have at least 5 messages
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

      if (includeAttachments && msg.message_attachments?.length) {
        historyMessage.attachments = msg.message_attachments;
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
   * Simple token estimation
   * Chinese: ~1 char = 1 token, English: ~4 chars = 1 token
   */
  estimateTokens(text) {
    if (!text) return 0;
    const chineseChars = (text.match(/[一-龥]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return chineseChars + Math.ceil(otherChars / 4);
  }

  /**
   * Save a message
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

    // Update the session's updatedAt
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId, limit = 100) {
    const sessions = await prisma.chatSession.findMany({
      // Empty sessions are transient UI state and should never appear in history.
      where: {
        userId,
        chat_messages: { some: {} },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { chat_messages: true },
        },
      },
    });

    return sessions.map(({ _count, ...session }) => ({
      ...session,
      _count: { messages: _count.chat_messages },
    }));
  }

  /**
   * Delete a single session
   */
  async deleteSession(sessionId) {
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }

  /**
   * Delete all sessions for a user
   */
  async deleteAllUserSessions(userId) {
    // Delete messages first
    await prisma.chatMessage.deleteMany({
      where: {
        chat_sessions: { userId },
      },
    });

    // Then delete sessions
    const result = await prisma.chatSession.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  /**
   * Auto-generate a session title
   */
  async generateSessionTitle(sessionId, firstMessage) {
    try {
      // Get the current session
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: { title: true },
      });

      if (!session) {
        logger.warn('TitleGeneration', `Session ${sessionId} not found`);
        return;
      }

      // Check whether a title needs to be generated
      if (!titleGenerator.shouldGenerateTitle(session.title)) {
        logger.debug('TitleGeneration', `Session ${sessionId} already has a custom title`);
        return;
      }

      // Generate the title
      const newTitle = await titleGenerator.generateTitle(firstMessage);

      // Update the database
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
   * Get agent info
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
