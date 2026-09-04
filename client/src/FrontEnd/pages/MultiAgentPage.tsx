import React, { useState } from 'react';
import { Row, Col, Typography, Card } from 'antd';
import AgentSelector from '../components/ChatBot/AgentSelector';
import MultiAgentChatWindow from '../components/ChatBot/MultiAgentChatWindow';
import './MultiAgentPage.css';

const { Title, Paragraph } = Typography;

interface MultiAgentPageProps {
  userId: number;
}

const MultiAgentPage: React.FC<MultiAgentPageProps> = ({ userId }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('chatbot');
  const [agentName, setAgentName] = useState<string>('General Assistant');

  const handleSelectAgent = (agentType: string) => {
    setSelectedAgent(agentType);

    // 设置Agent名称
    const nameMap: Record<string, string> = {
      chatbot: 'General Assistant',
      purchase: 'Purchase Expert',
      analytics: 'Data Analyst',
      approval: 'Approval Advisor',
      supplier: 'Supplier Coordinator',
      document: 'Document Specialist',
    };

    setAgentName(nameMap[agentType] || 'AI Agent');
  };

  return (
    <div className="multi-agent-page">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} style={{ margin: 0 }}>
          🤖 Multi-Agent AI Assistant
        </Title>
        <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c' }}>
          Choose from 6 specialized AI agents, each with unique expertise and personality
        </Paragraph>
      </div>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Agent Selector */}
        <Col xs={24} lg={8}>
          <AgentSelector selectedAgent={selectedAgent} onSelectAgent={handleSelectAgent} />

          {/* Quick Tips Card */}
          <Card
            title="💡 Quick Tips"
            style={{ marginTop: 24 }}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
              <li>
                <strong>ChatBot:</strong> General queries and navigation
              </li>
              <li>
                <strong>Purchase:</strong> Create optimized purchase requests
              </li>
              <li>
                <strong>Analytics:</strong> Data analysis and insights
              </li>
              <li>
                <strong>Approval:</strong> Risk assessment and compliance
              </li>
              <li>
                <strong>Supplier:</strong> Order tracking and coordination
              </li>
              <li>
                <strong>Document:</strong> PDF generation and verification
              </li>
            </ul>
          </Card>
        </Col>

        {/* Chat Window */}
        <Col xs={24} lg={16}>
          <MultiAgentChatWindow
            userId={userId}
            agentType={selectedAgent}
            agentName={agentName}
            onClose={() => {
              // Handle close if needed
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MultiAgentPage;
