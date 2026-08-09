import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';
import type { SupportedLanguage } from '../../i18n/config';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector(): React.ReactElement {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language as SupportedLanguage;
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);

    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await fetch('/api/users/me/language', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ language: lang }),
        });
      } catch (error) {
        // Language still changes locally when the preference sync is unavailable.
        console.error('Failed to sync language preference:', error);
      }
    }
  };

  const languageLabel = (code: string, key: SupportedLanguage) => (
    <span className={styles.languageLabel}>
      <span className={styles.languageCode}>{code}</span>
      <span>{t(`languages.${key}`)}</span>
    </span>
  );

  const menuItems: MenuProps['items'] = [
    {
      key: 'en',
      icon: currentLanguage === 'en' ? <CheckOutlined /> : null,
      label: languageLabel('EN', 'en'),
    },
    {
      key: 'zh',
      icon: currentLanguage === 'zh' ? <CheckOutlined /> : null,
      label: languageLabel('CN', 'zh'),
    },
    {
      key: 'ms',
      icon: currentLanguage === 'ms' ? <CheckOutlined /> : null,
      label: languageLabel('MY', 'ms'),
    },
  ];

  return (
    <Dropdown
      menu={{
        items: menuItems,
        className: styles.languageMenu,
        selectedKeys: [currentLanguage],
        onClick: ({ key }) => void handleLanguageChange(key as SupportedLanguage),
      }}
      placement="bottomRight"
      trigger={['click']}
      onOpenChange={setIsOpen}
    >
      <button
        type="button"
        className={styles.languageButton}
        aria-label={`Select language (current: ${t(`languages.${currentLanguage}`)})`}
        aria-expanded={isOpen}
      >
        <GlobalOutlined className={styles.icon} />
      </button>
    </Dropdown>
  );
}
