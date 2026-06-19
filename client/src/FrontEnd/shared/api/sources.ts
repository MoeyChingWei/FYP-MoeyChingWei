import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export interface Source {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  chunkCount?: number;
}

/**
 * Upload a file
 */
export async function uploadSource(
  file: File,
  userId: number,
  sessionId?: string
): Promise<{ success: boolean; source?: Source; message?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId.toString());
  if (sessionId) {
    formData.append('sessionId', sessionId);
  }

  const response = await axios.post(`${API_BASE}/api/sources/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Get user's sources
 */
export async function getUserSources(
  userId: number,
  sessionId?: string
): Promise<Source[]> {
  const params: any = { userId };
  if (sessionId) {
    params.sessionId = sessionId;
  }

  const response = await axios.get(`${API_BASE}/api/sources`, { params });
  return response.data.sources || [];
}

/**
 * Delete a source
 */
export async function deleteSource(
  sourceId: string,
  userId: number
): Promise<{ success: boolean; message?: string }> {
  const response = await axios.delete(`${API_BASE}/api/sources/${sourceId}`, {
    params: { userId },
  });

  return response.data;
}
