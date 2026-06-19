import { describe, it, expect } from 'vitest';
import { validateFile, getFileTypeFromMime, isImage } from '../file-validator.js';

describe('file-validator', () => {
  describe('validateFile', () => {
    it('should reject when no file is provided', () => {
      const result = validateFile(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('No file provided');
    });

    it('should reject files exceeding 10MB', () => {
      const file = {
        originalname: 'large-file.jpg',
        mimetype: 'image/jpeg',
        size: 11 * 1024 * 1024 // 11MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });

    it('should accept valid JPEG image', () => {
      const file = {
        originalname: 'photo.jpg',
        mimetype: 'image/jpeg',
        size: 2 * 1024 * 1024 // 2MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('image');
    });

    it('should accept valid PNG image', () => {
      const file = {
        originalname: 'screenshot.png',
        mimetype: 'image/png',
        size: 1 * 1024 * 1024 // 1MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('image');
    });

    it('should accept valid PDF file', () => {
      const file = {
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        size: 5 * 1024 * 1024 // 5MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('pdf');
    });

    it('should accept valid Excel file (xlsx)', () => {
      const file = {
        originalname: 'spreadsheet.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 3 * 1024 * 1024 // 3MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('excel');
    });

    it('should accept valid CSV file', () => {
      const file = {
        originalname: 'data.csv',
        mimetype: 'text/csv',
        size: 1 * 1024 * 1024 // 1MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('excel');
    });

    it('should accept valid Word file (docx)', () => {
      const file = {
        originalname: 'report.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 2 * 1024 * 1024 // 2MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('word');
    });

    it('should accept valid text file', () => {
      const file = {
        originalname: 'notes.txt',
        mimetype: 'text/plain',
        size: 100 * 1024 // 100KB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('text');
    });

    it('should reject unsupported file types', () => {
      const file = {
        originalname: 'video.mp4',
        mimetype: 'video/mp4',
        size: 5 * 1024 * 1024 // 5MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should reject files with invalid extensions', () => {
      const file = {
        originalname: 'file.exe',
        mimetype: 'application/x-msdownload',
        size: 1 * 1024 * 1024 // 1MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should handle files with uppercase extensions', () => {
      const file = {
        originalname: 'PHOTO.JPG',
        mimetype: 'image/jpeg',
        size: 2 * 1024 * 1024 // 2MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('image');
    });

    it('should accept GIF images', () => {
      const file = {
        originalname: 'animation.gif',
        mimetype: 'image/gif',
        size: 3 * 1024 * 1024 // 3MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('image');
    });

    it('should accept WebP images', () => {
      const file = {
        originalname: 'modern-image.webp',
        mimetype: 'image/webp',
        size: 1.5 * 1024 * 1024 // 1.5MB
      };

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.fileType).toBe('image');
    });
  });

  describe('getFileTypeFromMime', () => {
    it('should return "image" for image MIME types', () => {
      expect(getFileTypeFromMime('image/jpeg')).toBe('image');
      expect(getFileTypeFromMime('image/png')).toBe('image');
      expect(getFileTypeFromMime('image/gif')).toBe('image');
    });

    it('should return "pdf" for PDF MIME type', () => {
      expect(getFileTypeFromMime('application/pdf')).toBe('pdf');
    });

    it('should return "excel" for Excel MIME types', () => {
      expect(getFileTypeFromMime('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toBe('excel');
      expect(getFileTypeFromMime('text/csv')).toBe('excel');
    });

    it('should return null for unsupported MIME types', () => {
      expect(getFileTypeFromMime('video/mp4')).toBeNull();
      expect(getFileTypeFromMime('application/zip')).toBeNull();
    });

    it('should handle case-insensitive MIME types', () => {
      expect(getFileTypeFromMime('IMAGE/JPEG')).toBe('image');
      expect(getFileTypeFromMime('Application/PDF')).toBe('pdf');
    });
  });

  describe('isImage', () => {
    it('should return true for "image" file type', () => {
      expect(isImage('image')).toBe(true);
    });

    it('should return false for non-image file types', () => {
      expect(isImage('pdf')).toBe(false);
      expect(isImage('excel')).toBe(false);
      expect(isImage('word')).toBe(false);
      expect(isImage('text')).toBe(false);
    });
  });
});
