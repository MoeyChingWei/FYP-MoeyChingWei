# OptiMind Chatbot Enhancement - Phase Details

This document contains the detailed phase designs for the chatbot enhancement project.

---

## Phase 1: File and Image Upload

### Overview
Enable users to attach files and images to individual messages, with AI analysis of images.

### Key Features
1. Input toolbar with attachment/image buttons
2. Drag-drop and paste image support
3. File upload with preview
4. AI image analysis via DeepSeek Vision
5. Message-level attachments display

### Implementation Details

**Frontend Components:**
- `InputToolbar.tsx` - Attachment/image buttons
- `AttachmentPreview.tsx` - File preview before send
- `MessageAttachment.tsx` - Display attachments in messages

**Backend APIs:**
```
POST /api/chatbot/upload-attachment
POST /api/chatbot/chat (enhanced with attachmentIds)
```

**Database:**
```sql
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES chat_messages(id),
  file_name VARCHAR(255),
  file_url TEXT,
  file_type VARCHAR(50),
  ai_analysis TEXT,
  ...
);
```

**Validation Rules:**
- Max 10MB per file
- Max 5 files per message
- Allowed: jpg, png, gif, pdf, xlsx, docx, txt

---

## Phase 2: Message Interaction Enhancement

### Overview
Add rich interactions to messages: copy, regenerate, edit, quote, feedback.

### Key Features
1. Message action buttons (copy, regenerate, edit)
2. Quote reply system
3. Thumbs up/down feedback
4. Right-click context menu
5. Message version history

**Message Actions:**
- 📋 Copy message
- 🔄 Regenerate (AI only)
- ✏️ Edit (user only)
- 💬 Quote reply
- 👍👎 Feedback
- 🗑️ Delete

**Backend APIs:**
```
POST /api/chatbot/message/regenerate
PUT  /api/chatbot/message/:id/edit
POST /api/chatbot/message/feedback
DELETE /api/chatbot/message/:id
POST /api/chatbot/message/quote
```

**Database:**
```sql
CREATE TABLE message_feedback (
  id UUID PRIMARY KEY,
  message_id UUID,
  feedback_type VARCHAR(20),
  feedback_comment TEXT,
  ...
);
```

---

## Phase 3: Session Management + Voice

### Overview
Enhanced session management with search, tags, pinning, plus voice input/output.

### Key Features

**Session Management:**
1. Search sessions (title, content, tags)
2. Pin important sessions
3. Tag system (preset + custom)
4. Batch operations
5. Rename sessions

**Voice Features:**
1. Voice input (speech-to-text)
2. Voice output (text-to-speech)
3. Keyword extraction
4. Multi-language support (EN, ZH, MS)

**Backend APIs:**
```
PUT    /api/chatbot/session/:id/rename
PUT    /api/chatbot/session/:id/pin
POST   /api/chatbot/session/:id/tags
POST   /api/chatbot/sessions/search
POST   /api/chatbot/voice/transcribe
POST   /api/chatbot/voice/synthesize
```

**Database:**
```sql
CREATE TABLE session_tags (
  id UUID PRIMARY KEY,
  session_id UUID,
  tag_name VARCHAR(50),
  tag_color VARCHAR(20),
  ...
);

CREATE TABLE voice_data (
  id UUID PRIMARY KEY,
  message_id UUID,
  audio_url TEXT,
  transcription TEXT,
  keywords JSONB,
  ...
);
```

---

## Phase 4: Export, Share, Commands, UI

### Overview
Export to multiple formats, sharing links, command system, and UI enhancements.

### Key Features

**Export:**
- PDF, Markdown, JSON, Excel, Word, PowerPoint
- Include/exclude attachments
- Custom formatting

**Share:**
- Generate shareable read-only links
- Set expiration dates
- Password protection
- View count tracking

**Commands:**
```
/help       - Show commands
/new        - New conversation
/search     - Search sessions
/export     - Export session
/summary    - Generate summary
/template   - Show templates
/voice      - Toggle voice
/theme      - Switch theme
```

**UI Enhancements:**
- Dark/light theme
- Font size adjustment
- Right-click context menu
- Keyboard shortcuts
- User guide page

**Backend APIs:**
```
POST   /api/chatbot/export
POST   /api/chatbot/share/create
GET    /api/chatbot/share/:token
GET    /api/chatbot/templates
PUT    /api/chatbot/settings
```

**Database:**
```sql
CREATE TABLE share_links (
  id UUID PRIMARY KEY,
  session_id UUID,
  share_token VARCHAR(100),
  expires_at TIMESTAMP,
  view_count INTEGER,
  ...
);

CREATE TABLE user_templates (
  id UUID PRIMARY KEY,
  user_id INTEGER,
  template_name VARCHAR(100),
  template_content TEXT,
  ...
);
```

---

## Security Considerations

### File Upload Security
- File type whitelist validation
- Size limits enforced
- Virus scanning
- Secure storage (outside public directory)

### Share Link Security
- Cryptographically secure tokens
- Expiration enforcement
- Password protection
- Rate limiting

### API Security
- JWT authentication
- User ownership verification
- Rate limiting
- Input sanitization

---

## Performance Optimization

### Database
- Proper indexing on all foreign keys
- Paginated queries
- Query optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Virtualized lists

### File Handling
- Thumbnail generation
- Image compression
- Chunked uploads
- CDN delivery

---

## Testing Strategy

### Unit Tests
- Component rendering
- API endpoints
- Service functions
- Validation logic

### Integration Tests
- File upload flow
- Message operations
- Session management
- Export functionality

### E2E Tests
- Complete user journeys
- Cross-browser testing
- Mobile responsiveness

---

## Success Criteria

### Phase 1
✅ Users can upload files/images per message
✅ AI analyzes images accurately
✅ Attachments display correctly
✅ Upload errors handled gracefully

### Phase 2
✅ All message actions functional
✅ Copy/regenerate/edit work smoothly
✅ Feedback system collects data
✅ Right-click menu responsive

### Phase 3
✅ Session search returns accurate results
✅ Tags and pins work correctly
✅ Voice input transcribes accurately
✅ Voice output plays smoothly

### Phase 4
✅ All export formats generate correctly
✅ Share links work and expire properly
✅ Commands execute as expected
✅ Theme switching smooth
✅ User guide comprehensive

---

**End of Phase Details Document**
