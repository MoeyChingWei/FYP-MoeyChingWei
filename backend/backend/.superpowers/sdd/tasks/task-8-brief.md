# Task 8: DeepSeek Vision API Integration

## Objective
Add AI image analysis capability to the chatbot. When users upload images, the backend should analyze them using AI and store the analysis results in the database.

## Context
- Task 3 created the upload endpoint for file uploads
- Task 7 integrated chat with attachments
- The frontend MessageAttachment component already displays AI analysis (Task 6)
- Backend has `deepseek-ai-service.js` for API calls

## Research Findings

### DeepSeek API Capabilities
After checking the DeepSeek API documentation (https://api-docs.deepseek.com):
- **Available models**: `deepseek-v4-flash`, `deepseek-v4-pro`, `deepseek-chat`, `deepseek-reasoner`
- **Capabilities**: JSON output, tool calls, thinking mode
- **Vision support**: ❌ NOT SUPPORTED - DeepSeek API does not support vision/image analysis

### Alternative Solution
Since DeepSeek doesn't support vision, we'll use **OpenAI's GPT-4 Vision API** as an alternative:
- Package already installed: `openai` v6.42.0
- Model: `gpt-4-vision-preview` or `gpt-4-turbo` (with vision)
- Requires `OPENAI_API_KEY` environment variable

## Implementation Plan

### 1. Create Vision Service
Create `/backend/services/vision-ai-service.js`:
- Use OpenAI SDK for vision analysis
- Handle image URL or base64 input
- Return structured analysis (description, objects, text, scene)

### 2. Update Chatbot Agent
Modify `/backend/agents/chatbot/chatbot-agent.js`:
- When attachmentData includes images, trigger vision analysis
- Update `aiAnalysis` field in `message_attachments` table
- Handle analysis errors gracefully

### 3. Environment Configuration
Add to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
VISION_MODEL=gpt-4-vision-preview
```

### 4. Database Schema
Already exists in `schema.prisma`:
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
  aiAnalysis   String?  @db.Text  // ✅ Already exists
  uploadedAt   DateTime @default(now())
  metadata     Json?
}
```

## Testing Plan
1. Start the backend server
2. Upload an image through the chat interface
3. Verify the image is analyzed by OpenAI Vision API
4. Check that `aiAnalysis` is stored in the database
5. Confirm the frontend displays the AI analysis

## Success Criteria
- ✅ Vision service created and functional
- ✅ Image uploads trigger automatic analysis
- ✅ Analysis results stored in `message_attachments.aiAnalysis`
- ✅ Error handling for missing API key or failed analysis
- ✅ Documentation updated with alternative approach

## Notes
- DeepSeek may add vision support in future versions
- OpenAI Vision API has usage costs (check pricing)
- Only analyze image files (jpg, png, gif, webp)
- Consider rate limiting for vision API calls
