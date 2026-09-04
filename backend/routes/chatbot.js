import express from 'express';
// Keep the legacy /api/chatbot contract, but route it through the enhanced agent.
import chatbotAgent from '../agents/chatbot/chatbot-agent-v2.js';
import legacyChatbotAgent from '../agents/chatbot/chatbot-agent.js';
import prisma from '../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import { exportPurchaseRequestsToCSV, exportPurchaseRequestsToJSON, generateExportFilename } from '../utils/export-purchase-requests.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * POST /api/chatbot/chat
 * Standard ChatBot chat endpoint
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, sessionId, attachmentData } = req.body;

    // Validate required parameters
    // Allow empty message if attachments are present
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: userId',
      });
    }

    if (!message && (!attachmentData || attachmentData.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message or attachments required',
      });
    }

    // Create new session if no sessionId provided
    const actualSessionId = sessionId || uuidv4();

    console.log(`💬 ChatBot request from user ${userId}, session ${actualSessionId}`);
    if (attachmentData && attachmentData.length > 0) {
      console.log(`📎 With ${attachmentData.length} attachment(s)`);
    }

    // Keep attachment/image analysis on the legacy implementation until that
    // capability is ported to v2. Normal messages use the enhanced agent.
    const activeAgent = attachmentData?.length ? legacyChatbotAgent : chatbotAgent;
    const response = await activeAgent.chat({
      userId,
      message,
      sessionId: actualSessionId,
      attachmentData: attachmentData || undefined,
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
      sessionId: actualSessionId,
      message: response.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error('❌ ChatBot Error:', error);
    res.status(500).json({
      success: false,
      message: 'Processing failed',
      error: error.message,
    });
  }
});

/**
 * POST /api/chatbot/chat/stream
 * Streaming chat endpoint (SSE - Server-Sent Events)
 */
router.post('/chat/stream', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;

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

    console.log(`💬 ChatBot stream request from user ${userId}`);

    // Send sessionId
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: actualSessionId })}\n\n`);

    const stream = await chatbotAgent.chatStream({
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
    await chatbotAgent.saveMessage(actualSessionId, 'assistant', fullResponse);

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('❌ ChatBot Stream Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
});

/**
 * GET /api/chatbot/sessions
 * Get the user's session list
 */
router.get('/sessions', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    const sessions = await chatbotAgent.getUserSessions(parseInt(userId));

    res.json({
      success: true,
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
 * GET /api/chatbot/history/:sessionId
 * Get session history with attachments
 */
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Load messages with attachments included
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 100,
      include: {
        message_attachments: true,
      },
    });

    res.json({
      success: true,
      messages: messages.map(({ message_attachments, ...message }) => ({
        ...message,
        attachments: message_attachments,
      })),
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
 * DELETE /api/chatbot/session/:sessionId
 * Delete session
 */
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const deleted = await chatbotAgent.deleteSession(sessionId);

    res.json({
      success: true,
      message: deleted ? 'Session deleted' : 'Session already deleted',
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
 * PATCH /api/chatbot/session/:sessionId
 * Rename session
 */
router.patch('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title, userId } = req.body;
    const nextTitle = String(title || '').trim();

    if (!nextTitle) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (nextTitle.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Title must be 80 characters or less',
      });
    }

    const where = userId
      ? { id: sessionId, userId: parseInt(userId) }
      : { id: sessionId };

    const result = await prisma.chatSession.updateMany({
      where,
      data: { title: nextTitle },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        _count: {
          select: { chat_messages: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Session renamed',
      session: session
        ? {
            ...session,
            _count: { messages: session._count.chat_messages },
          }
        : null,
    });
  } catch (error) {
    console.error('âŒ Rename Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rename session',
    });
  }
});

/**
 * DELETE /api/chatbot/sessions
 * Delete all sessions for a user
 */
router.delete('/sessions', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    const deletedCount = await chatbotAgent.deleteAllUserSessions(parseInt(userId));

    res.json({
      success: true,
      message: 'All chat history deleted',
      deletedCount,
    });
  } catch (error) {
    console.error('âŒ Delete All Sessions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all sessions',
    });
  }
});

/**
 * POST /api/chatbot/new-session
 * Create new session
 */
router.post('/new-session', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    const sessionId = uuidv4();

    await chatbotAgent.ensureSession(sessionId, userId);

    res.json({
      success: true,
      sessionId,
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
 * POST /api/chatbot/export-purchase-requests
 * Export purchase requests to CSV or JSON format
 */
router.post('/export-purchase-requests', async (req, res) => {
  try {
    const { userId, format = 'csv', status = 'ALL', limit = 100 } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    console.log(`📥 Export request from user ${userId}, format: ${format}, status: ${status}`);

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { department: true, role: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Fetch purchase requests
    const records = await prisma.purchaseRequestRecord.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Filter by department (unless Super Admin)
    let filteredRecords = records;
    if (user.department && user.role !== 'Super Admin') {
      filteredRecords = records.filter(r => r.payload.department === user.department);
    }

    // Filter by status
    if (status !== 'ALL') {
      filteredRecords = filteredRecords.filter(r => r.payload.status === status);
    }

    if (filteredRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No purchase requests found to export',
      });
    }

    // Map to export format
    const requestsForExport = filteredRecords.map(r => ({
      prNumber: r.payload.prNumber,
      status: r.payload.status,
      department: r.payload.department,
      requestBy: r.payload.requestBy,
      requestDate: r.payload.requestDate,
      createdByEmail: r.payload.createdByEmail,
      currency: r.payload.currency,
      urgency: r.payload.urgency || 'normal',
      procurementNotes: r.payload.procurementNotes || '',
      lineItems: r.payload.lineItems || [],
    }));

    // Generate export data
    let exportData, mimeType, filename;
    try {
      if (format === 'json') {
        exportData = exportPurchaseRequestsToJSON(requestsForExport);
        mimeType = 'application/json';
        filename = generateExportFilename('json', user.department);
      } else {
        exportData = exportPurchaseRequestsToCSV(requestsForExport);
        mimeType = 'text/csv';
        filename = generateExportFilename('csv', user.department);
      }
    } catch (error) {
      console.error('❌ Export generation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate export file',
        error: error.message,
      });
    }

    console.log(`✅ Export generated: ${filteredRecords.length} records, ${format.toUpperCase()}`);

    // Set headers for file download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Record-Count', filteredRecords.length);
    res.setHeader('X-Export-Status', status);
    res.setHeader('X-Export-Department', user.department || 'All');

    res.send(exportData);
  } catch (error) {
    console.error('❌ Export Purchase Requests Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export purchase requests',
      error: error.message,
    });
  }
});

/**
 * GET /api/chatbot/download/:filename
 * Download exported files with security validation and auto-cleanup
 */
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename format (security)
    const filenameRegex = /^[a-zA-Z0-9-]+\.(pdf|xlsx|csv|json)$/;
    if (!filenameRegex.test(filename)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename format',
      });
    }

    // Construct file path
    // Chatbot export handler stores generated files in backend/temp/exports.
    // Resolve from this module so downloads work regardless of the process cwd.
    const exportsDir = path.join(__dirname, '..', 'temp', 'exports');
    const filePath = path.join(exportsDir, filename);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap = {
      '.pdf': 'application/pdf',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv': 'text/csv',
      '.json': 'application/json',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Auto-delete file after 5 seconds
    fileStream.on('end', () => {
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`❌ Failed to delete file ${filename}:`, err);
          } else {
            console.log(`🗑️ Auto-deleted: ${filename}`);
          }
        });
      }, 5000);
    });

    console.log(`📥 Download initiated: ${filename}`);
  } catch (error) {
    console.error('❌ Download Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message,
    });
  }
});

export default router;
