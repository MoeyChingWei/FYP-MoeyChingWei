# Task 6: Frontend MessageAttachment Component

## Task Brief

**Files:**
- Create: `client/src/FrontEnd/components/ChatBot/MessageAttachment.tsx`
- Create: `client/src/FrontEnd/components/ChatBot/MessageAttachment.css`

**Interfaces:**
- Consumes: Attachment data from backend messages
  ```typescript
  interface Attachment {
    id: string;
    fileName: string;
    fileUrl: string;
    thumbnailUrl?: string;
    fileSize: number;
    fileType: 'image' | 'pdf' | 'excel' | 'word' | 'text';
    mimeType: string;
    aiAnalysis?: string;
  }
  ```
- Produces: MessageAttachment component with props:
  - `attachments: Attachment[]`
  - `messageRole: 'user' | 'assistant'`

**Features:**
1. Image display with thumbnails
2. Click to open lightbox (full size)
3. File download button for documents
4. File type icons
5. AI analysis display (for images analyzed by backend)
6. Responsive layout

**Requirements:**
- Use Ant Design Image (with preview), Card, Button
- Show file sizes in human-readable format
- Different styling for user vs assistant messages
- Download link opens in new tab

## Implementation

Component maps through attachments array and renders each attachment as a card. Images use Ant Design Image with built-in preview. Documents show icon + download button.

## Global Constraints

- React version: 18+
- TypeScript: Use strict mode
- Follow existing ChatBot component patterns
- Use Ant Design components
