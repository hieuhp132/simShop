import React from 'react';
import styles from './TabNav.module.css';

const tabItems = [
  { key: 'home', label: 'Chung' },
  { key: 'price', label: 'Giá' },
  { key: 'api', label: 'API' },
];

function TabNav({ activePage, setActivePage }) {
  return (
    <div className={styles.tabNav}>
      <div className={styles.tabList}>
        {tabItems.map(tab => (
          <div
            key={tab.key}
            className={activePage === tab.key ? styles.tabActive : styles.tab}
            onClick={() => setActivePage(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabNav;
