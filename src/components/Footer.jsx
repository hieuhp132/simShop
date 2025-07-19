import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footerCard}>
        {/* Top: Footer content in row */}
        <div className={styles.footerInner}>
          {/* Column 1 */}
          <div className={styles.footerColumn}>
            <h4 className={styles.sectionTitle}>Cần hỗ trợ?</h4>
            <button className={styles.supportButton}>💬 Hỗ trợ</button>
            <h4 className={styles.sectionTitle} style={{ marginTop: 20 }}>Mạng xã hội</h4>
            <div className={styles.socialIcons}>
              <span>📘</span>
              <span>📷</span>
              <span>▶️</span>
              <span>🐦</span>
              <span>✉️</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className={styles.footerColumn}>
            <h4 className={styles.sectionTitle}>Liên kết hữu ích</h4>
            <a href="#" className={styles.link}>Dành cho lập trình viên</a>
            <a href="#" className={styles.link}>Về dịch vụ</a>
            <a href="#" className={styles.link}>Liên hệ</a>
            <a href="#" className={styles.link}>Quy định</a>
          </div>

          {/* Column 3 */}
          <div className={styles.footerColumn}>
            <h4 className={styles.sectionTitle}>Dành cho người dùng</h4>
            <a href="#" className={styles.link}>Cookies</a>
            <a href="#" className={styles.link}>Chính sách giao hàng</a>
            <a href="#" className={styles.link}>Điều khoản & điều kiện</a>
            <a href="#" className={styles.link}>Chính sách bảo mật</a>
            <a href="#" className={styles.link}>Chính sách hoàn tiền</a>
            <a href="#" className={styles.link}>Chính sách đổi trả</a>
            <a href="#" className={styles.link}>Chính sách thanh toán</a>
          </div>
        </div>

        {/* Bottom line */}
        <div className={styles.footerBottom}>
          <div className={styles.paymentIcons}>
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>🍏 Apple Pay</span>
          </div>
          <div>
            5SIM.NET © 2016–2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
