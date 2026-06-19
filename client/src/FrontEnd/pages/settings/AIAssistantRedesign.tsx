import React from 'react';
import { Typography } from 'antd';
import { MAIN_AGENTS } from '../../modules/aiAssistant/mainAgents';
import MainAgentCard from './components/MainAgentCard';
import styles from './AIAssistantRedesign.module.css';

const { Title, Paragraph } = Typography;

export default function AIAssistantRedesign(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          AI Assistant Configuration
        </Title>
        <Paragraph className={styles.description}>
          Configure and manage AI assistants to automate procurement tasks
        </Paragraph>
      </div>

      <div className={styles.grid}>
        {MAIN_AGENTS.map((agent) => (
          <MainAgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <div className={styles.tip}>
        <strong>💡 Tip:</strong> Click any Main Agent card to view all its Sub Agents
      </div>
    </div>
  );
}
