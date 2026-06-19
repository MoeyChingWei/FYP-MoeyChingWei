import React from 'react';
import { WorkflowStep } from '../../../modules/aiAssistant/types';
import styles from './AgentWorkflow.module.css';

interface AgentWorkflowProps {
  workflow: WorkflowStep[];
  compact?: boolean;
}

/**
 * AgentWorkflow Component
 *
 * Displays workflow steps in two modes:
 * - Compact: horizontal layout with small icons and arrows (for card preview)
 * - Full: large icons with labels, sublabels, and step descriptions list
 */
export default function AgentWorkflow({ workflow, compact = false }: AgentWorkflowProps): React.ReactElement {
  if (compact) {
    return (
      <div className={styles.compactWorkflow}>
        {workflow.map((step, index) => (
          <React.Fragment key={index}>
            <div className={styles.compactStep}>
              <span className={styles.compactIcon} role="img" aria-label={step.label}>
                {step.icon}
              </span>
            </div>
            {index < workflow.length - 1 && (
              <span className={styles.compactArrow} aria-hidden="true">
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.fullWorkflow}>
      <div className={styles.workflowSteps}>
        {workflow.map((step, index) => (
          <React.Fragment key={index}>
            <div className={styles.fullStep}>
              <span className={styles.fullIcon} role="img" aria-label={step.label}>
                {step.icon}
              </span>
              <div className={styles.stepText}>
                <div className={styles.stepLabel}>{step.label}</div>
                {step.sublabel && (
                  <div className={styles.stepSublabel}>{step.sublabel}</div>
                )}
              </div>
            </div>
            {index < workflow.length - 1 && (
              <span className={styles.fullArrow} aria-hidden="true">
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <ol className={styles.stepDescriptions}>
        {workflow.map((step, index) => (
          <li key={index} className={styles.descriptionItem}>
            <strong>{step.label}:</strong> {step.description}
          </li>
        ))}
      </ol>
    </div>
  );
}
