import express from 'express';
import { v4 as uuidv4 } from 'uuid';

// Import all agents
import chatbotAgent from '../agents/chatbot/chatbot-agent-v2.js';
import purchaseAgent from '../agents/purchase/purchase-agent.js';
import analyticsAgent from '../agents/analytics/analytics-agent.js';
import approvalAgent from '../agents/approval/approval-agent.js';
import supplierAgent from '../agents/supplier/supplier-agent.js';
import documentAgent from '../agents/document/document-agent.js';

const router = express.Router();

/**
 * Agent Registry
 *
 * All available agents are registered here.
 * To add a new agent, just add one line here.
 */
const AGENTS = {
  chatbot: chatbotAgent,
  purchase: purchaseAgent,       // ✅ Procurement expert
  analytics: analyticsAgent,     // ✅ Data analytics expert
  approval: approvalAgent,       // ✅ Approval advisor
  supplier: supplierAgent,       // ✅ Supplier coordinator
  document: documentAgent,       // ✅ Document processing expert
};

/**
 * GET /api/agents/list
 * Get the list of all available agents
 */
router.get('/list', (req, res) => {
  try {
    const agentList = Object.keys(AGENTS).map(key => {
      const agent = AGENTS[key];
      return agent.getInfo();
    });

    res.json({
      success: true,
      count: agentList.length,
      agents: agentList,
    });
  } catch (error) {
    console.error('❌ List Agents Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list agents',
    });
  }
});

/**
 * GET /api/agents/:agentType/info
 * Get detailed info for a specific agent
 */
router.get('/:agentType/info', (req, res) => {
  try {
    const { agentType } = req.params;
    const agent = AGENTS[agentType];

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
        availableAgents: Object.keys(AGENTS),
      });
    }

    res.json({
      success: true,
      agent: agent.getInfo(),
    });
  } catch (error) {
    console.error('❌ Get Agent Info Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get agent info',
    });
  }
});

/**
 * POST /api/agents/:agentType/chat
 * Standard chat with the specified agent
 */
router.post('/:agentType/chat', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { message, userId, sessionId } = req.body;

    // Validate agent type
    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
        availableAgents: Object.keys(AGENTS),
      });
    }

    // Validate required parameters
    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: message and userId',
      });
    }

    // Create new session if no sessionId provided
    const actualSessionId = sessionId || uuidv4();

    console.log(`💬 ${agent.name} request from user ${userId}, session ${actualSessionId}`);

    // Call agent's chat method
    const response = await agent.chat({
      userId,
      message,
      sessionId: actualSessionId,
    });

    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: 'Processing failed',
        error: response.error,
      });
    }

    res.json({
      success: true,
      agentType,
      agentName: agent.name,
      sessionId: actualSessionId,
      message: response.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error('❌ Agent Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Processing failed',
      error: error.message,
    });
  }
});

/**
 * POST /api/agents/:agentType/chat/stream
 * Streaming chat with the specified agent (SSE)
 */
router.post('/:agentType/chat/stream', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { message, userId, sessionId } = req.body;

    // Validate agent type
    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
      });
    }

    // Validate required parameters
    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters',
      });
    }

    const actualSessionId = sessionId || uuidv4();

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    console.log(`💬 ${agent.name} stream request from user ${userId}`);

    // Send sessionId and agent info
    res.write(`data: ${JSON.stringify({
      type: 'session',
      sessionId: actualSessionId,
      agentType,
      agentName: agent.name,
    })}\n\n`);

    const stream = await agent.chatStream({
      userId,
      message,
      sessionId: actualSessionId,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
    }

    // Save complete response
    await agent.saveMessage(actualSessionId, 'assistant', fullResponse);

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('❌ Agent Stream Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
});

/**
 * POST /api/agents/:agentType/new-session
 * Create a new session
 */
router.post('/:agentType/new-session', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { userId } = req.body;

    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    const sessionId = uuidv4();

    // Reserve an id for the client. The session is persisted by agent.chat()
    // only after the first non-empty message is received.
    res.json({
      success: true,
      sessionId,
      agentType,
      agentName: agent.name,
    });
  } catch (error) {
    console.error('❌ New Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
    });
  }
});

/**
 * GET /api/agents/:agentType/sessions
 * Get all of the user's sessions for this agent
 */
router.get('/:agentType/sessions', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { userId } = req.query;

    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    const sessions = await agent.getUserSessions(parseInt(userId));

    res.json({
      success: true,
      agentType,
      agentName: agent.name,
      sessions,
    });
  } catch (error) {
    console.error('❌ Get Sessions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions',
    });
  }
});

/**
 * GET /api/agents/:agentType/history/:sessionId
 * Get session history
 */
router.get('/:agentType/history/:sessionId', async (req, res) => {
  try {
    const { agentType, sessionId } = req.params;

    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
      });
    }

    const messages = await agent.loadSessionHistory(sessionId, 100, 3000, true);

    res.json({
      success: true,
      agentType,
      agentName: agent.name,
      sessionId,
      messages,
    });
  } catch (error) {
    console.error('❌ Get History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve history',
    });
  }
});

/**
 * DELETE /api/agents/:agentType/session/:sessionId
 * Delete a single session
 */
router.delete('/:agentType/session/:sessionId', async (req, res) => {
  try {
    const { agentType, sessionId } = req.params;

    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
      });
    }

    await agent.deleteSession(sessionId);

    res.json({
      success: true,
      message: 'Session deleted',
    });
  } catch (error) {
    console.error('❌ Delete Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
    });
  }
});

/**
 * DELETE /api/agents/:agentType/sessions
 * Delete all of the user's sessions for this agent
 */
router.delete('/:agentType/sessions', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { userId } = req.query;

    const agent = AGENTS[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent type "${agentType}" not found`,
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    const deletedCount = await agent.deleteAllUserSessions(parseInt(userId));

    res.json({
      success: true,
      message: 'All sessions deleted',
      deletedCount,
    });
  } catch (error) {
    console.error('❌ Delete All Sessions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all sessions',
    });
  }
});

export default router;
