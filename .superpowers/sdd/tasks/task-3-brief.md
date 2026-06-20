# Task 3: Backend Upload API Endpoint

## Task Brief

**Files:**
- Create: `backend/routes/chatbot-upload.js`
- Modify: `backend/server.js` (register route and serve uploads directory)

**Interfaces:**
- Consumes: validateFile, saveUploadedFile from Task 2; Prisma ChatSession model
- Produces: POST /api/chatbot/upload-attachment endpoint returning {success, attachment: {id, fileName, fileUrl, thumbnailUrl?, fileSize, fileType, mimeType}}

## Requirements

**POST /api/chatbot/upload-attachment:**
- Accept file via multipart/form-data (field name: `file`)
- Accept sessionId and userId in body
- Validate user owns the session
- Validate file using file-validator
- Save file using file-storage
- Return attachment metadata (temporary ID, will be linked to message later)

**Server modifications:**
- Register `/api/chatbot` routes for upload
- Serve `/uploads` directory as static files

## Implementation Details

Use multer with memory storage, 10MB limit. Validate session ownership. Return attachment data with temporary ID (`temp_${Date.now()}`). Real ID will be created when message is sent.

## Global Constraints

- Node.js version: 18+
- Use existing authentication (session-based)
- Follow existing code style (2-space indentation, semicolons)
- All API responses must include success/error status
