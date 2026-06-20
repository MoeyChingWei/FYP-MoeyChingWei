# AI Vision Integration Guide

## Overview

This chatbot system includes AI-powered image analysis that automatically analyzes uploaded images and provides detailed descriptions. When users upload images in chat, the system analyzes them using OpenAI's GPT-4 Vision API.

## Why OpenAI Vision Instead of DeepSeek?

**DeepSeek API does not support vision/image analysis** as of June 2026. After checking their API documentation:
- Available models: `deepseek-v4-flash`, `deepseek-v4-pro`, `deepseek-chat`, `deepseek-reasoner`
- Features: Text chat, JSON output, tool calls, thinking mode
- **No multimodal or vision capabilities**

Therefore, we use OpenAI's GPT-4 Vision API as the vision provider.

## Setup

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables

Add to your `/backend/.env` file:

```env
# AI Vision API (for image analysis in chatbot)
OPENAI_API_KEY=sk-your-actual-api-key-here
VISION_MODEL=gpt-4-turbo
```

**Model Options**:
- `gpt-4-turbo` (recommended) - Latest model with vision, faster and cheaper
- `gpt-4-vision-preview` - Original vision model

### 3. Restart the Server

```bash
cd backend
npm start
```

You should see:
```
✅ [SUCCESS] VisionAIService: Initialized with model: gpt-4-turbo
```

## How It Works

### Automatic Analysis Flow

1. **User uploads image** in chat with a message
2. **Backend saves** message and attachment records
3. **Vision service** automatically analyzes the image (async, non-blocking)
4. **AI analysis stored** in `message_attachments.aiAnalysis` field
5. **Frontend displays** the analysis alongside the image

### Code Flow

```javascript
// When user sends message with attachments
POST /api/chatbot/chat
  ↓
chatbotAgent.chat({ userId, message, attachmentData })
  ↓
chatbotAgent.saveMessage(sessionId, 'user', message, null, attachmentData)
  ↓
// Async image analysis triggered
chatbotAgent.analyzeAttachmentImages(messageId, attachmentData)
  ↓
visionService.analyzeImage(imageUrl, fileName)
  ↓
// Analysis saved to database
prisma.messageAttachment.updateMany({ aiAnalysis: result.analysis })
```

### Supported Image Types

- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ PNG (`.png`)
- ✅ GIF (`.gif`)
- ✅ WebP (`.webp`)
- ❌ PDF, DOC, TXT (not analyzed)

## Testing

### Test 1: Service Status

```bash
cd backend
node test-vision-service.js
```

**Expected output** (with API key configured):
```
🧪 Testing Vision AI Service

1. Checking service status...
✅ Vision service is enabled

2. Testing image file detection...
   ✅ test.jpg (image/jpeg): true
   ✅ test.png (image/png): true
   ✅ test.pdf (application/pdf): false
   ✅ photo.JPG (no mime): true

3. Testing image analysis...
   Using sample image: OpenAI logo
✅ Image analysis successful!

📝 Analysis Result:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Detailed image description]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Token Usage:
   - Prompt tokens: 300
   - Completion tokens: 150
   - Total tokens: 450
   - Model: gpt-4-turbo
```

### Test 2: Upload via API

```bash
# Upload an image through the chatbot
curl -X POST http://localhost:4000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "message": "What do you see in this image?",
    "attachmentData": [
      {
        "fileName": "product.jpg",
        "fileUrl": "http://localhost:4000/uploads/product.jpg",
        "fileType": "image",
        "fileSize": 153600,
        "mimeType": "image/jpeg"
      }
    ]
  }'
```

### Test 3: Check Database

```sql
-- View recent image analyses
SELECT 
  fileName, 
  mimeType,
  LEFT(aiAnalysis, 100) as analysis_preview,
  uploadedAt
FROM message_attachments
WHERE aiAnalysis IS NOT NULL
ORDER BY uploadedAt DESC
LIMIT 5;
```

## API Costs

### OpenAI GPT-4 Vision Pricing (as of 2024)

- **Input**: ~$0.01 per 1,000 tokens
- **Output**: ~$0.03 per 1,000 tokens
- **Average per image**: $0.01 - $0.03

### Token Usage Estimates

- Image encoding: ~200-400 tokens
- Prompt: ~100 tokens
- Completion: ~200-500 tokens
- **Total**: 500-1000 tokens per image

### Cost Control Tips

1. **Set usage limits** in OpenAI dashboard
2. **Monitor usage** regularly
3. **Disable for non-critical images** if needed
4. **Consider caching** for duplicate images

## Configuration Options

### Change Analysis Prompt

Edit `/backend/services/vision-ai-service.js`, line ~60:

```javascript
text: 'Analyze this image and provide a detailed description. Include:\n' +
      '1. Main subject or objects\n' +
      '2. Scene/setting\n' +
      '3. Any text visible in the image\n' +
      '4. Colors and composition\n' +
      '5. Any relevant details for business/procurement context\n\n' +
      'Be concise but informative.',
```

### Adjust Token Limit

Default: 500 tokens per analysis

```javascript
// In vision-ai-service.js, line ~80
max_tokens: 500,  // Increase for longer descriptions
```

### Disable Vision Analysis

Remove or comment out `OPENAI_API_KEY` in `.env`:

```env
# OPENAI_API_KEY=sk-...
```

The system will gracefully continue without analysis.

## Troubleshooting

### Problem: "Vision service not enabled"

**Cause**: Missing or invalid `OPENAI_API_KEY`

**Solution**:
1. Check `.env` file has `OPENAI_API_KEY=sk-...`
2. Verify key is valid at https://platform.openai.com/api-keys
3. Restart the server

### Problem: "API Error: 429 Rate Limit"

**Cause**: Too many requests to OpenAI API

**Solution**:
1. Wait a few minutes
2. Check usage limits in OpenAI dashboard
3. Consider upgrading OpenAI plan

### Problem: "Invalid image URL"

**Cause**: Image URL not publicly accessible

**Solution**:
1. Ensure `fileUrl` is a public URL
2. Check file exists at the URL
3. Verify no authentication required

### Problem: Analysis not appearing in frontend

**Cause**: Analysis runs asynchronously

**Solution**:
1. Wait 2-5 seconds for analysis to complete
2. Refresh the chat view
3. Check server logs for errors

## Advanced Usage

### Batch Analysis

```javascript
import visionService from './services/vision-ai-service.js';

const images = [
  { url: 'http://example.com/image1.jpg', fileName: 'image1.jpg' },
  { url: 'http://example.com/image2.jpg', fileName: 'image2.jpg' },
];

const results = await visionService.analyzeImages(images);
```

### Generate Brief Summary

```javascript
const result = await visionService.generateImageSummary(
  'http://example.com/image.jpg',
  'product-photo.jpg'
);

console.log(result.summary); // Short 1-2 sentence description
```

### Check if File is Image

```javascript
const isImage = visionService.isImageFile('image/jpeg', 'photo.jpg');
// Returns: true

const isPDF = visionService.isImageFile('application/pdf', 'document.pdf');
// Returns: false
```

## Future Enhancements

### When DeepSeek Adds Vision Support

If DeepSeek adds vision capabilities in the future:

1. Update `/backend/services/deepseek-ai-service.js`
2. Add vision methods similar to `vision-ai-service.js`
3. Switch environment variable to use DeepSeek
4. Lower costs (DeepSeek typically cheaper)

### Alternative Vision APIs

If OpenAI is too expensive, consider:

1. **Claude 3 Vision** (Anthropic)
   - SDK already installed: `@anthropic-ai/sdk`
   - Competitive pricing
   - High quality analysis

2. **Google Gemini Vision**
   - Competitive pricing
   - Fast processing

3. **Azure Computer Vision**
   - Enterprise-grade
   - Per-image pricing

## Security Considerations

### API Key Protection

- ✅ Never commit `.env` to git
- ✅ Use environment variables only
- ✅ Rotate keys regularly
- ✅ Set usage limits in OpenAI dashboard

### Image URL Security

- ✅ Validate URLs before sending to API
- ✅ Ensure images are from trusted sources
- ✅ Consider rate limiting uploads

### Data Privacy

- ⚠️ Images sent to OpenAI API
- ⚠️ Analysis stored in your database
- ⚠️ Review OpenAI's data usage policy
- ⚠️ Consider GDPR/privacy requirements

## Support

### Logs

Vision analysis logs appear in console:

```
🔍 Analyzing 1 image(s) for message 123
✅ Image analysis complete for: product.jpg
```

### Error Logs

```
❌ Image analysis failed for photo.jpg: Invalid API key
⚠️ Vision service not enabled - skipping image analysis
```

### Debug Mode

Set in `/backend/services/simple-logger.js` to see detailed logs.

---

**Last Updated**: June 20, 2026
**Version**: 1.0
**Status**: Production Ready (requires OpenAI API key)
