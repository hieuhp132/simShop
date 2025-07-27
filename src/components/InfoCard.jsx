import React from 'react';
import styles from './InfoCard.module.css';
import { useTranslation } from 'react-i18next';

function InfoCard({ title, desc }) {
  const { t } = useTranslation();
  return (
    <div className={styles.card} tabIndex={0}>
      <h3 className={styles.title}>{t(title)}</h3>
      <p className={styles.desc}>{t(desc)}</p>
    </div>
  );
}

export default InfoCard;
