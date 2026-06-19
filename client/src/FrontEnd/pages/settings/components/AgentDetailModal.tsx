import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { AIAgent } from '../../../modules/aiAssistant/types';
import styles from './AgentDetailModal.module.css';

interface AgentDetailModalProps {
  agent: AIAgent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentDetailModal({
  agent,
  isOpen,
  onClose,
}: AgentDetailModalProps): React.ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Reset isClosing when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Handle close with exit animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Focus trap and focus management
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    modalRef.current.focus();

    // Focus trap
    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    // Restore focus on cleanup
    return () => {
      document.removeEventListener('keydown', handleTab);
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Don't render if not open or no agent
  if (!isOpen || !agent) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const modalContent = (
    <div
      className={`${styles.backdrop} ${isClosing ? styles.exiting : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${isClosing ? styles.exiting : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.iconLarge}>{agent.icon}</div>
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <h2 id="modal-title" className={styles.title}>
            {agent.name}
          </h2>
          <p className={styles.subtitle}>{agent.description}</p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Full Description */}
          {agent.description && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>About</h3>
              <div className={styles.description}>
                <p className={styles.descriptionText}>{agent.description}</p>
              </div>
            </section>
          )}

          {/* Workflow Visualization */}
          {agent.workflow && agent.workflow.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Workflow</h3>
              <div className={styles.workflow}>
                {agent.workflow.map((step, index) => (
                  <div key={index} className={styles.workflowStep}>
                    <div className={styles.stepIcon}>{step.icon}</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepLabel}>{step.label}</div>
                      {step.sublabel && (
                        <div className={styles.stepSublabel}>{step.sublabel}</div>
                      )}
                      <div className={styles.stepDescription}>{step.description}</div>
                    </div>
                    {index < agent.workflow.length - 1 && (
                      <div className={styles.stepArrow}>→</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={handleClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );

  // Render via portal
  return ReactDOM.createPortal(modalContent, document.body);
}
