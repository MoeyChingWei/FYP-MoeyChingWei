# Task 5: Frontend AttachmentPreview Component

## Task Brief

**Files:**
- Create: `client/src/FrontEnd/components/ChatBot/AttachmentPreview.tsx`
- Create: `client/src/FrontEnd/components/ChatBot/AttachmentPreview.css`

**Interfaces:**
- Consumes: Array of File objects from InputToolbar (Task 4)
- Produces: AttachmentPreview component with props:
  - `files: File[]`
  - `onRemove: (index: number) => void`

**Features:**
1. Show selected files before upload
2. Image thumbnails (max 200px height)
3. File icon + name + size for documents
4. Remove button (X) for each file
5. Max 5 files display
6. Human-readable file sizes (KB, MB)

**Requirements:**
- Use Ant Design Card, Image, Button, CloseOutlined icon
- Show file type icons (PDF, Excel, Word, Text)
- Format file sizes: < 1KB, < 1MB, MB
- Horizontal scrollable layout if many files

## Implementation

Component displays a horizontal list of file preview cards. Each card shows thumbnail (images) or icon (documents), filename, file size, and a remove button.

## Global Constraints

- React version: 18+
- TypeScript: Use strict mode
- Follow existing code style
- Use Ant Design components consistently
