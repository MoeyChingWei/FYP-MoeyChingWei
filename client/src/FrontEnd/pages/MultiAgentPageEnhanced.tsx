import React, { useState } from 'react';
import { Row, Col, Typography, Card, Tabs, Button } from 'antd';
import { BarChartOutlined, MessageOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import AgentSelector from '../components/ChatBot/AgentSelector';
import MultiAgentChatWindowEnhanced from '../components/ChatBot/MultiAgentChatWindowEnhanced';
import AgentStats from '../components/ChatBot/AgentStats';
import './MultiAgentPageEnhanced.css';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

interface MultiAgentPageEnhancedProps {
  userId: number;
}

const MultiAgentPageEnhanced: React.FC<MultiAgentPageEnhancedProps> = ({ userId }) => {
  const { t } = useTranslation('multiAgent');
  const [selectedAgent, setSelectedAgent] = useState<string>('chatbot');
  const [agentName, setAgentName] = useState<string>(t('agents.general'));
  const [activeTab, setActiveTab] = useState<string>('chat');

  const handleSelectAgent = (agentType: string) => {
    setSelectedAgent(agentType);

    // Map agent types to translation keys
    const nameMap: Record<string, string> = {
      chatbot: t('agents.general'),
      purchase: t('agents.purchase'),
      analytics: t('agents.analytics'),
      approval: t('agents.approval'),
      supplier: t('agents.supplier'),
      document: t('agents.document'),
    };

    setAgentName(nameMap[agentType] || t('agents.general'));
  };

  return (
    <div className="multi-agent-page-enhanced">
      {/* Page Header */}
      <div className="page-header-enhanced">
        <Title level={2} style={{ margin: 0 }}>
          {t('title')}
        </Title>
        <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c' }}>
          {t('subtitle')}
        </Paragraph>
      </div>

      {/* Main Content with Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        className="main-tabs"
        tabBarExtraContent={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type={activeTab === 'chat' ? 'primary' : 'default'}
              icon={<MessageOutlined />}
              onClick={() => setActiveTab('chat')}
            >
              {t('tabs.chat')}
            </Button>
            <Button
              type={activeTab === 'stats' ? 'primary' : 'default'}
              icon={<BarChartOutlined />}
              onClick={() => setActiveTab('stats')}
            >
              {t('tabs.statistics')}
            </Button>
          </div>
        }
      >
        {/* Chat Tab */}
        <TabPane tab={t('tabPane.chat')} key="chat">
          <Row gutter={[24, 24]}>
            {/* Agent Selector */}
            <Col xs={24} lg={8}>
              <AgentSelector selectedAgent={selectedAgent} onSelectAgent={handleSelectAgent} />

              {/* Feature Highlights Card */}
              <Card
                title={t('features.title')}
                style={{ marginTop: 24 }}
                bodyStyle={{ padding: '16px 20px' }}
              >
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
                  <li dangerouslySetInnerHTML={{ __html: t('features.quickReplies') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('features.sessionHistory') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('features.exportChat') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('features.voiceInput') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('features.smartRecommendations') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('features.autoComplete') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('features.agentCollaboration') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('features.usageStats') }} />
                </ul>
              </Card>

              {/* Quick Tips Card */}
              <Card
                title={t('tips.title')}
                style={{ marginTop: 24 }}
                bodyStyle={{ padding: '16px 20px' }}
              >
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
                  <li dangerouslySetInnerHTML={{ __html: t('tips.quickActions') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('tips.voiceInput') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('tips.history') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('tips.collaborate') }} />
                  <li dangerouslySetInnerHTML={{ __html: t('tips.exportConversations') }} />
                </ul>
              </Card>
            </Col>

            {/* Chat Window */}
            <Col xs={24} lg={16}>
              <MultiAgentChatWindowEnhanced
                userId={userId}
                agentType={selectedAgent}
                agentName={agentName}
                onClose={() => {
                  // Handle close if needed
                }}
                onSwitchAgent={handleSelectAgent}
              />
            </Col>
          </Row>
        </TabPane>

        {/* Statistics Tab */}
        <TabPane tab={t('tabPane.statistics')} key="stats">
          <AgentStats userId={userId} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MultiAgentPageEnhanced;
