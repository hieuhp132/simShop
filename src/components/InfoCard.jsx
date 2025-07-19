import React from 'react';
import styles from './InfoCard.module.css';

function InfoCard({ title, desc }) {
  return (
    <div
      className={styles.card}
      tabIndex={0}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}

export default InfoCard;
