import axios from 'axios';

const API_BASE = '/api/agents';

export interface Agent {
  type: string;
  name: string;
  description: string;
  personality: string;
  expertise: string;
  toolCount: number;
  tools: string[];
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    mimeType?: string;
    thumbnailUrl?: string;
    aiAnalysis?: string;
  }>;
}

/**
 * Get all available agents
 */
export async function getAllAgents(): Promise<Agent[]> {
  const res = await axios.get(`${API_BASE}/list`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to fetch agents');
  }
  return res.data.agents;
}

/**
 * Get specific agent info
 */
export async function getAgentInfo(agentType: string): Promise<Agent> {
  const res = await axios.get(`${API_BASE}/${agentType}/info`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to fetch agent info');
  }
  return res.data.agent;
}

/**
 * Send message to specific agent
 */
export async function sendMessageToAgent(params: {
  agentType: string;
  userId: number;
  message: string;
  sessionId?: string;
}) {
  const res = await axios.post(`${API_BASE}/${params.agentType}/chat`, {
    userId: params.userId,
    message: params.message,
    sessionId: params.sessionId,
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to send message');
  }
  return res.data;
}

/**
 * Create new agent session
 */
export async function createAgentSession(agentType: string, userId: number): Promise<string> {
  const res = await axios.post(`${API_BASE}/${agentType}/new-session`, { userId });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to create session');
  }
  return res.data.sessionId;
}

/**
 * Get agent sessions for user
 */
export async function getAgentSessions(agentType: string, userId: number) {
  const res = await axios.get(`${API_BASE}/${agentType}/sessions`, {
    params: { userId },
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to fetch sessions');
  }
  return res.data.sessions;
}

/**
 * Get agent session history
 */
export async function getAgentHistory(agentType: string, sessionId: string): Promise<AgentMessage[]> {
  const res = await axios.get(`${API_BASE}/${agentType}/history/${sessionId}`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to fetch history');
  }
  return res.data.messages;
}

/**
 * Delete agent session
 */
export async function deleteAgentSession(agentType: string, sessionId: string) {
  const res = await axios.delete(`${API_BASE}/${agentType}/session/${sessionId}`);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to delete session');
  }
  return res.data;
}

/**
 * Delete all agent sessions for user
 */
export async function deleteAllAgentSessions(agentType: string, userId: number) {
  const res = await axios.delete(`${API_BASE}/${agentType}/sessions`, {
    params: { userId },
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? 'Failed to delete sessions');
  }
  return res.data;
}

/**
 * Stream message to agent (SSE)
 */
export async function sendMessageToAgentStream(
  params: {
    agentType: string;
    userId: number;
    message: string;
    sessionId?: string;
  },
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: Error) => void
): Promise<string | undefined> {
  try {
    const response = await fetch(`${API_BASE}/${params.agentType}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: params.userId,
        message: params.message,
        sessionId: params.sessionId,
      }),
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
