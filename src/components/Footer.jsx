import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

// Import social media icons
import facebookIcon from '../assets/icons/facebook.svg';
import instagramIcon from '../assets/icons/instagram.png';
import twitterIcon from '../assets/icons/icons8-twitter-50.png';
import vkontakteIcon from '../assets/icons/vkontakte.png';
import rutubeIcon from '../assets/icons/rutube.jpg';

// Import payment method icons
import visaIcon from '../assets/icons/visa.png';
import sepayIcon from '../assets/icons/sepay.png';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCard}>
            <h4>Need help?</h4>
            <button className={styles.supportBtn}>
              Support
            </button>
            
            <h4>Social networks</h4>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}>
                <img src={instagramIcon} alt="Instagram" />
              </a>
              
              <a href="#" className={styles.socialIcon}>
                <img src={facebookIcon} alt="Facebook" />
              </a>
             
            </div>
          </div>

          <div className={styles.footerCard}>
            <h4>SIM</h4>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>About the service</a>
              <a href="#" className={styles.footerLink}>Contacts</a>
              <a href="#" className={styles.footerLink}>Rules</a>
            </div>
          </div>

          <div className={styles.footerCard}>
            <h4>For users</h4>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Cookies</a>
              <a href="#" className={styles.footerLink}>Delivery policy</a>
              <a href="#" className={styles.footerLink}>Terms and conditions</a>
              <a href="#" className={styles.footerLink}>Privacy policy</a>
              <a href="#" className={styles.footerLink}>Refund policy</a>
              <a href="#" className={styles.footerLink}>Return policy</a>
              <a href="#" className={styles.footerLink}>Payment policy</a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerSeparator}></div>
        
        <div className={styles.footerBottom}>
          <div className={styles.paymentMethods}>
            <div className={styles.paymentIcon}>
              <img src={visaIcon} alt="VISA" />
            </div>
            <div className={styles.paymentIcon}>
              <img src={sepayIcon} alt="SEPAY" />
            </div>
            <div className={styles.paymentIcon}>
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bitcoin.svg" alt='Bitcoin' />
            </div>
          </div>
          <div className={styles.copyright}>
            <p>MEGASIM.NET © 2016-2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
