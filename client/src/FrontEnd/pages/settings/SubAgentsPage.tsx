import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import SubAgentCard from './components/SubAgentCard';
import AgentDetailModal from './components/AgentDetailModal';
import { getMainAgentBySlug, getAgentsByMainAgent } from '../../modules/aiAssistant/utils';
import { AIAgent } from '../../modules/aiAssistant/types';
import styles from './SubAgentsPage.module.css';

export default function SubAgentsPage(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  // Get Main Agent and Sub Agents
  const mainAgent = slug ? getMainAgentBySlug(slug) : null;
  const subAgents = slug ? getAgentsByMainAgent(slug) : [];

  // Sync selectedAgent with URL query param
  useEffect(() => {
    const agentId = searchParams.get('agent');
    if (agentId) {
      const agent = subAgents.find(a => a.id === agentId);
      setSelectedAgent(agent || null);
    } else {
      setSelectedAgent(null);
    }
  }, [searchParams, subAgents]);

  const handleCloseModal = () => {
    setSearchParams({});
  };

  // Error state: Main Agent not found
  if (!mainAgent) {
    return (
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Settings', path: '/settings' },
            { label: 'AI Assistant', path: '/settings/ai-assistant' },
            { label: 'Not Found' },
          ]}
        />
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>❌</div>
          <h2 className={styles.errorTitle}>Main Agent Not Found</h2>
          <p className={styles.errorMessage}>
            The requested agent category could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Empty state: No sub-agents
  if (subAgents.length === 0) {
    return (
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Settings', path: '/settings' },
            { label: 'AI Assistant', path: '/settings/ai-assistant' },
            { label: mainAgent.name },
          ]}
        />
        <header className={styles.header}>
          <div className={styles.iconLarge}>{mainAgent.icon}</div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{mainAgent.name}</h1>
            <p className={styles.subtitle}>{mainAgent.subtitle}</p>
          </div>
        </header>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h2 className={styles.emptyTitle}>No Sub-Agents Available</h2>
          <p className={styles.emptyMessage}>
            There are currently no sub-agents configured for this category.
          </p>
        </div>
      </div>
    );
  }

  // Normal state: Display sub-agents
  return (
    <div className={styles.container}>
      <Breadcrumb
        items={[
          { label: 'Settings', path: '/settings' },
          { label: 'AI Assistant', path: '/settings/ai-assistant' },
          { label: mainAgent.name },
        ]}
      />

      <header className={styles.header}>
        <div className={styles.iconLarge}>{mainAgent.icon}</div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{mainAgent.name}</h1>
          <p className={styles.subtitle}>{mainAgent.subtitle}</p>
        </div>
      </header>

      <div className={styles.grid}>
        {subAgents.map(agent => (
          <SubAgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <AgentDetailModal
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={handleCloseModal}
      />
    </div>
  );
}
