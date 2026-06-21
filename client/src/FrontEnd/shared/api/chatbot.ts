import axios from 'axios';

const API_BASE = '/api/chatbot';

/**
 * Create new chat session
 */
export async function createNewSession(userId: number) {
  const res = await axios.post(`${API_BASE}/new-session`, { userId });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to create session');
  }
  return res.data.sessionId;
}

/**
 * Upload attachment for chatbot message
 */
export async function uploadAttachment(
  file: File,
  sessionId: string,
  userId: number
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sessionId', sessionId);
  formData.append('userId', userId.toString());

  const res = await axios.post(`${API_BASE}/upload-attachment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to upload attachment');
  }
  return res.data.attachment;
}

/**
 * Send message to ChatBot
 */
export async function sendMessage(params: {
  userId: number;
  message: string;
  sessionId?: string;
  attachmentData?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    thumbnailUrl?: string;
    fileSize: number;
    fileType: string;
    mimeType: string;
  }>;
}) {
  const res = await axios.post(`${API_BASE}/chat`, params);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to send message');
  }
  return res.data;
}

/**
 * Get user's session list
 */
export async function getUserSessions(userId: number) {
  const res = await axios.get(`${API_BASE}/sessions`, {
    params: { userId },
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to fetch sessions');
  }
  return res.data.sessions;
}

/**
 * Get session history
 */
export async function getSessionHistory(sessionId: string) {
  const res = await axios.get(`${API_BASE}/history/${sessionId}`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to fetch history');
  }
  return res.data.messages;
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string) {
  const res = await axios.delete(`${API_BASE}/session/${sessionId}`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to delete session');
  }
  return res.data;
}

/**
 * Rename session
 */
export async function renameSession(sessionId: string, title: string, userId?: number) {
  const res = await axios.patch(`${API_BASE}/session/${sessionId}`, {
    title,
    userId,
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to rename session');
  }
  return res.data.session;
}

/**
 * Delete all chat sessions for a user
 */
export async function clearAllChatHistory(userId: number) {
  const res = await axios.delete(`${API_BASE}/sessions`, {
    params: { userId },
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to clear chat history');
  }
  return res.data;
}

/**
 * Stream message (SSE)
 */
export async function sendMessageStream(
  params: {
    userId: number;
    message: string;
    sessionId?: string;
  },
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: Error) => void
) {
  try {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    let sessionId = params.sessionId;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.substring(6));

          if (data.type === 'session') {
            sessionId = data.sessionId;
          } else if (data.type === 'chunk') {
            onChunk(data.text);
          } else if (data.type === 'done') {
            onDone();
            return sessionId;
          } else if (data.type === 'error') {
            throw new Error(data.error);
          }
        }
      }
    }

    return sessionId;
  } catch (error) {
    onError(error as Error);
    throw error;
  }
}

/**
 * Export purchase requests to file
 */
export async function exportPurchaseRequests(params: {
  userId: number;
  format?: 'csv' | 'json';
  status?: 'ALL' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  limit?: number;
}) {
  const response = await fetch(`${API_BASE}/export-purchase-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: params.userId,
      format: params.format || 'csv',
      status: params.status || 'ALL',
      limit: params.limit || 100,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message ?? 'Failed to export purchase requests');
  }

  // Get filename from Content-Disposition header
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `Purchase_Requests_${new Date().toISOString().split('T')[0]}.${params.format || 'csv'}`;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }

  // Get the file data
  const blob = await response.blob();

  // Trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  // Return metadata from headers
  return {
    recordCount: parseInt(response.headers.get('X-Record-Count') || '0'),
    status: response.headers.get('X-Export-Status') || 'ALL',
    department: response.headers.get('X-Export-Department') || 'All',
    filename,
  };
}
