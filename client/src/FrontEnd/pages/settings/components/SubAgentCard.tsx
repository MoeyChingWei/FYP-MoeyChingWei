import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AIAgent } from '../../../modules/aiAssistant/types';
import styles from './SubAgentCard.module.css';

interface SubAgentCardProps {
  agent: AIAgent;
}

export default function SubAgentCard({ agent }: SubAgentCardProps): React.ReactElement {
  const { t } = useTranslation('settings');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleViewDetails = () => {
    setSearchParams({ agent: agent.id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails();
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.icon}>{agent.icon}</div>

      <div className={styles.content}>
        <h3 className={styles.name}>{agent.name}</h3>
        <p className={styles.description}>{agent.description}</p>
      </div>

      <button
        className={styles.button}
        onClick={handleViewDetails}
        onKeyDown={handleKeyDown}
        aria-label={t('aiAssistant.viewDetailsFor', { name: agent.name })}
      >
        {t('aiAssistant.viewDetails')}
      </button>
    </div>
  );
}
