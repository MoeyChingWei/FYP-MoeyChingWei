import fs from 'fs';
import path from 'path';

/**
 * Simple Logger Service
 *
 * Provides basic logging functionality:
 * - Console output (with colors and emoji)
 * - File output (JSON format, split by level)
 * - Agent request tracking
 */
class SimpleLogger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
      console.log(`📁 Created logs directory: ${this.logDir}`);
    }
  }

  log(level, context, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context,
      message,
      ...metadata,
    };

    // Console output
    const emoji = {
      info: '💬',
      warn: '⚠️',
      error: '❌',
      success: '✅',
      debug: '🔍',
    };

    const color = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      success: '\x1b[32m', // Green
      debug: '\x1b[90m',   // Gray
    };

    const reset = '\x1b[0m';

    console.log(
      `${emoji[level] || '📝'} ${color[level] || ''}[${level.toUpperCase()}]${reset} ${context}: ${message}`
    );

    // File output
    try {
      const logFile = path.join(this.logDir, `${level}.log`);
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

      // All logs are also written to combined.log
      const combinedFile = path.join(this.logDir, 'combined.log');
      fs.appendFileSync(combinedFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write log file:', error.message);
    }
  }

  info(context, message, metadata) {
    this.log('info', context, message, metadata);
  }

  warn(context, message, metadata) {
    this.log('warn', context, message, metadata);
  }

  error(context, message, metadata) {
    this.log('error', context, message, metadata);
  }

  success(context, message, metadata) {
    this.log('success', context, message, metadata);
  }

  debug(context, message, metadata) {
    if (process.env.DEBUG === 'true') {
      this.log('debug', context, message, metadata);
    }
  }

  // Specifically for Agent request tracking
  logAgentRequest(agentType, userId, sessionId, messageLength) {
    this.info('AgentRequest', `${agentType} from user ${userId}`, {
      agentType,
      userId,
      sessionId,
      messageLength,
      timestamp: Date.now(),
    });
  }

  logAgentResponse(agentType, userId, duration, tokensUsed, success = true) {
    if (success) {
      this.success('AgentResponse', `${agentType} completed in ${duration}ms`, {
        agentType,
        userId,
        duration,
        tokensUsed,
        timestamp: Date.now(),
      });
    } else {
      this.error('AgentResponse', `${agentType} failed after ${duration}ms`, {
        agentType,
        userId,
        duration,
        timestamp: Date.now(),
      });
    }
  }

  logToolCall(agentType, toolName, duration, success = true) {
    this.info('ToolCall', `${toolName} in ${agentType} (${duration}ms)`, {
      agentType,
      toolName,
      duration,
      success,
      timestamp: Date.now(),
    });
  }

  logAPICall(service, endpoint, duration, success = true, attempt = 1) {
    this.info('APICall', `${service} ${endpoint} in ${duration}ms (attempt ${attempt})`, {
      service,
      endpoint,
      duration,
      success,
      attempt,
      timestamp: Date.now(),
    });
  }

  logRetry(service, attempt, maxAttempts, error) {
    this.warn('Retry', `${service} attempt ${attempt}/${maxAttempts} failed: ${error}`, {
      service,
      attempt,
      maxAttempts,
      error,
      timestamp: Date.now(),
    });
  }

  logTimeout(context, operation, timeoutMs) {
    this.error('Timeout', `${operation} in ${context} exceeded ${timeoutMs}ms`, {
      context,
      operation,
      timeoutMs,
      timestamp: Date.now(),
    });
  }
}

export default new SimpleLogger();
