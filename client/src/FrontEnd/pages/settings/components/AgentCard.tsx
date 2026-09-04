import React, { useState, useEffect } from 'react';
import type { AIAgent, AgentConfig } from '../../../types/agent';
import { getAgentConfig, saveAgentConfig } from '../../../../api/agentConfig';
import styles from './AgentCard.module.css';

interface AgentCardProps {
  agent: AIAgent;
  expanded: boolean;
  onToggleExpand: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, expanded, onToggleExpand }) => {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expanded && !config) {
      loadConfig();
    }
  }, [expanded]);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAgentConfig(agent.id);
      setConfig(data);
    } catch (err) {
      setError('Failed to load configuration');
      console.error('Error loading config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;

    setSaving(true);
    setError(null);
    try {
      await saveAgentConfig(agent.id, config);
    } catch (err) {
      setError('Failed to save configuration');
      console.error('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (field: string, value: any) => {
    if (!config) return;
    setConfig({
      ...config,
      [field]: value,
    });
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'customer-service': '#3b82f6',
      'sales': '#10b981',
      'technical': '#8b5cf6',
      'analytics': '#f59e0b',
      'general': '#6b7280',
    };
    return colors[category] || colors.general;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      active: '#10b981',
      inactive: '#6b7280',
      error: '#ef4444',
    };
    return colors[status] || colors.inactive;
  };

  const renderWorkflowPreview = () => {
    if (!agent.workflow || agent.workflow.length === 0) {
      return <span className={styles.noWorkflow}>No workflow configured</span>;
    }

    const preview = agent.workflow.slice(0, 3);
    const hasMore = agent.workflow.length > 3;

    return (
      <div className={styles.workflowPreview}>
        {preview.map((step, index) => (
          <React.Fragment key={index}>
            <span className={styles.workflowStep}>{step.label}</span>
            {index < preview.length - 1 && <span className={styles.workflowArrow}>→</span>}
          </React.Fragment>
        ))}
        {hasMore && <span className={styles.workflowMore}>+{agent.workflow.length - 3} more</span>}
      </div>
    );
  };

  const renderWorkflowVisualization = () => {
    if (!agent.workflow || agent.workflow.length === 0) {
      return <p className={styles.noWorkflow}>No workflow steps configured</p>;
    }

    return (
      <div className={styles.workflowVisualization}>
        {agent.workflow.map((step, index) => (
          <div key={index} className={styles.workflowStepFull}>
            <div className={styles.workflowStepNumber}>{index + 1}</div>
            <div className={styles.workflowStepContent}>
              <div className={styles.workflowStepName}>{step.label}</div>
              {step.description && (
                <div className={styles.workflowStepDescription}>{step.description}</div>
              )}
            </div>
            {index < agent.workflow.length - 1 && (
              <div className={styles.workflowConnector} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderConfigForm = () => {
    if (loading) {
      return <div className={styles.loadingMessage}>Loading configuration...</div>;
    }

    if (!config) {
      return <div className={styles.errorMessage}>No configuration available</div>;
    }

    return (
      <div className={styles.configForm}>
        <div className={styles.formGroup}>
          <label htmlFor={`enabled-${agent.id}`} className={styles.formLabel}>
            Enabled
          </label>
          <input
            id={`enabled-${agent.id}`}
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleConfigChange('enabled', e.target.checked)}
            className={styles.formCheckbox}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`priority-${agent.id}`} className={styles.formLabel}>
            Priority
          </label>
          <input
            id={`priority-${agent.id}`}
            type="number"
            min="0"
            max="100"
            value={config.priority}
            onChange={(e) => handleConfigChange('priority', parseInt(e.target.value, 10))}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`timeout-${agent.id}`} className={styles.formLabel}>
            Timeout (ms)
          </label>
          <input
            id={`timeout-${agent.id}`}
            type="number"
            min="1000"
            step="1000"
            value={config.timeout}
            onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value, 10))}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`maxRetries-${agent.id}`} className={styles.formLabel}>
            Max Retries
          </label>
          <input
            id={`maxRetries-${agent.id}`}
            type="number"
            min="0"
            max="10"
            value={config.maxRetries}
            onChange={(e) => handleConfigChange('maxRetries', parseInt(e.target.value, 10))}
            className={styles.formInput}
          />
        </div>

        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className={styles.saveButton}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  };

  return (
    <div
      className={`${styles.card} ${expanded ? styles.expanded : ''}`}
      style={{ '--category-color': getCategoryColor(agent.category) } as React.CSSProperties}
    >
      <div className={styles.compactView} onClick={!expanded ? onToggleExpand : undefined}>
        <div className={styles.cardHeader}>
          <div
            className={styles.agentIcon}
            style={{ backgroundColor: getCategoryColor(agent.category) }}
          >
            {agent.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.headerContent}>
            <h3 className={styles.agentName}>{agent.name}</h3>
            <p className={styles.agentDescription}>{agent.description}</p>
          </div>
        </div>

        <div className={styles.cardBody}>
          {renderWorkflowPreview()}
        </div>

        <div className={styles.cardFooter}>
          <div
            className={styles.statusIndicator}
            style={{ backgroundColor: getStatusColor(agent.status) }}
          >
            <span className={styles.statusDot} />
            <span className={styles.statusText}>{agent.status}</span>
          </div>
          <button
            onClick={onToggleExpand}
            className={styles.viewDetailsButton}
          >
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className={styles.expandedView}>
          <div className={styles.expandedSection}>
            <h4 className={styles.sectionTitle}>Description</h4>
            <p className={styles.fullDescription}>{agent.description}</p>
          </div>

          <div className={styles.expandedSection}>
            <h4 className={styles.sectionTitle}>Workflow</h4>
            {renderWorkflowVisualization()}
          </div>

          <div className={styles.expandedSection}>
            <h4 className={styles.sectionTitle}>Configuration</h4>
            {renderConfigForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
