# Task 2: Backend File Upload Utilities

## Task Brief

**Files:**
- Create: `backend/utils/file-validator.js`
- Create: `backend/utils/image-processor.js`
- Create: `backend/utils/file-storage.js`
- Create: `backend/utils/__tests__/file-validator.test.js`

**Interfaces:**
- Consumes: Node.js fs, path, crypto modules; Sharp library
- Produces: 
  - `validateFile(file)` returns `{valid: boolean, error?: string, fileType: string}`
  - `generateThumbnail(imagePath, outputPath)` returns `Promise<string>`
  - `saveUploadedFile(file, userId, sessionId)` returns `Promise<{fileUrl, thumbnailUrl?, fileName, fileSize, mimeType}>`

## Requirements

**file-validator.js:**
- Max file size: 10MB
- Allowed types: jpg, jpeg, png, gif, webp (image), pdf, xlsx, xls, csv (excel), docx, doc (word), txt (text)
- Return {valid: true, fileType} or {valid: false, error}

**image-processor.js:**
- generateThumbnail: resize to 400x400, fit inside, quality 80%, JPEG output
- compressImage: if > 2MB, compress to quality 75%

**file-storage.js:**
- Save to `/backend/uploads/messages/{sessionId}/`
- Generate unique filename: {originalName}_{timestamp}_{randomHex}{ext}
- For images: generate thumbnail, compress if needed
- Return fileUrl, thumbnailUrl (if image), fileName, fileSize, mimeType

## Steps

Install packages, create utilities with full implementations (from plan), write tests, verify tests pass, commit.

## Global Constraints

- Node.js version: 18+
- Follow existing code style (2-space indentation, semicolons)
- All functions must handle errors gracefully
