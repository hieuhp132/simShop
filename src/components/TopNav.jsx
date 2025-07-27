import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import styles from "./TopNav.module.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import axios from "axios";
import { FaWallet } from "react-icons/fa6";
import { API_BASE_URL } from '../apiConfig';

// Context quản lý số dư và tiền tệ
export const BalanceContext = createContext();

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState({ rub: 0, vnd: 0 });
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "vnd");

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sim/user/profile`, { withCredentials: true });
      const getCredit = (data) =>
        data?.credit ?? data?.data?.credit ?? data?.user?.credit ?? 0;

      const creditVND = parseFloat(getCredit(res.data));
      setBalance({
        vnd: creditVND,
        rub: creditVND / 330,
      });
    } catch (err) {
      console.error("❌ Fetch balance failed:", err);
      setBalance({ rub: 0, vnd: 0 });
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const switchCurrency = (cur) => {
    setCurrency(cur);
    localStorage.setItem("currency", cur);
  };

  return (
    <BalanceContext.Provider value={{ balance, currency, switchCurrency, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

// Format hiển thị tiền tệ
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat(currency === "rub" ? "ru-RU" : "vi-VN", {
    style: "currency",
    currency: currency === "rub" ? "RUB" : "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

function TopNav({ activePage, setActivePage, theme, setTheme, user, setUser, onLoginSuccess }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef();
  const avatarRef = useRef();
  const { t } = useTranslation();
  const { balance, currency, switchCurrency, fetchBalance } = useContext(BalanceContext);

  // XÓA fetchProfile, useEffect fetchProfile

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    try {
      console.log('🔄 Logging out...');
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('❌ Logout failed:', err);
    }
    
    // Xóa token khỏi localStorage
    localStorage.removeItem('authToken');
    console.log('🗑️ Token removed from localStorage');
    
    setUser(null);
    fetchBalance();
  };

  const handleLoginSuccess = () => {
    // Không cần fetch balance vì sẽ reload trang
    if (onLoginSuccess) onLoginSuccess();
  };

  const navItems = [
    { key: "nav_home", label: t("nav_home") },
    { key: "nav_price", label: t("nav_price") },
    { key: "nav_faq", label: "FAQ" },
    { key: "nav_howto", label: t("nav_howto") },
    { key: "nav_free", label: t("nav_free") },
    { key: "nav_blog", label: t("nav_blog") },
    { key: "nav_payment", label: t("nav_payment") },
  ];

  const handleNavClick = (key) => {
    setActivePage(key);
    setMenuOpen(false);
  };

  const MenuItems = ({ isMobile }) =>
    navItems.map((item) => (
      <div
        key={item.key}
        className={isMobile ? (activePage === item.key ? `${styles.menuDrawerItem} ${styles.active}` : styles.menuDrawerItem) : ""}
        onClick={() => handleNavClick(item.key)}
      >
        {item.label}
      </div>
    ));

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>SIM</div>

      <button className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">
        ☰
      </button>

      <div className={styles.navCenter}>
        {navItems.map((item) => (
          <span
            key={item.key}
            className={activePage === item.key ? `${styles.link} ${styles.active}` : styles.link}
            onClick={() => handleNavClick(item.key)}
          >
            {item.label}
          </span>
        ))}
      </div>

      {menuOpen && (
        <div className={styles.menuOverlay}>
          <div className={styles.menuDrawer} ref={menuRef}>
            <MenuItems isMobile />
          </div>
        </div>
      )}

      <div style={{ flex: 1 }}></div>

      <div className={styles.rightSection}>
        {user && (
          <div className={styles.balanceBox}>
            <FaWallet style={{ marginRight: 6, color: "#2563eb", fontSize: 20 }} />
            <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>
              {formatCurrency(currency === "rub" ? balance.rub : balance.vnd, currency)}
            </span>
            <button onClick={() => switchCurrency(currency === "rub" ? "vnd" : "rub")} className={styles.balanceSwitchBtn}>
              {currency === "rub" ? "VND" : "RUB"}
            </button>
          </div>
        )}
        <button className={styles.themeBtn} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <LanguageSwitcher />
        {user ? (
          <div className={styles.avatarBox} ref={avatarRef}>
            <span className={styles.avatar} onClick={() => setProfileMenuOpen((v) => !v)}>
              {user.name?.[0]?.toUpperCase() || "U"}
            </span>
            {profileMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  boxShadow: "0 2px 12px #0001",
                  padding: "10px 18px",
                  zIndex: 100,
                }}
              >
                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                  style={{ color: "#d32f2f", fontWeight: 600, fontSize: "1rem", background: "none", border: "none", cursor: "pointer" }}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authBox}>
            <button className={styles.loginBtn} onClick={() => setActivePage('login')}>
              {t("login") || "Đăng nhập"}
            </button>
            <button className={styles.registerBtn}>{t("register") || "Đăng ký"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNav;
