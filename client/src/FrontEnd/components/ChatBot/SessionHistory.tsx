import React, { useState, useEffect } from 'react';
import { List, Button, Modal, message, Empty, Spin, Popconfirm } from 'antd';
import {
  HistoryOutlined,
  DeleteOutlined,
  MessageOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAgentSessions, deleteAgentSession, deleteAllAgentSessions } from '../../shared/api/agents';
import './SessionHistory.css';

interface Session {
  id: string;
  title: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

interface SessionHistoryProps {
  agentType: string;
  userId: number;
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  visible: boolean;
  onClose: () => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  agentType,
  userId,
  currentSessionId,
  onSelectSession,
  visible,
  onClose,
}) => {
  const { t: tMsg } = useTranslation('messages');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSessions();
    }
  }, [visible, agentType]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getAgentSessions(agentType, userId);
      setSessions(data);
    } catch (error: any) {
      message.error(error.message || tMsg('loadSessionsFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteAgentSession(agentType, sessionId);
      message.success(tMsg('sessionDeleted'));
      loadSessions();
    } catch (error: any) {
      message.error(error.message || tMsg('sessionDeleteFailed'));
    }
  };

  const handleClearAll = async () => {
    try {
      await deleteAllAgentSessions(agentType, userId);
      message.success(tMsg('allSessionsCleared'));
      setSessions([]);
    } catch (error: any) {
      message.error(error.message || tMsg('clearSessionsFailed'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HistoryOutlined />
          <span>Session History</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Popconfirm
          key="clear"
          title="Clear all sessions?"
          description="This will delete all conversation history."
          onConfirm={handleClearAll}
          okText="Yes"
          cancelText="No"
        >
          <Button danger disabled={sessions.length === 0}>
            Clear All
          </Button>
        </Popconfirm>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : sessions.length === 0 ? (
        <Empty
          description="No conversation history"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          className="session-history-list"
          dataSource={sessions}
          renderItem={(session) => (
            <List.Item
              className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
              actions={[
                <Button
                  key="load"
                  type="link"
                  size="small"
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  disabled={session.id === currentSessionId}
                >
                  {session.id === currentSessionId ? 'Current' : 'Load'}
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete this session?"
                  onConfirm={() => handleDeleteSession(session.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<MessageOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                title={session.title || 'Untitled Conversation'}
                description={
                  <div className="session-meta">
                    <span>
                      <ClockCircleOutlined /> {formatDate(session.updatedAt)}
                    </span>
                    {session._count && (
                      <span className="message-count">
                        {session._count.messages} messages
                      </span>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default SessionHistory;
