# OptiMind Chatbot Enhancement Design

**Date:** 2026-06-20  
**Version:** 1.0  
**Status:** Approved  
**Author:** Claude (with User)

---

## Executive Summary

This design document outlines a comprehensive enhancement plan for the OptiMind AI Chatbot system. The enhancements will be implemented across 4 phases, introducing advanced features including multi-modal input (files, images, voice), enhanced message interactions, improved session management, and extensive export/sharing capabilities.

**Key Goals:**
- Enable file and image upload with AI analysis
- Implement voice input/output with keyword extraction
- Enhance session management (rename, search, pin, tags)
- Add message-level interactions (copy, edit, regenerate, quote, feedback)
- Provide comprehensive export options (PDF, Excel, Word, PPT, etc.)
- Build sharing capabilities with read-only links
- Create command system and user guide

**Implementation Strategy:** 4 phased rollouts with careful attention to detail and quality.

---

## Table of Contents

1. [Current System Overview](#current-system-overview)
2. [Architecture Design](#architecture-design)
3. [Database Design](#database-design)
4. [Phase 1: File and Image Upload](#phase-1-file-and-image-upload)
5. [Phase 2: Message Interaction Enhancement](#phase-2-message-interaction-enhancement)
6. [Phase 3: Session Management + Voice](#phase-3-session-management--voice)
7. [Phase 4: Export, Share, Commands, UI](#phase-4-export-share-commands-ui)
8. [Security Considerations](#security-considerations)
9. [Performance Considerations](#performance-considerations)
10. [Testing Strategy](#testing-strategy)

---

## Current System Overview

### Existing Components

**Frontend:**
- `ChatBotPage.tsx` - Main chat interface
- `ChatWindow.tsx` - Widget version
- `MessageList.tsx` - Message rendering
- `SessionHistory.tsx` - Session list
- Existing voice components (VoiceInput.tsx)

**Backend:**
- `/api/chatbot/*` routes
- DeepSeek AI integration
- PostgreSQL database with Prisma ORM
- File upload system (Sources)

**Current Features:**
- Text-based chat with AI
- Session management (create, delete, list)
- Global document upload (Sources tab)
- Markdown rendering
- Message history persistence

### Gaps to Address

1. No per-message file/image attachments
2. No image analysis by AI
3. Limited message-level interactions
4. Basic session management (no search, tags, pin)
5. No voice input/output integration
6. No export or sharing capabilities
7. No command system or templates
8. Single theme (no dark mode)

---

## Architecture Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
├─────────────────────────────────────────────────────────────┤
│  ChatBotPage (Enhanced)                                      │
│  ├── InputToolbar (📎 🖼️ 😊 🎤)                            │
│  ├── MessageList (Copy, Regen, Edit, Quote, Feedback)       │
│  ├── SessionSidebar (Search, Pin, Tags, Batch)              │
│  └── VoiceInput/Output                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/SSE
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
├─────────────────────────────────────────────────────────────┤
│  Enhanced Routes                                             │
│  ├── /upload-message (file attachments)                     │
│  ├── /analyze-image (DeepSeek Vision)                       │
│  ├── /voice/* (STT/TTS)                                      │
│  ├── /export (multiple formats)                             │
│  └── /share (link generation)                               │
│                                                               │
│  Services                                                    │
│  ├── DeepSeek Service (text + vision)                       │
│  ├── File Manager (upload, storage)                         │
│  ├── Export Service (PDF, Excel, Word, PPT)                 │
│  └── Voice Service (transcription, synthesis)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│  New Tables:                                                 │
│  - message_attachments                                       │
│  - session_tags                                              │
│  - message_feedback                                          │
│  - share_links                                               │
│  - voice_data                                                │
│  - user_templates                                            │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Ant Design for UI components
- react-dropzone for file upload
- react-markdown for message rendering
- Web Speech API for voice
- jsPDF, exceljs, docx, pptxgenjs for exports

**Backend:**
- Node.js with Express
- Prisma ORM
- DeepSeek API (text + vision)
- Multer for file uploads
- Sharp for image processing
- OpenAI Whisper or Web Speech API for STT
- TTS service for voice output

---

## Database Design

### New Tables Schema

```sql
-- Message Attachments (per-message files/images)
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  mime_type VARCHAR(100),
  thumbnail_url TEXT,
  ai_analysis TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

-- Session Tags
CREATE TABLE session_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  tag_name VARCHAR(50) NOT NULL,
  tag_color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, tag_name)
);

-- Session enhancements
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS custom_title VARCHAR(255);
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS last_message_preview TEXT;

-- Message Feedback
CREATE TABLE message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  feedback_type VARCHAR(20) NOT NULL,
  feedback_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Share Links
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  share_token VARCHAR(100) UNIQUE NOT NULL,
  created_by INTEGER NOT NULL,
  expires_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voice Data
CREATE TABLE voice_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration INTEGER,
  transcription TEXT,
  keywords JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Templates
CREATE TABLE user_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  template_content TEXT NOT NULL,
  category VARCHAR(50),
  is_system BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

```sql
CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX idx_session_tags_session_id ON session_tags(session_id);
CREATE INDEX idx_chat_sessions_pinned ON chat_sessions(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX idx_share_links_token ON share_links(share_token);
CREATE INDEX idx_voice_data_message_id ON voice_data(message_id);
CREATE INDEX idx_message_feedback_message_id ON message_feedback(message_id);
CREATE INDEX idx_user_templates_user_id ON user_templates(user_id);
```

---

