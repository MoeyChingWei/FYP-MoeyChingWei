import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Spin, message, Badge } from 'antd';
import {
  SendOutlined,
  CloseOutlined,
  PlusOutlined,
  RobotOutlined,
  ShoppingOutlined,
  LineChartOutlined,
  SafetyOutlined,
  ShopOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  sendMessageToAgent,
  createAgentSession,
  Agent,
  AgentMessage,
} from '../../shared/api/agents';
import MessageList from './MessageList';
import './MultiAgentChatWindow.css';

interface MultiAgentChatWindowProps {
  userId: number;
  agentType: string;
  agentName: string;
  onClose: () => void;
  onNewMessage?: () => void;
}

// Agent图标映射
const AGENT_ICONS: Record<string, React.ReactNode> = {
  chatbot: <RobotOutlined />,
  purchase: <ShoppingOutlined />,
  analytics: <LineChartOutlined />,
  approval: <SafetyOutlined />,
  supplier: <ShopOutlined />,
  document: <FileTextOutlined />,
};

// Agent颜色映射
const AGENT_COLORS: Record<string, string> = {
  chatbot: '#1890ff',
  purchase: '#52c41a',
  analytics: '#722ed1',
  approval: '#fa8c16',
  supplier: '#13c2c2',
  document: '#eb2f96',
};

// 欢迎消息映射
const WELCOME_MESSAGES: Record<string, string> = {
  chatbot: 'Hello! I am your general AI assistant. I can help you with system navigation and basic queries. How can I help you?',
  purchase: 'As a procurement specialist, I can help you create optimized purchase requests, recommend suppliers, and analyze pricing. What would you like to procure?',
  analytics: 'Based on data analysis, I can provide insights on spending trends, predict future costs, and identify opportunities. What data would you like to analyze?',
  approval: 'From a risk management perspective, I can evaluate purchase requests, assess compliance, and provide approval recommendations. Which request shall I review?',
  supplier: "I'll coordinate with suppliers to track orders, manage deliveries, and resolve issues. What order would you like me to track?",
  document: "I've reviewed numerous documents. I can generate purchase orders, extract data, and verify completeness. What document do you need?",
};

const MultiAgentChatWindow: React.FC<MultiAgentChatWindowProps> = ({
  userId,
  agentType,
  agentName,
  onClose,
  onNewMessage,
}) => {
  const { t: tMsg } = useTranslation('messages');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session when agent changes
  useEffect(() => {
    initializeSession();
  }, [agentType]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const newSessionId = await createAgentSession(agentType, userId);
      setSessionId(newSessionId);

      // Add welcome message
      const welcomeMessage = WELCOME_MESSAGES[agentType] || 'Hello! How can I assist you today?';
      setMessages([
        {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      message.error(tMsg('sessionInitFailed'));
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading || !sessionId) return;

    const userMessage: AgentMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await sendMessageToAgent({
        agentType,
        userId,
        message: inputValue,
        sessionId,
      });

      const assistantMessage: AgentMessage = {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    try {
      const newSessionId = await createAgentSession(agentType, userId);
      setSessionId(newSessionId);

      const welcomeMessage = WELCOME_MESSAGES[agentType] || 'New conversation started.';
      setMessages([
        {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
      message.success(tMsg('newConversationCreated'));
    } catch (error) {
      message.error(tMsg('createConversationFailed'));
    }
  };

  const agentColor = AGENT_COLORS[agentType] || '#1890ff';
  const agentIcon = AGENT_ICONS[agentType] || <RobotOutlined />;

  return (
    <Card
      className="multi-agent-chat-window"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Badge
              dot
              status="success"
              offset={[-5, 5]}
              style={{ backgroundColor: agentColor }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: agentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 16,
                }}
              >
                {agentIcon}
              </div>
            </Badge>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{agentName}</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c' }}>
                AI Agent • Online
              </div>
            </div>
          </div>
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
      styles={{ body: { padding: 0, height: 'calc(100% - 73px)' } }}
      style={{ height: '100%' }}
    >
      <div className="multi-agent-chat-content">
        {/* Message list */}
        <div className="multi-agent-messages">
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="multi-agent-input-container">
          {loading && (
            <div className="multi-agent-loading">
              <Spin size="small" style={{ color: agentColor }} />{' '}
              <span style={{ color: agentColor }}>{agentName} is thinking...</span>
            </div>
          )}
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${agentName}... (Enter to send, Shift+Enter for new line)`}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
            style={{ resize: 'none' }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            style={{
              marginLeft: 8,
              backgroundColor: agentColor,
              borderColor: agentColor,
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MultiAgentChatWindow;
