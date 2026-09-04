import React, { useState } from 'react';
import { Badge, Button, Dropdown, Menu } from 'antd';
import {
  MessageOutlined,
  CloseOutlined,
  RobotOutlined,
  ShoppingOutlined,
  LineChartOutlined,
  SafetyOutlined,
  ShopOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import MultiAgentChatWindow from './MultiAgentChatWindow';
import './MultiAgentWidget.css';

interface MultiAgentWidgetProps {
  userId: number;
}

const AGENT_OPTIONS = [
  { key: 'chatbot', label: 'General Assistant', icon: <RobotOutlined />, color: '#1890ff' },
  { key: 'purchase', label: 'Purchase Expert', icon: <ShoppingOutlined />, color: '#52c41a' },
  { key: 'analytics', label: 'Data Analyst', icon: <LineChartOutlined />, color: '#722ed1' },
  { key: 'approval', label: 'Approval Advisor', icon: <SafetyOutlined />, color: '#fa8c16' },
  { key: 'supplier', label: 'Supplier Coordinator', icon: <ShopOutlined />, color: '#13c2c2' },
  { key: 'document', label: 'Document Specialist', icon: <FileTextOutlined />, color: '#eb2f96' },
];

const MultiAgentWidget: React.FC<MultiAgentWidgetProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('chatbot');
  const [selectedAgentName, setSelectedAgentName] = useState<string>('General Assistant');
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Clear unread count when opened
    }
  };

  const handleNewMessage = () => {
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const handleSelectAgent = (agentKey: string) => {
    const agent = AGENT_OPTIONS.find((a) => a.key === agentKey);
    if (agent) {
      setSelectedAgent(agentKey);
      setSelectedAgentName(agent.label);
      setIsOpen(true);
    }
  };

  const menu = (
    <Menu
      onClick={({ key }) => handleSelectAgent(key)}
      items={AGENT_OPTIONS.map((agent) => ({
        key: agent.key,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: agent.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 14,
              }}
            >
              {agent.icon}
            </div>
            <span>{agent.label}</span>
          </div>
        ),
      }))}
    />
  );

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="multi-agent-widget-window">
          <MultiAgentChatWindow
            userId={userId}
            agentType={selectedAgent}
            agentName={selectedAgentName}
            onClose={() => setIsOpen(false)}
            onNewMessage={handleNewMessage}
          />
        </div>
      )}

      {/* Floating button group */}
      <div className="multi-agent-widget-buttons">
        {/* Agent selector dropdown (only show when closed) */}
        {!isOpen && (
          <Dropdown menu={{ items: menu.props.items }} placement="topRight" trigger={['click']}>
            <Button
              type="default"
              shape="circle"
              size="large"
              icon={<RobotOutlined />}
              style={{
                width: 50,
                height: 50,
                fontSize: 20,
                marginBottom: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              title="Select AI Agent"
            />
          </Dropdown>
        )}

        {/* Main toggle button */}
        <Badge count={unreadCount} offset={[-5, 5]}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
            onClick={toggleChat}
            style={{
              width: 60,
              height: 60,
              fontSize: 24,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          />
        </Badge>
      </div>
    </>
  );
};

export default MultiAgentWidget;
