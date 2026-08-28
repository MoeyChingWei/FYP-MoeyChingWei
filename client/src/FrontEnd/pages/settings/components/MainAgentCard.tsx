import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MainAgent } from '../../../modules/aiAssistant/mainAgents';
import styles from './MainAgentCard.module.css';

interface MainAgentCardProps {
  agent: MainAgent;
}

export default function MainAgentCard({ agent }: MainAgentCardProps): React.ReactElement {
  const { t } = useTranslation('settings');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/ai-assistant/${agent.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={t('aiAssistant.viewAgents', { name: agent.name })}
      style={{ '--category-color': agent.color } as React.CSSProperties}
    >
      <div className={styles.icon}>{agent.icon}</div>
      <h3 className={styles.title}>{agent.name}</h3>
      <p className={styles.subtitle}>{agent.subtitle}</p>

      <div className={styles.badge}>
        {t('aiAssistant.subAgents', { count: agent.subAgentCount })}
      </div>

      <div className={styles.previewRow}>
        {agent.previewIcons.map((icon, index) => (
          <span key={index} className={styles.previewIcon}>{icon}</span>
        ))}
      </div>

      <div className={styles.cta}>
        Click to view details →
      </div>
    </div>
  );
}
