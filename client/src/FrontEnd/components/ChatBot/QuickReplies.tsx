import React from 'react';
import { Tag } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import './QuickReplies.css';

interface QuickRepliesProps {
  agentType: string;
  onSelectReply: (message: string) => void;
}

// 每个Agent的快捷回复
const QUICK_REPLIES: Record<string, string[]> = {
  chatbot: [
    'Show my purchase requests',
    'What can you help me with?',
    'Show dashboard statistics',
    'Check my notifications',
    'How do I create a purchase request?',
  ],
  purchase: [
    'Create a new purchase request',
    'Recommend suppliers for IT equipment',
    'Analyze price history for laptops',
    'Check inventory status',
    'Calculate bulk order savings',
    'Show recent purchase requests',
  ],
  analytics: [
    'Analyze spending trends for IT department',
    'Compare spending across departments',
    'Predict next quarter spending',
    'Identify price anomalies',
    'Show supplier performance metrics',
    'Generate executive summary report',
  ],
  approval: [
    'Evaluate my latest purchase request',
    'Check budget status for my department',
    'Review my approval history',
    'What are the approval policies?',
    'Calculate risk score for a request',
    'Show pending approvals',
  ],
  supplier: [
    'Track all active orders',
    'Check delivery performance',
    'Coordinate delivery for PO-2024-123',
    'Send notification to supplier',
    'Handle delivery exception',
    'Show supplier contact information',
  ],
  document: [
    'Generate purchase order document',
    'Verify document completeness',
    'Extract data from invoice',
    'Compare PO with invoice',
    'Generate spending summary report',
    'Create purchase request document',
  ],
};

const QuickReplies: React.FC<QuickRepliesProps> = ({ agentType, onSelectReply }) => {
  const replies = QUICK_REPLIES[agentType] || [];

  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="quick-replies-container">
      <div className="quick-replies-header">
        <ThunderboltOutlined style={{ color: '#faad14' }} />
        <span>Quick Actions</span>
      </div>
      <div className="quick-replies-list">
        {replies.map((reply, index) => (
          <Tag
            key={index}
            className="quick-reply-tag"
            onClick={() => onSelectReply(reply)}
          >
            {reply}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
