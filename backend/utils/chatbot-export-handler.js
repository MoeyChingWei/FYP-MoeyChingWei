import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_API_BASE = process.env.BACKEND_API_BASE || 'http://localhost:5000';
const EXPORT_API_ENDPOINT = '/api/export';
const TIMEOUT_MS = 60000; // 60 seconds
const TEMP_EXPORTS_DIR = path.join(process.cwd(), 'backend', 'temp', 'exports');

// Supported data types and formats
const SUPPORTED_DATA_TYPES = ['purchase-requests', 'purchase-orders', 'invoices', 'suppliers'];
const SUPPORTED_FORMATS = ['pdf', 'excel', 'csv', 'json'];

// Extension mapping
const FORMAT_EXTENSION_MAP = {
  pdf: 'pdf',
  excel: 'xlsx',
  csv: 'csv',
  json: 'json',
};

/**
 * Handle export request from chatbot
 * @param {Object} params - Export parameters
 * @param {string} params.dataType - Type of data to export (purchase-requests, purchase-orders, invoices, suppliers)
 * @param {string} params.format - Export format (pdf, excel, csv, json)
 * @param {Object} params.filters - Optional filters (status, dateRange, department, limit)
 * @param {number} params.userId - User ID making the request
 * @param {string} params.userRole - User role (for permissions)
 * @param {string} params.userDepartment - User department (for permissions)
 * @returns {Promise<Object>} Export metadata with download URL
 */
export async function handleExport({
  dataType,
  format,
  filters = {},
  userId,
  userRole,
  userDepartment,
}) {
  // Validate inputs
  if (!dataType || !SUPPORTED_DATA_TYPES.includes(dataType)) {
    return {
      success: false,
      error: 'INVALID_DATA_TYPE',
      message: `Invalid data type. Supported types: ${SUPPORTED_DATA_TYPES.join(', ')}`,
    };
  }

  if (!format || !SUPPORTED_FORMATS.includes(format)) {
    return {
      success: false,
      error: 'INVALID_FORMAT',
      message: `Invalid format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
    };
  }

  if (!userId || !userRole) {
    return {
      success: false,
      error: 'MISSING_AUTH',
      message: 'User authentication required for export',
    };
  }

  // Prepare request payload
  const payload = {
    format,
    filters: {
      status: filters.status || 'ALL',
      dateRange: filters.dateRange,
      department: filters.department,
      limit: filters.limit || 100,
    },
    userId,
    userRole,
    userDepartment,
  };

  try {
    // Ensure temp directory exists
    await fs.mkdir(TEMP_EXPORTS_DIR, { recursive: true });

    // Call backend export API
    const apiUrl = `${BACKEND_API_BASE}${EXPORT_API_ENDPOINT}/${dataType}`;

    console.log(`[Export Handler] Calling export API: ${apiUrl}`);
    console.log(`[Export Handler] Format: ${format}, Filters:`, filters);

    const response = await axios.post(apiUrl, payload, {
      responseType: 'arraybuffer',
      timeout: TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = FORMAT_EXTENSION_MAP[format];
    const filename = `${dataType}-${timestamp}.${extension}`;
    const filePath = path.join(TEMP_EXPORTS_DIR, filename);

    // Save file to temp directory
    await fs.writeFile(filePath, response.data);

    console.log(`[Export Handler] File saved: ${filePath}`);

    // Extract record count from response headers (if available)
    const recordCount = response.headers['x-record-count']
      ? parseInt(response.headers['x-record-count'], 10)
      : null;

    // Return metadata
    return {
      success: true,
      dataType,
      format,
      filename,
      filePath,
      downloadUrl: `/api/chatbot/download/${filename}`,
      recordCount,
      filters: {
        status: filters.status || 'ALL',
        department: filters.department || userDepartment || 'All',
        limit: filters.limit || 100,
      },
      timestamp: new Date().toISOString(),
      message: `Successfully exported ${dataType} to ${format} format`,
    };

  } catch (error) {
    console.error(`[Export Handler] Error:`, error.message);

    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        error: 'CONNECTION_REFUSED',
        message: 'Unable to connect to export service. Please try again later.',
      };
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'TIMEOUT',
        message: 'Export request timed out. Try exporting fewer records or contact support.',
      };
    }

    // Handle HTTP errors
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;

      // Try to parse error message from response
      let errorMessage = 'Export failed';
      if (responseData) {
        try {
          // If response is JSON
          if (typeof responseData === 'object' && responseData.message) {
            errorMessage = responseData.message;
          } else {
            // If response is buffer, try to decode
            const decoded = Buffer.from(responseData).toString('utf-8');
            const parsed = JSON.parse(decoded);
            errorMessage = parsed.message || errorMessage;
          }
        } catch (parseError) {
          // Use default error message
        }
      }

      switch (status) {
        case 403:
          return {
            success: false,
            error: 'PERMISSION_DENIED',
            message: 'You do not have permission to export this data. Contact your administrator.',
          };

        case 404:
          return {
            success: false,
            error: 'NO_DATA',
            message: errorMessage || 'No records found matching your criteria. Try adjusting your filters.',
          };

        case 400:
          return {
            success: false,
            error: 'BAD_REQUEST',
            message: errorMessage || 'Invalid export request. Please check your parameters.',
          };

        case 500:
        case 502:
        case 503:
          return {
            success: false,
            error: 'SERVER_ERROR',
            message: `Export service error: ${errorMessage}. Please try again later.`,
          };

        default:
          return {
            success: false,
            error: 'HTTP_ERROR',
            message: `Export failed with status ${status}: ${errorMessage}`,
          };
      }
    }

    // Generic error
    return {
      success: false,
      error: 'UNKNOWN_ERROR',
      message: `Export failed: ${error.message || 'Unknown error occurred'}`,
    };
  }
}

/**
 * Clean up old export files (older than 1 hour)
 * @returns {Promise<number>} Number of files deleted
 */
export async function cleanupOldExports() {
  try {
    const files = await fs.readdir(TEMP_EXPORTS_DIR);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(TEMP_EXPORTS_DIR, file);
      const stats = await fs.stat(filePath);
      const age = now - stats.mtimeMs;

      if (age > ONE_HOUR) {
        await fs.unlink(filePath);
        deletedCount++;
        console.log(`[Export Handler] Deleted old export file: ${file}`);
      }
    }

    return deletedCount;
  } catch (error) {
    console.error(`[Export Handler] Cleanup error:`, error.message);
    return 0;
  }
}

/**
 * Get file info from temp directory
 * @param {string} filename - Filename to retrieve
 * @returns {Promise<Object|null>} File info or null if not found
 */
export async function getExportFile(filename) {
  try {
    const filePath = path.join(TEMP_EXPORTS_DIR, filename);
    const stats = await fs.stat(filePath);

    return {
      filename,
      filePath,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export default {
  handleExport,
  cleanupOldExports,
  getExportFile,
};
