// Unified API and Types for ChatBot
// This file consolidates all chatbot-related imports

// ========== Types ==========

export interface AttachmentMetadata {
  id: string;
  fileName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  aiAnalysis?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: AttachmentMetadata[];
}

export interface Session {
  id: string;
  title: string;
  updatedAt: string;
  _count: {
    messages: number;
  };
}

export interface Source {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  chunkCount?: number;
}

// ========== API Functions ==========

// Re-export from chatbot API
export {
  sendMessage,
  createNewSession,
  getUserSessions,
  deleteSession,
  clearAllChatHistory,
  uploadAttachment,
} from '../shared/api/chatbot';

// Re-export from sources API
export {
  uploadSource,
  getUserSources,
  deleteSource,
} from '../shared/api/sources';

// Re-export from session auth
export { getSessionUser } from '../shared/auth/session';
