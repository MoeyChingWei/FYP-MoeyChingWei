# Task 6: Frontend MessageAttachment Component

## Goal
Create a React component to display attachments within chat message bubbles. This component shows images with lightbox functionality, files with download links, and AI analysis results when available.

## Dependencies
- MessageList component - where attachments will be displayed
- Backend MessageAttachment model (Task 3) - provides attachment data structure
- Ant Design components: Image, Card, Button, Tooltip
- File type icons from Ant Design icons

## Requirements

### Functional Requirements
1. Display image attachments with thumbnail preview
2. Click-to-enlarge functionality for images using Ant Design Image lightbox
3. Display file attachments with appropriate icon and download button
4. Show AI analysis results for images (if available)
5. Display file metadata: name, size, type
6. Responsive layout within message bubbles
7. Handle multiple attachments per message

### Technical Requirements
1. TypeScript with proper type definitions
2. Props interface:
   - `attachments: MessageAttachment[]` - array of attachment objects
   - `messageRole: 'user' | 'assistant'` - to style differently based on sender
3. MessageAttachment type structure (from backend):
   ```typescript
   interface MessageAttachment {
     id: string;
     fileName: string;
     fileUrl: string;
     fileType: string;
     fileSize: number;
     mimeType?: string;
     thumbnailUrl?: string;
     aiAnalysis?: string;
   }
   ```
4. Use Ant Design components for consistency
5. Separate CSS file for styling
6. Follow existing code patterns in ChatBot components

### File Types to Handle
- **Images**: jpg, jpeg, png, gif, webp (show thumbnail with lightbox)
- **Documents**: pdf, xlsx, xls, docx, doc, txt, csv (show file icon with download)

### Display Format
- **For Images:**
  - Thumbnail preview (max 200px width)
  - Click to open lightbox
  - AI analysis badge/tooltip if available
  
- **For Files:**
  - File type icon
  - File name (truncate if too long)
  - File size in human-readable format
  - Download button

## Files to Create
1. `client/src/FrontEnd/components/ChatBot/MessageAttachment.tsx`
2. `client/src/FrontEnd/components/ChatBot/MessageAttachment.css`

## Files to Modify
1. `client/src/FrontEnd/components/ChatBot/MessageList.tsx` - integrate MessageAttachment component

## Implementation Steps
1. Create TypeScript component with proper props interface
2. Reuse formatFileSize and getFileIcon utilities from AttachmentPreview
3. Implement image display with Ant Design Image component
4. Implement file display with download button
5. Add AI analysis display for images
6. Style the component with CSS
7. Integrate into MessageList component
8. Add unit tests
9. Commit changes

## Expected Output
A reusable component that displays attachments within message bubbles, providing preview, download, and AI analysis functionality.

## Integration with MessageList
The MessageList component should be updated to:
1. Accept attachments in the Message interface
2. Render MessageAttachment component for messages with attachments
3. Display attachments below the message text content
