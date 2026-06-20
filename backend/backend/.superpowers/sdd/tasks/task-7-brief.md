# Task 7: Integration into ChatBotPage

## Task Brief

**Files:**
- Modify: `client/src/FrontEnd/pages/ChatBotPage.tsx`
- Modify: `client/src/FrontEnd/shared/api/chatbot.ts` (if needed)

**Goal:** Connect all components and make file upload work end-to-end

**Integration Steps:**

1. **Add state management:**
   - `selectedFiles: File[]` - files user selected
   - `uploadedAttachments: Attachment[]` - files uploaded to backend
   - `uploading: boolean` - upload in progress

2. **Add InputToolbar:**
   - Render in chat input area
   - Handle file/image selection

3. **Add AttachmentPreview:**
   - Show above input area when files selected
   - Allow removing files before upload

4. **Upload flow:**
   - When files selected → upload to `/api/chatbot/upload-attachment`
   - Store attachment data with temp IDs
   - Show upload progress

5. **Send message with attachments:**
   - Modify sendMessage to include `attachmentData` array
   - Backend creates real attachment records
   - Clear uploaded attachments after send

6. **Display attachments in messages:**
   - Update Message interface to include attachments
   - Pass attachments to MessageAttachment component
   - Fetch attachments from backend when loading history

**Key Functions:**
```typescript
const handleFileSelect = async (files: File[]) => {
  // Upload each file to backend
  // Store attachment data
}

const handleSendMessage = async () => {
  // Send message with attachmentData array
  // Clear files after send
}
```

## Requirements

- Max 5 files per message
- Show upload progress
- Handle upload errors gracefully
- Clear attachments after successful send
- Fetch attachment data when loading session history

## Global Constraints

- Follow existing ChatBotPage patterns
- Use existing state management approach
- Maintain backward compatibility
