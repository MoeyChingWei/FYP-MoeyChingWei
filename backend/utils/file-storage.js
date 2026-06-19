import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { validateFile, isImage } from './file-validator.js';
import { generateThumbnail, compressImage } from './image-processor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory
const UPLOAD_BASE_DIR = path.join(__dirname, '..', 'uploads', 'messages');

/**
 * Generate a unique filename
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename with format: {name}_{timestamp}_{randomHex}{ext}
 */
function generateUniqueFilename(originalName) {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(4).toString('hex');

  // Sanitize the original name (remove special characters, keep alphanumeric and hyphens)
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');

  return `${sanitizedName}_${timestamp}_${randomHex}${ext}`;
}

/**
 * Ensure directory exists, create if it doesn't
 * @param {string} dirPath - Directory path
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Save an uploaded file to the file system
 * @param {Object} file - Multer file object
 * @param {string} userId - User ID who uploaded the file
 * @param {string} sessionId - Chat session ID
 * @returns {Promise<Object>} - {fileUrl, thumbnailUrl?, fileName, fileSize, mimeType}
 */
export async function saveUploadedFile(file, userId, sessionId) {
  // Validate the file first
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { fileType } = validation;

  // Create session-specific directory
  const sessionDir = path.join(UPLOAD_BASE_DIR, sessionId);
  await ensureDirectoryExists(sessionDir);

  // Generate unique filename
  const uniqueFilename = generateUniqueFilename(file.originalname);
  const filePath = path.join(sessionDir, uniqueFilename);

  // Copy file from temporary location to permanent location
  await fs.copyFile(file.path, filePath);

  // Build result object
  const result = {
    fileUrl: `/uploads/messages/${sessionId}/${uniqueFilename}`,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype
  };

  // Process images: generate thumbnail and compress if needed
  if (isImage(fileType)) {
    try {
      // Compress image if it's larger than 2MB
      const compressionResult = await compressImage(filePath, filePath);

      if (compressionResult.compressed) {
        // Update file size after compression
        result.fileSize = compressionResult.size;
      }

      // Generate thumbnail
      const thumbnailFilename = `thumb_${uniqueFilename.replace(path.extname(uniqueFilename), '.jpg')}`;
      const thumbnailPath = path.join(sessionDir, thumbnailFilename);

      await generateThumbnail(filePath, thumbnailPath);

      result.thumbnailUrl = `/uploads/messages/${sessionId}/${thumbnailFilename}`;
    } catch (error) {
      // Log error but don't fail the upload if thumbnail generation fails
      console.error('Error processing image:', error);
      // Image is still saved, just without thumbnail
    }
  }

  // Clean up temporary file
  try {
    await fs.unlink(file.path);
  } catch (error) {
    // Ignore errors when cleaning up temp file
    console.warn('Failed to delete temporary file:', error);
  }

  return result;
}

/**
 * Delete an uploaded file and its thumbnail
 * @param {string} fileUrl - File URL (e.g., /uploads/messages/{sessionId}/{filename})
 * @param {string} thumbnailUrl - Optional thumbnail URL
 * @returns {Promise<boolean>} - True if deleted successfully
 */
export async function deleteUploadedFile(fileUrl, thumbnailUrl = null) {
  try {
    // Convert URL to file path
    const filePath = path.join(__dirname, '..', fileUrl);

    // Delete main file
    await fs.unlink(filePath);

    // Delete thumbnail if exists
    if (thumbnailUrl) {
      const thumbnailPath = path.join(__dirname, '..', thumbnailUrl);
      try {
        await fs.unlink(thumbnailPath);
      } catch (error) {
        // Thumbnail might not exist, ignore error
        console.warn('Failed to delete thumbnail:', error);
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Get upload directory path for a session
 * @param {string} sessionId - Chat session ID
 * @returns {string} - Absolute path to session upload directory
 */
export function getSessionUploadDir(sessionId) {
  return path.join(UPLOAD_BASE_DIR, sessionId);
}

export default {
  saveUploadedFile,
  deleteUploadedFile,
  getSessionUploadDir,
  UPLOAD_BASE_DIR
};
