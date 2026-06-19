import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Tag, Spin } from 'antd';
import {
  MessageOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import './AgentStats.css';

interface AgentStatsProps {
  userId: number;
}

interface AgentUsage {
  agentType: string;
  agentName: string;
  sessionCount: number;
  messageCount: number;
  avgResponseTime: number;
  lastUsed: string;
}

const AGENT_COLORS: Record<string, string> = {
  chatbot: '#1890ff',
  purchase: '#52c41a',
  analytics: '#722ed1',
  approval: '#fa8c16',
  supplier: '#13c2c2',
  document: '#eb2f96',
};

const AgentStats: React.FC<AgentStatsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AgentUsage[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // 模拟统计数据（实际应该从API获取）
      // 在实际项目中，需要添加API端点来获取统计数据
      const mockStats: AgentUsage[] = [
        {
          agentType: 'chatbot',
          agentName: 'General Assistant',
          sessionCount: 15,
          messageCount: 87,
          avgResponseTime: 2.3,
          lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          agentType: 'purchase',
          agentName: 'Purchase Expert',
          sessionCount: 12,
          messageCount: 65,
          avgResponseTime: 3.1,
          lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          agentType: 'analytics',
          agentName: 'Data Analyst',
          sessionCount: 8,
          messageCount: 42,
          avgResponseTime: 4.5,
          lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          agentType: 'approval',
          agentName: 'Approval Advisor',
          sessionCount: 5,
          messageCount: 28,
          avgResponseTime: 2.8,
          lastUsed: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
        {
          agentType: 'supplier',
          agentName: 'Supplier Coordinator',
          sessionCount: 6,
          messageCount: 31,
          avgResponseTime: 3.2,
          lastUsed: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        },
        {
          agentType: 'document',
          agentName: 'Document Specialist',
          sessionCount: 4,
          messageCount: 19,
          avgResponseTime: 2.5,
          lastUsed: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // 按使用频率排序
      mockStats.sort((a, b) => b.messageCount - a.messageCount);

      setStats(mockStats);
      setTotalMessages(mockStats.reduce((sum, stat) => sum + stat.messageCount, 0));
      setTotalSessions(mockStats.reduce((sum, stat) => sum + stat.sessionCount, 0));
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const calculateUsagePercentage = (messageCount: number) => {
    return totalMessages > 0 ? Math.round((messageCount / totalMessages) * 100) : 0;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="agent-stats-container">
      {/* 总览统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Messages"
              value={totalMessages}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Sessions"
              value={totalSessions}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Avg Response Time"
              value={
                stats.length > 0
                  ? (
                      stats.reduce((sum, s) => sum + s.avgResponseTime, 0) / stats.length
                    ).toFixed(1)
                  : 0
              }
              suffix="s"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Agent使用排行 */}
      <Card title={<><TrophyOutlined /> Agent Usage Ranking</>}>
        <List
          dataSource={stats}
          renderItem={(stat, index) => (
            <List.Item className="agent-stat-item">
              <div className="stat-rank">#{index + 1}</div>
              <div className="stat-info">
                <div className="stat-header">
                  <span className="stat-name">{stat.agentName}</span>
                  <Tag color={AGENT_COLORS[stat.agentType]}>{stat.agentType}</Tag>
                </div>
                <div className="stat-details">
                  <span>
                    <MessageOutlined /> {stat.messageCount} messages
                  </span>
                  <span>
                    <BarChartOutlined /> {stat.sessionCount} sessions
                  </span>
                  <span>
                    <ClockCircleOutlined /> {stat.avgResponseTime}s avg
                  </span>
                  <span className="last-used">Last used: {formatTime(stat.lastUsed)}</span>
                </div>
                <Progress
                  percent={calculateUsagePercentage(stat.messageCount)}
                  strokeColor={AGENT_COLORS[stat.agentType]}
                  size="small"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </div>
              <div className="stat-percentage">
                {calculateUsagePercentage(stat.messageCount)}%
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AgentStats;
