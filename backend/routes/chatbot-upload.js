import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { validateFile } from '../utils/file-validator.js';
import { saveUploadedFile } from '../utils/file-storage.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer with memory storage and 10MB limit
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Temporary directory - files will be moved by saveUploadedFile
      cb(null, 'uploads/temp');
    },
    filename: function (req, file, cb) {
      // Temporary filename
      cb(null, `temp_${Date.now()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/**
 * POST /api/chatbot/upload-attachment
 * Upload file attachment for chat message
 */
router.post('/upload-attachment', upload.single('file'), async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    const file = req.file;

    // Validate required parameters
    if (!sessionId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: sessionId and userId'
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    // Validate session ownership
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { userId: true }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    if (session.userId !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        error: 'User does not own this session'
      });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Save file to permanent location
    const fileData = await saveUploadedFile(file, userId, sessionId);

    // Create attachment response with temporary ID
    const attachment = {
      id: `temp_${Date.now()}`,
      fileName: fileData.fileName,
      fileUrl: fileData.fileUrl,
      thumbnailUrl: fileData.thumbnailUrl || null,
      fileSize: fileData.fileSize,
      fileType: validation.fileType,
      mimeType: fileData.mimeType
    };

    console.log(`✅ File uploaded: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB) for session ${sessionId}`);

    res.json({
      success: true,
      attachment
    });

  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload file'
    });
  }
});

export default router;
