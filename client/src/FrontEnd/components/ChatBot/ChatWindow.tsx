import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Spin, message } from 'antd';
import { SendOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { sendMessage, createNewSession, getSessionHistory } from '../../shared/api/chatbot';
import MessageList from './MessageList';
import './ChatWindow.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatWindowProps {
  userId: number;
  onClose: () => void;
  onNewMessage?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, onClose, onNewMessage }) => {
  const { t: tMsg } = useTranslation('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    initializeSession();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const newSessionId = await createNewSession(userId);
      setSessionId(newSessionId);

      // Add welcome message
      setMessages([
        {
          role: 'assistant',
          content: tMsg('chatbotWelcome'),
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      message.error(tMsg('sessionInitFailed'));
      console.error(error);
    }
  };

  const sendChatMessage = async (messageText: string) => {
    if (!messageText.trim() || loading || !sessionId) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await sendMessage({
        userId,
        message: messageText,
        sessionId,
      });

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

  const handleNewChat = async () => {
    try {
      const newSessionId = await createNewSession(userId);
      setSessionId(newSessionId);
      setMessages([
        {
          role: 'assistant',
          content: tMsg('newConversationStarted'),
          timestamp: new Date(),
        },
      ]);
      message.success(tMsg('newConversationCreated'));
    } catch (error) {
      message.error(tMsg('createConversationFailed'));
    }
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
            <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
          </div>
        </div>
      }
      bodyStyle={{ padding: 0, height: 'calc(100% - 57px)' }}
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
            disabled={!inputValue.trim() || loading}
            style={{ marginLeft: 8 }}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
