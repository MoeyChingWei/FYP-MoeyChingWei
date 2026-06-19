import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps): React.ReactElement {
  const navigate = useNavigate();

  const handleClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, path?: string) => {
    if ((e.key === 'Enter' || e.key === ' ') && path) {
      e.preventDefault();
      handleClick(path);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
        aria-label="Go back"
      >
        ←
      </button>

      <div className={styles.trail}>
        {items.map((item, index) => (
          <React.Fragment key={item.path || item.label}>
            {index > 0 && <span className={styles.separator}>/</span>}
            {item.path ? (
              <span
                className={styles.link}
                onClick={() => handleClick(item.path)}
                onKeyDown={(e) => handleKeyDown(e, item.path)}
                role="button"
                tabIndex={0}
              >
                {item.label}
              </span>
            ) : (
              <span className={styles.current} aria-current="page">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
