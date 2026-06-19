import mime from 'mime-types';

// File validation configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',

  // PDF
  'application/pdf': 'pdf',

  // Excel
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel', // xlsx
  'application/vnd.ms-excel': 'excel', // xls
  'text/csv': 'excel',

  // Word
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word', // docx
  'application/msword': 'word', // doc

  // Text
  'text/plain': 'text'
};

const ALLOWED_EXTENSIONS = [
  // Images
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  // PDF
  '.pdf',
  // Excel
  '.xlsx', '.xls', '.csv',
  // Word
  '.docx', '.doc',
  // Text
  '.txt'
];

/**
 * Validates an uploaded file based on size and type
 * @param {Object} file - Multer file object with properties: originalname, mimetype, size
 * @returns {Object} - {valid: boolean, error?: string, fileType?: string}
 */
export function validateFile(file) {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file provided'
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Validate MIME type
  const mimeType = file.mimetype.toLowerCase();
  const fileType = ALLOWED_MIME_TYPES[mimeType];

  if (!fileType) {
    return {
      valid: false,
      error: 'File type not allowed. Supported types: images (jpg, png, gif, webp), PDF, Excel, Word, and text files'
    };
  }

  // Additional validation: check file extension
  const extension = file.originalname.toLowerCase().match(/\.[^.]*$/)?.[0];

  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'File extension not allowed'
    };
  }

  // File is valid
  return {
    valid: true,
    fileType
  };
}

/**
 * Get file type category from MIME type
 * @param {string} mimeType - MIME type string
 * @returns {string|null} - File type category or null if not allowed
 */
export function getFileTypeFromMime(mimeType) {
  return ALLOWED_MIME_TYPES[mimeType.toLowerCase()] || null;
}

/**
 * Check if a file type is an image
 * @param {string} fileType - File type category
 * @returns {boolean}
 */
export function isImage(fileType) {
  return fileType === 'image';
}

export default {
  validateFile,
  getFileTypeFromMime,
  isImage,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS
};
