import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TabNav.module.css';

function TabNav({ activeTab, setActiveTab, tabs = [] }) {
  const { t } = useTranslation();
  return (
    <div className={styles.tabNav}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? styles.active : ''}
          onClick={() => setActiveTab(tab.key)}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
}

export default TabNav;
