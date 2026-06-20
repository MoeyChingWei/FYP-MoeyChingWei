# Task 4: Frontend InputToolbar Component

## Task Brief

**Files:**
- Create: `client/src/FrontEnd/components/ChatBot/InputToolbar.tsx`
- Create: `client/src/FrontEnd/components/ChatBot/InputToolbar.css`

**Interfaces:**
- Produces: InputToolbar component with props:
  - `onFileSelect: (files: File[]) => void`
  - `onImageSelect: (images: File[]) => void`
  - `disabled?: boolean`

**Features:**
1. 📎 Attachment button - opens file picker for documents
2. 🖼️ Image button - opens image picker
3. 😊 Emoji button (optional, nice-to-have)
4. Clean, accessible UI with Ant Design icons

**Requirements:**
- Max 5 files per selection
- Visual feedback on hover
- Disabled state support
- File input accepts: .pdf,.xlsx,.xls,.docx,.doc,.txt,.csv
- Image input accepts: .jpg,.jpeg,.png,.gif,.webp

## Implementation

Component should render horizontal toolbar with icon buttons, using Ant Design Button and icons (PaperClipOutlined, PictureOutlined, SmileOutlined).

## Global Constraints

- React version: 18+
- TypeScript: Use strict mode
- Use Ant Design components
- Follow existing code style (2-space indentation)
