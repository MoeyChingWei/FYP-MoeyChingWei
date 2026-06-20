# Task 7: Integration into ChatBotPage

## Task Brief

**Goal:** Integrate all file attachment components (InputToolbar, AttachmentPreview, MessageAttachment) into the ChatBotPage, connecting them with the upload API and message sending flow.

## Dependencies
- ✅ Task 1: Database schema (MessageAttachment model)
- ✅ Task 2: File validation and storage utilities
- ✅ Task 3: Backend upload API endpoint (`/api/chatbot/upload-attachment`)
- ✅ Task 4: InputToolbar component
- ✅ Task 5: AttachmentPreview component
- ✅ Task 6: MessageAttachment component (already integrated in MessageList)

## Files to Modify

1. **client/src/FrontEnd/pages/ChatBotPage.tsx**
   - Add state for selected files
   - Add InputToolbar component to input area
   - Add AttachmentPreview above the input when files are selected
   - Handle file uploads to backend API
   - Send attachment metadata with messages
   - Display attachments in message list

2. **client/src/FrontEnd/shared/api/chatbot.ts**
   - Add `uploadAttachment()` function for file uploads
   - Update `sendMessage()` to accept optional attachmentData array

3. **backend/routes/chatbot.js**
   - Update `/chat` endpoint to accept and save attachmentData
   - Create MessageAttachment records when message is saved

4. **backend/agents/chatbot/chatbot-agent.js**
   - Update `chat()` method to accept attachmentData
   - Update `saveMessage()` to create MessageAttachment records

## Implementation Steps

### Frontend Changes

1. **Add state management in ChatBotPage.tsx:**
   - `selectedFiles: File[]` - Files selected via InputToolbar
   - `uploadingFiles: boolean` - Upload progress state
   - `uploadedAttachments: AttachmentMetadata[]` - Uploaded file metadata

2. **Add file selection handlers:**
   - `handleFileSelect(files: File[])` - Called from InputToolbar
   - `handleImageSelect(images: File[])` - Called from InputToolbar
   - `handleRemoveFile(index: number)` - Remove file from preview

3. **Add file upload logic:**
   - `uploadFiles()` - Upload all selected files before sending message
   - Call `/api/chatbot/upload-attachment` for each file
   - Collect attachment metadata with temporary IDs

4. **Update message sending:**
   - Upload files before sending message
   - Include `attachmentData` array in message send request
   - Clear selected files after successful send

5. **Add components to UI:**
   - Add `<InputToolbar>` before the send button
   - Add `<AttachmentPreview>` above the input when files selected
   - MessageAttachment already integrated in MessageList

6. **Update Message interface:**
   - Add `attachments?: MessageAttachmentData[]` field

### Backend Changes

1. **Update chatbot API (`/api/chatbot/chat` endpoint):**
   - Accept `attachmentData` array in request body
   - Pass to chatbot agent

2. **Update chatbot agent:**
   - Accept `attachmentData` parameter in `chat()` method
   - Update `saveMessage()` to create MessageAttachment records
   - Link attachments to saved message via messageId

3. **Attachment data structure:**
   ```typescript
   interface AttachmentData {
     id: string;           // Temporary ID from upload
     fileName: string;
     fileUrl: string;
     thumbnailUrl?: string;
     fileSize: number;
     fileType: string;
     mimeType: string;
   }
   ```

## User Flow

1. User clicks attachment button in InputToolbar
2. User selects files from file picker
3. AttachmentPreview shows selected files
4. User types message (optional)
5. User clicks Send button
6. Files are uploaded to `/api/chatbot/upload-attachment`
7. Message is sent with attachment metadata
8. Backend creates Message and MessageAttachment records
9. Frontend displays message with attachments via MessageAttachment component

## Validation & Error Handling

- Show error if file upload fails
- Disable send button while uploading
- Show upload progress indicator
- Handle network errors gracefully
- Clear selected files on successful send
- Preserve selected files if send fails

## Testing

1. Select files via InputToolbar
2. Verify AttachmentPreview displays correctly
3. Send message with attachments
4. Verify files upload successfully
5. Verify message saves with attachments
6. Verify attachments display in message bubble
7. Test with images and documents
8. Test with multiple files
9. Test error cases (network failure, invalid files)
10. Test removing files before sending

## Global Constraints

- React 18+ with TypeScript
- Use Ant Design components
- Follow existing code style (2-space indentation)
- Maintain existing ChatBotPage functionality
- Don't break existing message display
- Handle loading states properly
- Show clear error messages to users

## Success Criteria

- ✅ InputToolbar integrated and functional
- ✅ AttachmentPreview shows selected files
- ✅ Files upload successfully before message send
- ✅ Messages save with attachment records in database
- ✅ Attachments display correctly in message bubbles
- ✅ Can send messages with multiple attachments
- ✅ Can send messages with both text and attachments
- ✅ Can send messages with only attachments (no text)
- ✅ Error handling works properly
- ✅ Loading states provide good UX
- ✅ Existing chat functionality still works
