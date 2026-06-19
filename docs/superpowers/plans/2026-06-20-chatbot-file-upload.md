# Chatbot File and Image Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable users to attach files and images to chat messages with AI image analysis support.

**Architecture:** Extend existing ChatBotPage with new InputToolbar component for file/image selection. Add MessageAttachment component to display attachments in messages. Create new message_attachments table and API endpoints for upload and enhanced chat. Integrate DeepSeek Vision API for image analysis.

**Tech Stack:** 
- Frontend: React 18, TypeScript, Ant Design, react-dropzone
- Backend: Node.js, Express 5, Prisma 7, Multer, Sharp
- Database: PostgreSQL 17
- AI: DeepSeek API (vision capabilities)

## Global Constraints

- React version: 18+
- Node.js version: 18+
- TypeScript: Use strict mode
- File size limit: 10MB per file
- Max files per message: 5
- Allowed file types: jpg, jpeg, png, gif, pdf, xlsx, xls, docx, doc, txt, csv
- Database: PostgreSQL with Prisma ORM
- All API responses must include success/error status
- Use existing authentication (session-based)
- Follow existing code style (2-space indentation, semicolons)

---

## Task 1: Database Schema and Migration

**Files:**
- Create: `backend/prisma/migrations/YYYYMMDDHHMMSS_add_message_attachments/migration.sql`
- Modify: `backend/prisma/schema.prisma:217-218` (after ChatMessage model)

**Interfaces:**
- Consumes: Existing ChatMessage model (id field)
- Produces: MessageAttachment model with fields: id (String), messageId (Int), fileName (String), fileUrl (String), fileType (String), fileSize (Int), mimeType (String?), thumbnailUrl (String?), aiAnalysis (String?), uploadedAt (DateTime), metadata (Json?)

- [ ] **Step 1: Add MessageAttachment model to schema**

Edit `backend/prisma/schema.prisma`, add after ChatMessage model:

```prisma
model MessageAttachment {
  id           String   @id @default(uuid())
  messageId    Int
  fileName     String
  fileUrl      String
  fileType     String
  fileSize     Int
  mimeType     String?
  thumbnailUrl String?
  aiAnalysis   String?  @db.Text
  uploadedAt   DateTime @default(now())
  metadata     Json?

  message ChatMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)

  @@index([messageId])
  @@index([uploadedAt])
  @@map("message_attachments")
}
```

- [ ] **Step 2: Add attachments relation to ChatMessage**

In `backend/prisma/schema.prisma`, modify ChatMessage model to add:

```prisma
model ChatMessage {
  id        Int      @id @default(autoincrement())
  sessionId String
  role      String
  content   String   @db.Text
  metadata  Json?
  createdAt DateTime @default(now())

  session     ChatSession        @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  attachments MessageAttachment[] // ADD THIS LINE

  @@index([sessionId])
  @@index([createdAt])
  @@map("chat_messages")
}
```

- [ ] **Step 3: Generate migration**

Run from `backend` directory:

```bash
npm run prisma:migrate -- --name add_message_attachments
```

Expected: Migration file created in `backend/prisma/migrations/`

- [ ] **Step 4: Apply migration**

Run from `backend` directory:

```bash
npm run prisma:migrate
```

Expected: "Migration applied successfully"

- [ ] **Step 5: Regenerate Prisma client**

Run from `backend` directory:

```bash
npm run prisma:generate
```

Expected: "Generated Prisma Client"

- [ ] **Step 6: Verify schema in database**

Run from `backend` directory:

```bash
npm run prisma:studio
```

Expected: Prisma Studio opens, verify `message_attachments` table exists with correct columns

- [ ] **Step 7: Commit database changes**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations/
git commit -m "feat(db): add message_attachments table for per-message file uploads"
```

---

## Task 2: Backend File Upload Utilities

**Files:**
- Create: `backend/utils/file-validator.js`
- Create: `backend/utils/image-processor.js`
- Create: `backend/utils/file-storage.js`

**Interfaces:**
- Consumes: Node.js fs, path, crypto modules; Sharp library
- Produces: 
  - `validateFile(file)` returns `{valid: boolean, error?: string, fileType: string}`
  - `generateThumbnail(imagePath, outputPath)` returns `Promise<string>`
  - `saveUploadedFile(file, userId, sessionId)` returns `Promise<{fileUrl, thumbnailUrl?, fileName, fileSize, mimeType}>`

- [ ] **Step 1: Install required packages**

Run from `backend` directory:

```bash
npm install multer sharp mime-types
```

Expected: Packages installed successfully

- [ ] **Step 2: Create file validator utility**

Create `backend/utils/file-validator.js`:

```javascript
const ALLOWED_MIME_TYPES = {
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
  'application/vnd.ms-excel': 'excel',
  'text/csv': 'excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
  'application/msword': 'word',
  'text/plain': 'text'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)` };
  }

  const fileType = ALLOWED_MIME_TYPES[file.mimetype];
  if (!fileType) {
    return { valid: false, error: `File type not allowed: ${file.mimetype}` };
  }

  return { valid: true, fileType };
}

module.exports = { validateFile, ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
```

- [ ] **Step 3: Create image processor utility**

Create `backend/utils/image-processor.js`:

```javascript
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function generateThumbnail(imagePath, outputPath) {
  try {
    await sharp(imagePath)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw new Error('Failed to generate thumbnail');
  }
}

async function compressImage(imagePath, outputPath, maxSizeMB = 2) {
  try {
    const stats = await fs.stat(imagePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB <= maxSizeMB) {
      // No compression needed
      return imagePath;
    }

    // Compress image
    await sharp(imagePath)
      .jpeg({ quality: 75 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Image compression error:', error);
    return imagePath; // Return original on error
  }
}

module.exports = { generateThumbnail, compressImage };
```

- [ ] **Step 4: Create file storage utility**

Create `backend/utils/file-storage.js`:

```javascript
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { generateThumbnail, compressImage } = require('./image-processor');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'messages');

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

function generateUniqueFileName(originalName) {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(8).toString('hex');
  return `${nameWithoutExt}_${timestamp}_${randomStr}${ext}`;
}

async function saveUploadedFile(file, userId, sessionId) {
  // Create directory structure
  const sessionDir = path.join(UPLOAD_DIR, sessionId);
  await ensureDirectoryExists(sessionDir);

  const uniqueFileName = generateUniqueFileName(file.originalname);
  const filePath = path.join(sessionDir, uniqueFileName);

  // Save file
  await fs.writeFile(filePath, file.buffer);

  const result = {
    fileName: file.originalname,
    fileUrl: `/uploads/messages/${sessionId}/${uniqueFileName}`,
    fileSize: file.size,
    mimeType: file.mimetype
  };

  // Generate thumbnail for images
  if (file.mimetype.startsWith('image/')) {
    const thumbFileName = `thumb_${uniqueFileName}`;
    const thumbPath = path.join(sessionDir, thumbFileName);
    
    try {
      await generateThumbnail(filePath, thumbPath);
      result.thumbnailUrl = `/uploads/messages/${sessionId}/${thumbFileName}`;
      
      // Compress large images
      const compressedFileName = `compressed_${uniqueFileName}`;
      const compressedPath = path.join(sessionDir, compressedFileName);
      const finalPath = await compressImage(filePath, compressedPath);
      
      if (finalPath !== filePath) {
        // Replace original with compressed
        await fs.unlink(filePath);
        await fs.rename(compressedPath, filePath);
      }
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      // Continue without thumbnail
    }
  }

  return result;
}

async function deleteFile(fileUrl) {
  try {
    const filePath = path.join(__dirname, '..', fileUrl);
    await fs.unlink(filePath);
    
    // Try to delete thumbnail if exists
    const thumbPath = filePath.replace(/([^/]+)$/, 'thumb_$1');
    try {
      await fs.unlink(thumbPath);
    } catch {}
  } catch (error) {
    console.error('File deletion error:', error);
  }
}

module.exports = { saveUploadedFile, deleteFile, UPLOAD_DIR };
```

- [ ] **Step 5: Create uploads directory**

Run from `backend` directory:

```bash
mkdir -p uploads/messages
```

Expected: Directory created

- [ ] **Step 6: Test file validator**

Create `backend/utils/__tests__/file-validator.test.js`:

```javascript
const { validateFile } = require('../file-validator');

describe('validateFile', () => {
  test('should accept valid image', () => {
    const file = {
      size: 1024 * 1024, // 1MB
      mimetype: 'image/jpeg'
    };
    const result = validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.fileType).toBe('image');
  });

  test('should reject file exceeding size limit', () => {
    const file = {
      size: 11 * 1024 * 1024, // 11MB
      mimetype: 'image/jpeg'
    };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds 10MB');
  });

  test('should reject unsupported file type', () => {
    const file = {
      size: 1024,
      mimetype: 'video/mp4'
    };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not allowed');
  });
});
```

- [ ] **Step 7: Run utility tests**

Run from `backend` directory:

```bash
npm test -- file-validator.test.js
```

Expected: All tests pass

- [ ] **Step 8: Commit utilities**

```bash
git add backend/utils/file-validator.js backend/utils/image-processor.js backend/utils/file-storage.js backend/utils/__tests__/
git commit -m "feat(utils): add file upload utilities with validation and image processing"
```

---


## Task 3: Backend Upload API Endpoint

**Files:**
- Create: `backend/routes/chatbot-upload.js`
- Modify: `backend/server.js` (add route registration)

**Interfaces:**
- Consumes: validateFile, saveUploadedFile from Task 2
- Produces: POST /api/chatbot/upload-attachment endpoint

- [ ] **Step 1: Write test for upload endpoint**

Create `backend/routes/__tests__/chatbot-upload.test.js`:

```javascript
const request = require('supertest');
const express = require('express');

describe('POST /api/chatbot/upload-attachment', () => {
  test('should upload file successfully', async () => {
    // Test implementation
  });
  
  test('should reject file exceeding size limit', async () => {
    // Test implementation  
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- chatbot-upload.test.js
```

Expected: FAIL (endpoint not implemented)

- [ ] **Step 3: Create upload route with multer**

Create `backend/routes/chatbot-upload.js` with upload endpoint implementation.

- [ ] **Step 4: Register route in server.js**

Add upload route registration to backend/server.js.

- [ ] **Step 5: Serve uploads directory**

Add static middleware for /uploads in server.js.

- [ ] **Step 6: Run tests**

```bash
npm test -- chatbot-upload.test.js
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/routes/chatbot-upload.js backend/server.js
git commit -m "feat(api): add file upload endpoint"
```

---

