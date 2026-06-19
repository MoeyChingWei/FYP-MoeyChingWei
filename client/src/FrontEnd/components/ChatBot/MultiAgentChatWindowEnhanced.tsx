import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Spin, message, Badge, Space, Tooltip } from 'antd';
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
  HistoryOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  sendMessageToAgent,
  createAgentSession,
  getAgentHistory,
  Agent,
  AgentMessage,
} from '../../shared/api/agents';
import MessageList from './MessageList';
import QuickReplies from './QuickReplies';
import SessionHistory from './SessionHistory';
import ExportChat from './ExportChat';
import VoiceInput from './VoiceInput';
import AgentRecommender from './AgentRecommender';
import AgentCollaboration from './AgentCollaboration';
import './MultiAgentChatWindowEnhanced.css';

interface MultiAgentChatWindowEnhancedProps {
  userId: number;
  agentType: string;
  agentName: string;
  onClose: () => void;
  onNewMessage?: () => void;
  onSwitchAgent?: (agentType: string) => void;
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
  chatbot: 'Hello! I am your general AI assistant. How can I help you?',
  purchase: 'As a procurement specialist, I can help you optimize your purchasing. What would you like to procure?',
  analytics: 'Based on data analysis, I can provide insights and trends. What would you like to analyze?',
  approval: 'From a risk management perspective, I can evaluate requests and assess compliance. Which request shall I review?',
  supplier: "I'll coordinate with suppliers to track orders and manage deliveries. What order would you like me to track?",
  document: "I've reviewed numerous documents. I can generate, extract, and verify documents. What do you need?",
};

const MultiAgentChatWindowEnhanced: React.FC<MultiAgentChatWindowEnhancedProps> = ({
  userId,
  agentType,
  agentName,
  onClose,
  onNewMessage,
  onSwitchAgent,
}) => {
  const { t: tMsg } = useTranslation('messages');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(true);
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

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;

    if (!textToSend.trim() || loading || !sessionId) return;

    const userMessage: AgentMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await sendMessageToAgent({
        agentType,
        userId,
        message: textToSend,
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

  const handleLoadSession = async (loadSessionId: string) => {
    try {
      setLoading(true);
      const history = await getAgentHistory(agentType, loadSessionId);
      setMessages(history);
      setSessionId(loadSessionId);
      message.success(tMsg('sessionLoaded'));
    } catch (error: any) {
      message.error(error.message || tMsg('sessionLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    // Auto-send after a short delay
    setTimeout(() => {
      handleSendMessage(reply);
    }, 100);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript);
  };

  const handleAgentRecommendation = (recommendedAgent: string) => {
    if (onSwitchAgent) {
      onSwitchAgent(recommendedAgent);
      message.success(tMsg('switchedToRecommendedAgent'));
    }
  };

  const handleCollaborate = (targetAgent: string, context: string) => {
    if (onSwitchAgent) {
      // Add context message before switching
      const contextMessage: AgentMessage = {
        role: 'assistant',
        content: `🔄 Collaborating with ${targetAgent}...\nContext: ${context}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, contextMessage]);

      setTimeout(() => {
        onSwitchAgent(targetAgent);
      }, 500);
    }
  };

  const agentColor = AGENT_COLORS[agentType] || '#1890ff';
  const agentIcon = AGENT_ICONS[agentType] || <RobotOutlined />;

  return (
    <Card
      className="multi-agent-chat-window-enhanced"
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
              <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>
                AI Agent • Online
              </div>
            </div>
          </div>
          <Space>
            <Tooltip title="Session History">
              <Button
                type="text"
                size="small"
                icon={<HistoryOutlined />}
                onClick={() => setShowHistory(true)}
                style={{ color: 'white' }}
              />
            </Tooltip>
            <Tooltip title="Collaborate with another agent">
              <Button
                type="text"
                size="small"
                icon={<TeamOutlined />}
                onClick={() => setShowCollaboration(true)}
                style={{ color: 'white' }}
              />
            </Tooltip>
            <ExportChat messages={messages} agentName={agentName} agentType={agentType} />
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleNewChat}
              style={{ color: 'white' }}
            >
              New
            </Button>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: 'white' }}
            />
          </div>
        </div>
      }
      bodyStyle={{ padding: 0, height: 'calc(100% - 73px)' }}
      style={{ height: '100%' }}
    >
      <div className="multi-agent-chat-content-enhanced">
        {/* Message list */}
        <div className="multi-agent-messages-enhanced">
          {/* Agent Recommendation */}
          {showRecommendation && inputValue && (
            <AgentRecommender
              userMessage={inputValue}
              currentAgent={agentType}
              onRecommendAgent={handleAgentRecommendation}
            />
          )}

          {/* Quick Replies */}
          <QuickReplies agentType={agentType} onSelectReply={handleQuickReply} />

          {/* Messages */}
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="multi-agent-input-container-enhanced">
          {loading && (
            <div className="multi-agent-loading-enhanced">
              <Spin size="small" style={{ color: agentColor }} />{' '}
              <span style={{ color: agentColor }}>{agentName} is thinking...</span>
            </div>
          )}
          <div className="input-row">
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${agentName}... (Enter to send, Shift+Enter for new line)`}
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={loading}
              style={{ resize: 'none', flex: 1 }}
            />
            <Space>
              <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || loading}
                style={{
                  backgroundColor: agentColor,
                  borderColor: agentColor,
                }}
              >
                Send
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SessionHistory
        agentType={agentType}
        userId={userId}
        currentSessionId={sessionId}
        onSelectSession={handleLoadSession}
        visible={showHistory}
        onClose={() => setShowHistory(false)}
      />

      <AgentCollaboration
        currentAgent={agentType}
        currentAgentName={agentName}
        onCollaborate={handleCollaborate}
        visible={showCollaboration}
        onClose={() => setShowCollaboration(false)}
      />
    </Card>
  );
};

export default MultiAgentChatWindowEnhanced;
