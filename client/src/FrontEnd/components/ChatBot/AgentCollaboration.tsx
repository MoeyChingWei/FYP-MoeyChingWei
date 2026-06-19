import React, { useState } from 'react';
import { Modal, Select, Button, message, Steps } from 'antd';
import { TeamOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './AgentCollaboration.css';

interface AgentCollaborationProps {
  currentAgent: string;
  currentAgentName: string;
  onCollaborate: (targetAgent: string, context: string) => void;
  visible: boolean;
  onClose: () => void;
}

const AGENT_OPTIONS = [
  { value: 'chatbot', label: 'General Assistant', icon: '🤖' },
  { value: 'purchase', label: 'Purchase Expert', icon: '🛒' },
  { value: 'analytics', label: 'Data Analyst', icon: '📊' },
  { value: 'approval', label: 'Approval Advisor', icon: '⚖️' },
  { value: 'supplier', label: 'Supplier Coordinator', icon: '📦' },
  { value: 'document', label: 'Document Specialist', icon: '📄' },
];

// 协作场景示例
const COLLABORATION_SCENARIOS: Record<string, { target: string; description: string }[]> = {
  chatbot: [
    {
      target: 'purchase',
      description: 'Transfer to Purchase Expert for detailed procurement help',
    },
    {
      target: 'analytics',
      description: 'Get data analysis and insights',
    },
  ],
  purchase: [
    {
      target: 'analytics',
      description: 'Analyze price trends before creating purchase request',
    },
    {
      target: 'approval',
      description: 'Get pre-approval risk assessment',
    },
    {
      target: 'supplier',
      description: 'Check supplier availability and delivery times',
    },
  ],
  analytics: [
    {
      target: 'approval',
      description: 'Identify high-risk spending patterns for review',
    },
    {
      target: 'document',
      description: 'Generate detailed analysis reports',
    },
  ],
  approval: [
    {
      target: 'analytics',
      description: 'Request detailed spending analysis for risk assessment',
    },
    {
      target: 'purchase',
      description: 'Get alternative procurement options',
    },
  ],
  supplier: [
    {
      target: 'document',
      description: 'Generate delivery confirmation documents',
    },
    {
      target: 'approval',
      description: 'Report delivery exceptions for review',
    },
  ],
  document: [
    {
      target: 'approval',
      description: 'Verify document compliance with policies',
    },
    {
      target: 'analytics',
      description: 'Analyze document data patterns',
    },
  ],
};

const AgentCollaboration: React.FC<AgentCollaborationProps> = ({
  currentAgent,
  currentAgentName,
  onCollaborate,
  visible,
  onClose,
}) => {
  const { t: tMsg } = useTranslation('messages');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const scenarios = COLLABORATION_SCENARIOS[currentAgent] || [];
  const filteredAgents = AGENT_OPTIONS.filter((opt) => opt.value !== currentAgent);

  const handleCollaborate = () => {
    if (!selectedAgent) {
      message.warning(tMsg('selectAgentWarning'));
      return;
    }

    const context = `Collaborating from ${currentAgentName}`;
    onCollaborate(selectedAgent, context);
    message.success(tMsg('agentCollaborationInitiated'));
    onClose();
    setStep(0);
    setSelectedAgent(null);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamOutlined />
          <span>Agent Collaboration</span>
        </div>
      }
      open={visible}
      onCancel={() => {
        onClose();
        setStep(0);
        setSelectedAgent(null);
      }}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="collaborate"
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={handleCollaborate}
          disabled={!selectedAgent}
        >
          Start Collaboration
        </Button>,
      ]}
    >
      <div className="collaboration-content">
        <Steps
          current={step}
          size="small"
          style={{ marginBottom: 24 }}
          items={[
            { title: 'Current Agent' },
            { title: 'Select Collaborator' },
            { title: 'Collaborate' },
          ]}
        />

        <div className="current-agent-section">
          <div className="section-title">Current Agent:</div>
          <div className="agent-display">
            <span className="agent-icon">
              {AGENT_OPTIONS.find((a) => a.value === currentAgent)?.icon}
            </span>
            <span className="agent-name">{currentAgentName}</span>
          </div>
        </div>

        <div className="collaboration-arrow">
          <ArrowRightOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        </div>

        <div className="target-agent-section">
          <div className="section-title">Collaborate with:</div>
          <Select
            style={{ width: '100%' }}
            placeholder="Select an agent"
            value={selectedAgent}
            onChange={setSelectedAgent}
            size="large"
          >
            {filteredAgents.map((agent) => (
              <Select.Option key={agent.value} value={agent.value}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{agent.icon}</span>
                  <span>{agent.label}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>

        {scenarios.length > 0 && (
          <div className="scenarios-section">
            <div className="section-title">💡 Suggested Collaborations:</div>
            <div className="scenarios-list">
              {scenarios.map((scenario, index) => {
                const targetAgent = AGENT_OPTIONS.find((a) => a.value === scenario.target);
                return (
                  <div
                    key={index}
                    className={`scenario-item ${selectedAgent === scenario.target ? 'selected' : ''}`}
                    onClick={() => setSelectedAgent(scenario.target)}
                  >
                    <div className="scenario-header">
                      <span className="scenario-icon">{targetAgent?.icon}</span>
                      <span className="scenario-name">{targetAgent?.label}</span>
                    </div>
                    <div className="scenario-desc">{scenario.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="collaboration-info">
          <p style={{ margin: 0, color: '#8c8c8c', fontSize: 12 }}>
            💡 Agent collaboration allows seamless handoff of context between specialized agents for
            comprehensive task completion.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AgentCollaboration;
