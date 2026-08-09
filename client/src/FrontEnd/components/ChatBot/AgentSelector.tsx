import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, message, Row, Select, Spin, Tag } from 'antd';
import {
  FileTextOutlined,
  LineChartOutlined,
  RobotOutlined,
  SafetyOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAllAgents, type Agent } from '../../shared/api/agents';
import './AgentSelector.css';

interface AgentSelectorProps {
  selectedAgent: string;
  onSelectAgent: (agentType: string) => void;
}

const AGENT_ICONS: Record<string, React.ReactNode> = {
  chatbot: <RobotOutlined />,
  purchase: <ShoppingOutlined />,
  analytics: <LineChartOutlined />,
  approval: <SafetyOutlined />,
  supplier: <ShopOutlined />,
  document: <FileTextOutlined />,
};

const AGENT_COLORS: Record<string, string> = {
  chatbot: '#1677ff',
  purchase: '#389e0d',
  analytics: '#7c3aed',
  approval: '#d97706',
  supplier: '#0891b2',
  document: '#db2777',
};

const AgentSelector: React.FC<AgentSelectorProps> = ({ selectedAgent, onSelectAgent }) => {
  const { t: tMsg } = useTranslation('messages');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        setAgents(await getAllAgents());
      } catch (error: any) {
        message.error(error.message || tMsg('loadAgentsFailed'));
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadAgents();
  }, [tMsg]);

  const currentAgent = agents.find((agent) => agent.type === selectedAgent);

  if (loading) {
    return (
      <Card className="agent-selector-card">
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#8c8c8c' }}>Loading AI assistants...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="agent-selector-card" title="Choose an AI assistant">
      <Select
        value={selectedAgent}
        onChange={onSelectAgent}
        style={{ width: '100%', marginBottom: 24 }}
        size="large"
        placeholder="Choose an AI assistant"
        optionLabelProp="label"
      >
        {agents.map((agent) => (
          <Select.Option key={agent.type} value={agent.type} label={agent.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar
                size="small"
                icon={AGENT_ICONS[agent.type] || <RobotOutlined />}
                style={{ backgroundColor: AGENT_COLORS[agent.type] || '#1677ff' }}
              />
              <span style={{ fontWeight: 500 }}>{agent.name}</span>
              <span style={{ color: '#8c8c8c', fontSize: 12 }}>- {agent.expertise}</span>
            </div>
          </Select.Option>
        ))}
      </Select>

      {currentAgent && (
        <div className="agent-details">
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Avatar
                size={64}
                icon={AGENT_ICONS[currentAgent.type] || <RobotOutlined />}
                style={{
                  backgroundColor: AGENT_COLORS[currentAgent.type] || '#1677ff',
                  fontSize: 32,
                }}
              />
            </Col>
            <Col flex="auto">
              <h3 style={{ margin: 0, fontSize: 18 }}>{currentAgent.name}</h3>
              <p style={{ margin: '4px 0 0', color: '#8c8c8c', fontSize: 14 }}>
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
              <span className="info-label">Available tools:</span>
              <Tag color="green">{currentAgent.toolCount} tools</Tag>
            </div>
          </div>

          {currentAgent.tools.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 12 }}>
                Key capabilities
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {currentAgent.tools.slice(0, 3).map((tool) => (
                  <Tag key={tool} style={{ fontSize: 11 }}>
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
