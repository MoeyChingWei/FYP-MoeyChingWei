import React, { useState, useEffect } from 'react';
import { Card, Select, Avatar, Spin, message, Row, Col, Tag } from 'antd';
import {
  RobotOutlined,
  ShoppingOutlined,
  LineChartOutlined,
  SafetyOutlined,
  ShopOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAllAgents, Agent } from '../../shared/api/agents';
import './AgentSelector.css';

interface AgentSelectorProps {
  selectedAgent: string;
  onSelectAgent: (agentType: string) => void;
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

const AgentSelector: React.FC<AgentSelectorProps> = ({ selectedAgent, onSelectAgent }) => {
  const { t: tMsg } = useTranslation('messages');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAllAgents();
      setAgents(data);
    } catch (error: any) {
      message.error(error.message || tMsg('loadAgentsFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentAgent = agents.find((a) => a.type === selectedAgent);

  if (loading) {
    return (
      <Card className="agent-selector-card">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#8c8c8c' }}>Loading AI Agents...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="agent-selector-card" title="🤖 Select AI Agent">
      {/* Dropdown选择器 */}
      <Select
        value={selectedAgent}
        onChange={onSelectAgent}
        style={{ width: '100%', marginBottom: 24 }}
        size="large"
        placeholder="Choose an AI agent"
      >
        {agents.map((agent) => (
          <Select.Option key={agent.type} value={agent.type}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar
                size="small"
                icon={AGENT_ICONS[agent.type] || <RobotOutlined />}
                style={{ backgroundColor: AGENT_COLORS[agent.type] || '#1890ff' }}
              />
              <span style={{ fontWeight: 500 }}>{agent.name}</span>
              <span style={{ color: '#8c8c8c', fontSize: '12px' }}>• {agent.expertise}</span>
            </div>
          </Select.Option>
        ))}
      </Select>

      {/* 当前选中Agent的详细信息 */}
      {currentAgent && (
        <div className="agent-details">
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Avatar
                size={64}
                icon={AGENT_ICONS[currentAgent.type] || <RobotOutlined />}
                style={{
                  backgroundColor: AGENT_COLORS[currentAgent.type] || '#1890ff',
                  fontSize: 32,
                }}
              />
            </Col>
            <Col flex="auto">
              <h3 style={{ margin: 0, fontSize: 18 }}>{currentAgent.name}</h3>
              <p style={{ margin: '4px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
                {currentAgent.description}
              </p>
            </Col>
          </Row>

          <div className="agent-info-section">
            <div className="info-item">
              <span className="info-label">Personality:</span>
              <Tag color="blue">{currentAgent.personality}</Tag>
            </div>

            <div className="info-item">
              <span className="info-label">Expertise:</span>
              <span className="info-value">{currentAgent.expertise}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Available Tools:</span>
              <Tag color="green">{currentAgent.toolCount} tools</Tag>
            </div>
          </div>

          {/* 显示部分工具 */}
          {currentAgent.tools && currentAgent.tools.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
                Key Capabilities:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {currentAgent.tools.slice(0, 3).map((tool, idx) => (
                  <Tag key={idx} style={{ fontSize: 11 }}>
                    {tool.replace(/_/g, ' ')}
                  </Tag>
                ))}
                {currentAgent.tools.length > 3 && (
                  <Tag style={{ fontSize: 11 }}>+{currentAgent.tools.length - 3} more</Tag>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default AgentSelector;
