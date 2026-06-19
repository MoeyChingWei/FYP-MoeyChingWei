# Task 5: Frontend AttachmentPreview Component

## Goal
Create a React component to display previews of selected files before sending the message. Users can review and remove files from the preview before uploading.

## Dependencies
- InputToolbar component (Task 4) - provides file selection functionality
- Ant Design components: Card, Image, Button
- File type icons from Ant Design icons

## Requirements

### Functional Requirements
1. Display preview cards for all selected files (both images and documents)
2. Show image thumbnails for image files
3. Show appropriate file type icons for document files
4. Display file name and size in human-readable format (KB, MB)
5. Provide remove button for each file
6. Handle maximum 5 files display
7. Responsive layout that works on different screen sizes

### Technical Requirements
1. TypeScript with proper type definitions
2. Props interface:
   - `files: File[]` - array of selected files
   - `onRemove: (index: number) => void` - callback when file is removed
3. Use Ant Design components for consistency
4. Separate CSS file for styling
5. Follow existing code patterns in ChatBot components

### File Types to Handle
- **Images**: jpg, jpeg, png, gif, webp (show thumbnail preview)
- **Documents**: pdf, xlsx, xls, docx, doc, txt, csv (show file icon)

### Display Format
- File name (truncate if too long)
- File size in human-readable format
- Remove button (X icon)
- Image preview or file type icon

## Files to Create
1. `client/src/FrontEnd/components/ChatBot/AttachmentPreview.tsx`
2. `client/src/FrontEnd/components/ChatBot/AttachmentPreview.css`

## Implementation Steps
1. Create TypeScript component with proper props interface
2. Implement file size formatter utility function
3. Implement file type detector function
4. Create preview card for images with thumbnail
5. Create preview card for documents with icon
6. Add remove functionality
7. Style the component with CSS
8. Test with different file types
9. Commit changes

## Expected Output
A reusable component that can be integrated into the chat input area, showing a horizontal scrollable list of file previews with remove buttons.
