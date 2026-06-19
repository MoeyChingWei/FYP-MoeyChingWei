import React, { useState } from 'react';
import { Card, Button, Tag } from 'antd';
import { BulbOutlined, RightOutlined } from '@ant-design/icons';
import './AgentRecommender.css';

interface AgentRecommenderProps {
  userMessage: string;
  currentAgent: string;
  onRecommendAgent: (agentType: string) => void;
}

// 关键词匹配规则
const AGENT_KEYWORDS: Record<string, { keywords: string[]; priority: number }> = {
  purchase: {
    keywords: [
      'buy', 'purchase', 'order', 'procurement', 'supplier', 'vendor',
      'laptop', 'equipment', 'inventory', 'stock', 'price', 'cost',
      'create request', 'need to buy', 'want to order'
    ],
    priority: 1,
  },
  analytics: {
    keywords: [
      'analyze', 'analysis', 'data', 'report', 'trend', 'statistics',
      'spending', 'budget', 'forecast', 'predict', 'compare', 'performance',
      'metrics', 'insights', 'dashboard', 'summary'
    ],
    priority: 2,
  },
  approval: {
    keywords: [
      'approve', 'approval', 'review', 'evaluate', 'assess', 'check',
      'risk', 'compliance', 'policy', 'authorize', 'validate',
      'budget status', 'should I approve', 'is this okay'
    ],
    priority: 3,
  },
  supplier: {
    keywords: [
      'track', 'delivery', 'shipment', 'coordinate', 'supplier contact',
      'order status', 'when will it arrive', 'shipping', 'logistics',
      'follow up', 'delivery date', 'po number'
    ],
    priority: 4,
  },
  document: {
    keywords: [
      'document', 'generate', 'create pdf', 'export', 'invoice',
      'purchase order', 'po document', 'extract data', 'verify document',
      'print', 'report generation'
    ],
    priority: 5,
  },
  chatbot: {
    keywords: [
      'help', 'how to', 'what is', 'show me', 'navigate', 'guide',
      'tutorial', 'explain', 'tell me about'
    ],
    priority: 6,
  },
};

const AGENT_NAMES: Record<string, string> = {
  chatbot: 'General Assistant',
  purchase: 'Purchase Expert',
  analytics: 'Data Analyst',
  approval: 'Approval Advisor',
  supplier: 'Supplier Coordinator',
  document: 'Document Specialist',
};

const AgentRecommender: React.FC<AgentRecommenderProps> = ({
  userMessage,
  currentAgent,
  onRecommendAgent,
}) => {
  const [showRecommendation, setShowRecommendation] = useState(false);

  // 分析消息并推荐Agent
  const analyzeAndRecommend = (message: string): string | null => {
    if (!message || message.length < 5) return null;

    const lowerMessage = message.toLowerCase();
    const scores: Record<string, number> = {};

    // 计算每个Agent的匹配分数
    Object.entries(AGENT_KEYWORDS).forEach(([agentType, config]) => {
      let score = 0;

      config.keywords.forEach((keyword) => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          // 完整匹配得分更高
          if (lowerMessage.split(/\s+/).includes(keyword.toLowerCase())) {
            score += 3;
          } else {
            score += 1;
          }
        }
      });

      // 优先级调整
      score = score / config.priority;

      if (score > 0) {
        scores[agentType] = score;
      }
    });

    // 找到得分最高的Agent
    let recommendedAgent: string | null = null;
    let maxScore = 0;

    Object.entries(scores).forEach(([agentType, score]) => {
      if (score > maxScore) {
        maxScore = score;
        recommendedAgent = agentType;
      }
    });

    // 如果推荐的Agent就是当前Agent，不显示推荐
    if (recommendedAgent === currentAgent) {
      return null;
    }

    // 分数太低也不推荐
    if (maxScore < 2) {
      return null;
    }

    return recommendedAgent;
  };

  const recommendedAgent = analyzeAndRecommend(userMessage);

  if (!recommendedAgent) {
    return null;
  }

  return (
    <Card className="agent-recommender-card" size="small">
      <div className="recommender-content">
        <div className="recommender-icon">
          <BulbOutlined style={{ fontSize: 20, color: '#faad14' }} />
        </div>
        <div className="recommender-text">
          <div className="recommender-title">
            <span style={{ fontWeight: 500 }}>Suggestion</span>
            <Tag color="blue" style={{ marginLeft: 8 }}>AI Powered</Tag>
          </div>
          <div className="recommender-message">
            This question might be better answered by the{' '}
            <strong>{AGENT_NAMES[recommendedAgent]}</strong>
          </div>
        </div>
        <Button
          type="primary"
          size="small"
          icon={<RightOutlined />}
          onClick={() => {
            onRecommendAgent(recommendedAgent);
            setShowRecommendation(false);
          }}
        >
          Switch
        </Button>
      </div>
    </Card>
  );
};

export default AgentRecommender;
