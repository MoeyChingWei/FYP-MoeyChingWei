import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import prisma from '../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure file upload
const storage = multer.diskStorage({
  destination: './uploads/sources/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.pdf', '.csv', '.xlsx', '.xls', '.txt', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Allowed: PDF, CSV, Excel, TXT, Word'));
    }
  }
});

/**
 * POST /api/sources/upload
 * Upload a file and parse its content
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId or file',
      });
    }

    const sourceId = uuidv4();
    const fileType = path.extname(req.file.originalname).toLowerCase().slice(1);

    // Create source record
    const source = await prisma.source.create({
      data: {
        id: sourceId,
        userId: parseInt(userId),
        sessionId: sessionId || null,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType,
        fileSize: req.file.size,
      },
    });

    // Parse and chunk the file content
    try {
      const content = await parseFileContent(req.file.path, fileType);
      const chunks = chunkText(content, 1000); // 1000 chars per chunk

      // Save chunks to database
      await Promise.all(
        chunks.map((chunk, index) =>
          prisma.sourceChunk.create({
            data: {
              id: uuidv4(),
              sourceId: source.id,
              content: chunk,
              chunkIndex: index,
            },
          })
        )
      );
    } catch (parseError) {
      console.warn('Failed to parse file content:', parseError);
      // Continue even if parsing fails
    }

    res.json({
      success: true,
      source: {
        id: source.id,
        fileName: source.fileName,
        fileType: source.fileType,
        fileSize: source.fileSize,
        uploadedAt: source.uploadedAt,
      },
    });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file',
    });
  }
});

/**
 * GET /api/sources?userId=1&sessionId=xxx
 * Get user's sources list
 */
router.get('/', async (req, res) => {
  try {
    const { userId, sessionId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    const where = {
      userId: parseInt(userId),
    };

    if (sessionId) {
      where.sessionId = sessionId;
    }

    const sources = await prisma.source.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      include: {
        _count: {
          select: { source_chunks: true },
        },
      },
    });

    res.json({
      success: true,
      sources: sources.map(s => ({
        id: s.id,
        fileName: s.fileName,
        fileType: s.fileType,
        fileSize: s.fileSize,
        uploadedAt: s.uploadedAt,
        chunkCount: s._count.source_chunks,
      })),
    });
  } catch (error) {
    console.error('❌ Get Sources Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sources',
    });
  }
});

/**
 * DELETE /api/sources/:id
 * Delete a source and its file
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter',
      });
    }

    // Find source and verify ownership
    const source = await prisma.source.findUnique({
      where: { id },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found',
      });
    }

    if (source.userId !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Delete file from disk
    try {
      await fs.unlink(source.filePath);
    } catch (fileError) {
      console.warn('Failed to delete file:', fileError);
      // Continue even if file deletion fails
    }

    // Delete from database (cascades to chunks)
    await prisma.source.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Source deleted',
    });
  } catch (error) {
    console.error('❌ Delete Source Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete source',
    });
  }
});

/**
 * Helper: Parse file content
 */
async function parseFileContent(filePath, fileType) {
  if (fileType === 'txt') {
    return await fs.readFile(filePath, 'utf-8');
  }

  if (fileType === 'csv') {
    const content = await fs.readFile(filePath, 'utf-8');
    return content; // Basic CSV parsing - could be enhanced
  }

  // For other types, return placeholder
  return `[${fileType.toUpperCase()} file content - parsing not yet implemented]`;
}

/**
 * Helper: Chunk text into smaller pieces
 */
function chunkText(text, chunkSize = 1000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export default router;
