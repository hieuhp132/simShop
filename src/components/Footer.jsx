import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.footerWrapper}>
      <p>{t('footer_text')}</p>
    </div>
  );
};

export default Footer;
