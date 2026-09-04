import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Spin, Tooltip, message } from 'antd';
import { SendOutlined, PlusOutlined, ExpandOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  sendMessage,
  createNewSession,
  getSessionHistory,
  uploadAttachment,
} from '../../shared/api/chatbot';
import MessageList from './MessageList';
import InputToolbar from './InputToolbar';
import AttachmentPreview from './AttachmentPreview';
import './ChatWindow.css';

interface Message {
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

interface ChatWindowProps {
  userId: number;
  onClose: () => void;
  onNewMessage?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, onClose, onNewMessage }) => {
  const { t: tMsg } = useTranslation('messages');
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show the welcome state locally. A session is created only after the first message is sent.
  useEffect(() => {
    const savedSessionId = window.localStorage.getItem(`optimind-chat-session-${userId}`);
    if (!savedSessionId) {
      setSessionId(null);
      setMessages([
        {
          role: 'assistant',
          content: tMsg('chatbotWelcome'),
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setSessionId(savedSessionId);
    getSessionHistory(savedSessionId)
      .then((history) => {
        setMessages(history.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt || Date.now()),
          attachments: msg.attachments || undefined,
        })));
      })
      .catch(() => {
        window.localStorage.removeItem(`optimind-chat-session-${userId}`);
        setSessionId(null);
        setMessages([{ role: 'assistant', content: tMsg('chatbotWelcome'), timestamp: new Date() }]);
      });
  }, [userId, tMsg]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendChatMessage = async (messageText: string) => {
    if ((!messageText.trim() && selectedFiles.length === 0) || loading) return;

    let activeSessionId = sessionId;
    setLoading(true);

    try {
      if (!activeSessionId) {
        activeSessionId = await createNewSession(userId);
        setSessionId(activeSessionId);
      }
      if (!activeSessionId) throw new Error('Unable to create chat session');
      const sessionIdForRequest = activeSessionId;
      window.localStorage.setItem(`optimind-chat-session-${userId}`, sessionIdForRequest);

      const attachments: any[] = [];
      for (const file of selectedFiles) {
        attachments.push(await uploadAttachment(file, sessionIdForRequest, userId));
      }

      const content = messageText.trim() || (attachments.length > 0 ? '[Image]' : '');

      const userMessage: Message = {
        role: 'user',
        content,
        timestamp: new Date(),
        attachments: attachments.length > 0 ? attachments : undefined,
      };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
      const response = await sendMessage({
        userId,
        message: content,
        sessionId: sessionIdForRequest,
        attachmentData: attachments.length > 0 ? attachments : undefined,
      });

      if (response.sessionId && response.sessionId !== activeSessionId) {
        setSessionId(response.sessionId);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Trigger new message callback
      if (onNewMessage) {
        onNewMessage();
      }
      setSelectedFiles([]);
    } catch (error: any) {
      message.error(error.message || tMsg('sendMessageFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    await sendChatMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    window.localStorage.removeItem(`optimind-chat-session-${userId}`);
    setSessionId(null);
    setInputValue('');
    setSelectedFiles([]);
    setMessages([
      {
        role: 'assistant',
        content: tMsg('newConversationStarted'),
        timestamp: new Date(),
      },
    ]);
  };

  const handleExpand = () => {
    navigate('/chatbot', {
      state: sessionId ? { sessionId } : undefined,
    });
  };

  return (
    <Card
      className="chatbot-window"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>🤖 OptiMind AI Assistant</span>
          <div>
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleNewChat}
              style={{ marginRight: 8 }}
            >
              New Chat
            </Button>
            <Tooltip title="Open full chat">
              <Button
                type="text"
                size="small"
                icon={<ExpandOutlined />}
                onClick={handleExpand}
                aria-label="Open full chat"
              />
            </Tooltip>
          </div>
        </div>
      }
      styles={{ body: { padding: 0, height: 'calc(100% - 57px)' } }}
      style={{ height: '100%' }}
    >
      <div className="chatbot-content">
        {/* Message list */}
        <div className="chatbot-messages">
          <MessageList messages={messages} onOptionClick={sendChatMessage} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="chatbot-input-container">
          {loading && (
            <div className="chatbot-loading">
              <Spin size="small" /> AI is thinking...
            </div>
          )}
          <AttachmentPreview files={selectedFiles} onRemove={(index) => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))} />
          <div className="chatbot-input-row">
            <InputToolbar
              onFileSelect={(files) => setSelectedFiles((prev) => [...prev, ...files].slice(0, 5))}
              onImageSelect={(files) => setSelectedFiles((prev) => [...prev, ...files].slice(0, 5))}
              disabled={loading}
            />
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
            style={{ resize: 'none' }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && selectedFiles.length === 0) || loading}
            style={{ marginLeft: 8 }}
            >
            Send
          </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
