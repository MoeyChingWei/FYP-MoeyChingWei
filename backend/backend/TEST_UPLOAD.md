# Test File Upload Endpoint

## Prerequisites
1. Backend server running on http://localhost:4000
2. Valid user session in database

## Test Commands

### 1. Create a test session first
```bash
curl -X POST http://localhost:4000/api/chatbot/new-session \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

Save the sessionId from response.

### 2. Upload a test file

**Using curl (with a test image):**
```bash
# Create a small test image
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > test.png

# Upload the file
curl -X POST http://localhost:4000/api/chatbot/upload-attachment \
  -F "file=@test.png" \
  -F "sessionId=YOUR_SESSION_ID" \
  -F "userId=1"
```

**Expected Response:**
```json
{
  "success": true,
  "attachment": {
    "id": "temp_1234567890",
    "fileName": "test.png",
    "fileUrl": "/uploads/messages/{sessionId}/{uniqueFilename}",
    "thumbnailUrl": "/uploads/messages/{sessionId}/thumb_{filename}.jpg",
    "fileSize": 95,
    "fileType": "image",
    "mimeType": "image/png"
  }
}
```

### 3. Test with different file types

**PDF:**
```bash
echo "test content" > test.pdf
curl -X POST http://localhost:4000/api/chatbot/upload-attachment \
  -F "file=@test.pdf" \
  -F "sessionId=YOUR_SESSION_ID" \
  -F "userId=1"
```

**Text file:**
```bash
echo "Hello World" > test.txt
curl -X POST http://localhost:4000/api/chatbot/upload-attachment \
  -F "file=@test.txt" \
  -F "sessionId=YOUR_SESSION_ID" \
  -F "userId=1"
```

### 4. Test error cases

**File too large (>10MB):**
```bash
dd if=/dev/zero of=large.bin bs=1M count=11
curl -X POST http://localhost:4000/api/chatbot/upload-attachment \
  -F "file=@large.bin" \
  -F "sessionId=YOUR_SESSION_ID" \
  -F "userId=1"
```

Expected: `{"success": false, "error": "File size exceeds maximum allowed size..."}`

**Invalid file type:**
```bash
echo "test" > test.exe
curl -X POST http://localhost:4000/api/chatbot/upload-attachment \
  -F "file=@test.exe" \
  -F "sessionId=YOUR_SESSION_ID" \
  -F "userId=1"
```

Expected: `{"success": false, "error": "File type not allowed..."}`

**Invalid session:**
```bash
curl -X POST http://localhost:4000/api/chatbot/upload-attachment \
  -F "file=@test.png" \
  -F "sessionId=invalid-id" \
  -F "userId=1"
```

Expected: `{"success": false, "error": "Session not found"}`

## Verify Upload

After successful upload, check:
```bash
ls -la backend/uploads/messages/{sessionId}/
```

You should see:
- Original file: `filename_timestamp_hash.ext`
- Thumbnail (for images): `thumb_filename_timestamp_hash.jpg`
