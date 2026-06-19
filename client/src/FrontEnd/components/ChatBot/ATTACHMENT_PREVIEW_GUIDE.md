# AttachmentPreview Component - Integration Guide

## Quick Start

### 1. Import the Component
```typescript
import AttachmentPreview from './components/ChatBot/AttachmentPreview';
import InputToolbar from './components/ChatBot/InputToolbar';
```

### 2. Setup State
```typescript
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
```

### 3. Handle File Selection
```typescript
const handleFileSelect = (files: File[]) => {
  if (selectedFiles.length + files.length > 5) {
    message.warning('Maximum 5 files allowed');
    return;
  }
  setSelectedFiles(prev => [...prev, ...files]);
};

const handleImageSelect = (images: File[]) => {
  if (selectedFiles.length + images.length > 5) {
    message.warning('Maximum 5 files allowed');
    return;
  }
  setSelectedFiles(prev => [...prev, ...images]);
};

const handleRemove = (index: number) => {
  setSelectedFiles(prev => prev.filter((_, i) => i !== index));
};
```

### 4. Render in Your Chat UI
```typescript
<div className="chatbot-input-container">
  {/* File Preview Area */}
  {selectedFiles.length > 0 && (
    <AttachmentPreview 
      files={selectedFiles} 
      onRemove={handleRemove} 
    />
  )}
  
  {/* Input Area */}
  <div style={{ display: 'flex', gap: 8, width: '100%' }}>
    <InputToolbar
      onFileSelect={handleFileSelect}
      onImageSelect={handleImageSelect}
      disabled={selectedFiles.length >= 5}
    />
    <TextArea 
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    <Button type="primary" onClick={handleSend}>
      Send
    </Button>
  </div>
</div>
```

## Component Features

### Visual Features
- **Image Previews**: Automatic thumbnail generation (80x80px)
- **File Icons**: Color-coded icons for different file types
  - PDF: Red icon
  - Excel: Green icon
  - Word: Blue icon
  - Text: Gray icon
- **File Info**: Name (truncated if long) + size in readable format
- **Remove Button**: X button with hover effect on each card
- **Warning Badge**: Shows when 5 files limit is reached

### Supported File Types
- **Images**: .jpg, .jpeg, .png, .gif, .webp
- **Documents**: .pdf, .xlsx, .xls, .docx, .doc, .txt, .csv

### Responsive Behavior
- Desktop: 120x120px cards
- Mobile (<768px): 100x100px cards
- Horizontal scroll for multiple files
- Touch-friendly on mobile

## Props API

```typescript
interface AttachmentPreviewProps {
  files: File[];                    // Array of File objects to preview
  onRemove: (index: number) => void; // Called when user removes a file
}
```

## Layout Recommendations

### Option 1: Above Text Input (Recommended)
```
┌────────────────────────────────────┐
│  [img] [pdf] [doc] [xls] [txt]   │ ← AttachmentPreview
├────────────────────────────────────┤
│ [📎] [🖼️] [😊] │ Message text... │ ← InputToolbar + TextArea
└────────────────────────────────────┘
```

### Option 2: Inside Input Container
```
┌────────────────────────────────────┐
│ ┌──────────────────────────────┐  │
│ │ [img] [pdf] [doc]            │  │ ← AttachmentPreview (collapsible)
│ └──────────────────────────────┘  │
│ [📎] [🖼️] │ Message text...│ [Send]│ ← InputToolbar + TextArea + Button
└────────────────────────────────────┘
```

## Example: Full ChatWindow Integration

```typescript
const ChatWindow: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    setLoading(true);
    try {
      // Upload files first if any
      let attachmentIds: string[] = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
        
        const uploadRes = await fetch('/api/chatbot/upload-attachment', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        attachmentIds = uploadData.attachments.map(a => a.id);
      }

      // Send message with attachment references
      await fetch('/api/chatbot/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          attachmentIds
        })
      });

      // Clear state
      setMessage('');
      setSelectedFiles([]);
    } catch (error) {
      message.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-messages">
        {/* Messages list */}
      </div>

      <div className="chatbot-input-container">
        {/* Show attachment preview */}
        {selectedFiles.length > 0 && (
          <AttachmentPreview
            files={selectedFiles}
            onRemove={(index) => 
              setSelectedFiles(prev => prev.filter((_, i) => i !== index))
            }
          />
        )}

        {/* Input toolbar and text area */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <InputToolbar
            onFileSelect={(files) => {
              if (selectedFiles.length + files.length <= 5) {
                setSelectedFiles(prev => [...prev, ...files]);
              }
            }}
            onImageSelect={(images) => {
              if (selectedFiles.length + images.length <= 5) {
                setSelectedFiles(prev => [...prev, ...images]);
              }
            }}
            disabled={selectedFiles.length >= 5 || loading}
          />
          
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
            onPressEnter={(e) => {
              if (e.shiftKey) return; // Allow shift+enter for new line
              e.preventDefault();
              handleSend();
            }}
          />
          
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            disabled={!message.trim() && selectedFiles.length === 0}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## Styling Customization

The component uses CSS classes that can be overridden:

```css
/* Main container */
.attachment-preview-container { }

/* Scrollable file list */
.attachment-preview-list { }

/* Individual file card */
.attachment-preview-card { }

/* Remove button */
.attachment-remove-btn { }

/* File icon/thumbnail area */
.attachment-preview-icon { }

/* File name and size */
.attachment-preview-info { }
.attachment-file-name { }
.attachment-file-size { }

/* Warning message */
.attachment-limit-warning { }
```

## Testing

Run the example component to see it in action:
```typescript
import AttachmentPreviewExample from './components/ChatBot/AttachmentPreview.example';

<AttachmentPreviewExample />
```

## Notes

- Component automatically generates thumbnails for images using FileReader
- Memory-safe: cleans up blob URLs on unmount
- Maximum 5 files enforced at UI level
- File name truncated to 20 characters with tooltip for full name
- Horizontal scroll appears automatically when files overflow
- Remove button changes to red on hover for better UX
