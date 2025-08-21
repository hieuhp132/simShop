import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import styles from "./TopNav.module.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import apiClient from '../apiConfig.js';
import { FaWallet, FaHome, FaDollarSign, FaQuestionCircle, FaBookOpen, FaGift, FaBlog, FaCreditCard, FaClipboardList, FaCog, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import { FiSun, FiMoon, FiChevronDown } from "react-icons/fi";
import { API_BASE_URL } from '../apiConfig.js';
import { secureRemoveToken } from '../utils/tokenSecurity';
import { stopUserSession } from '../utils/sessionManager';
import { removeSyncedToken } from '../utils/tokenSync';

// Context quản lý số dư và tiền tệ
export const BalanceContext = createContext();

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState({ rub: 0, vnd: 0 });
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "vnd");

  const fetchBalance = async () => {
    try {
      const res = await apiClient.get('/api/sim/user/profile');
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
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const menuRef = useRef();
  const avatarRef = useRef();
  const languageRef = useRef();
  const { t, i18n } = useTranslation();
  const { balance, currency, switchCurrency, fetchBalance } = useContext(BalanceContext);

  // Fetch active orders count
  const fetchActiveOrdersCount = async () => {
    if (!user?._id) {
      setActiveOrdersCount(0);
      return;
    }
    
    try {
      const response = await apiClient.get(`/api/orders/${user._id}`);
      
      if (response.data?.success) {
        const activeOrders = response.data.orders?.filter(order => 
          order.status === 'active' || order.status === 'pending'
        ) || [];
        setActiveOrdersCount(activeOrders.length);
      } else {
        setActiveOrdersCount(0);
      }
    } catch (error) {
      console.error('Error fetching active orders count:', error);
      
      // If server is not available, use mock count
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('🔄 Server not available, using mock count');
        setActiveOrdersCount(2); // Mock count for demo
      } else {
        setActiveOrdersCount(0);
      }
    }
  };

  useEffect(() => {
    fetchActiveOrdersCount();
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (languageRef.current && !languageRef.current.contains(e.target)) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    // Set a flag to prevent auto-login after logout
    sessionStorage.setItem('justLoggedOut', 'true');
    
    // Stop session management
    stopUserSession();
    
    // Clear all authentication data first
    setUser(null);
    setProfileMenuOpen(false);
    
    // Clear secure localStorage and cookies
    removeSyncedToken();
    
    // Clear other localStorage items
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Try server logout, but don't fail if endpoint doesn't exist
    try {
      await apiClient.post('/api/auth/logout');
      console.log('✅ Server logout successful');
    } catch (error) {
      console.log('⚠️ Server logout failed (endpoint may not exist):', error.message);
      // Continue with client-side logout even if server fails
    }
    
    // Clear cookies with correct domain/path
    const currentDomain = window.location.hostname;
    const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
    
    const cookieNames = ['authToken', 'token', 'accessToken', 'refreshToken', 'session', 'connect.sid'];
    
    cookieNames.forEach(cookieName => {
      // Try different combinations for localhost
      if (isLocalhost) {
        // For localhost, try without domain first
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
      } else {
        // For production, use current domain
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${currentDomain};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${currentDomain};`;
      }
    });
    
    console.log('🗑️ All authentication data cleared');
    
    // Force page reload to ensure complete logout
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const handleNavClick = (key) => {
    setActivePage(key);
    setMenuOpen(false);
    
    // Scroll to main content after a short delay to ensure page change is complete
    setTimeout(() => {
      const mainContent = document.querySelector('[data-main-content]');
      if (mainContent) {
        mainContent.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageDropdownOpen(false);
  };

  const MenuItems = ({ isMobile }) =>
    navItems.map((item) => (
      <div
        key={item.key}
        className={activePage === item.key ? `${styles.menuDrawerItem} ${styles.active}` : styles.menuDrawerItem}
        onClick={() => handleNavClick(item.key)}
        title={item.title}
      >
        {item.icon}
        <span>{item.title}</span>
        {item.badge !== null && item.badge !== undefined && (
          <span style={{
            marginLeft: 'auto',
            background: item.badge > 0 ? '#ef4444' : '#6b7280',
            color: 'white',
            borderRadius: '50%',
            width: 20,
            height: 20,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {item.badge}
          </span>
        )}
      </div>
    ));

  const navItems = [
    { key: "nav_home", icon: <FaHome />, title: t("nav_home") },
    { key: "nav_price", icon: <FaDollarSign />, title: t("nav_price") },
    { key: "nav_faq", icon: <FaQuestionCircle />, title: t("nav_faq") },
    { key: "nav_howto", icon: <FaBookOpen />, title: t("nav_howto") },
    { key: "nav_free", icon: <FaGift />, title: t("nav_free") },
    { key: "nav_blog", icon: <FaBlog />, title: t("nav_blog") },
    { key: "nav_payment", icon: <FaCreditCard />, title: t("nav_payment") },
    // Only show purchase icon if user is logged in
    ...(user ? [{
      key: "purchase", 
      icon: <FaShoppingCart />, 
      title: t("nav_orders"),
      badge: activeOrdersCount
    }] : []),
  ];

  const languageOptions = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languageOptions.find(lang => lang.code === i18n.language) || languageOptions[0];

  return (
    <div className={styles.navbar}>
      <button className={styles.menuIcon} onClick={() => setMenuOpen(true)}>
        ☰
      </button>

      <div className={styles.navCenter}>
        {navItems.map((item) => (
          <span
            key={item.key}
            className={activePage === item.key ? `${styles.link} ${styles.active}` : styles.link}
            onClick={() => handleNavClick(item.key)}
            style={{ position: 'relative' }}
            title={item.title}
          >
            {item.icon}
            {item.badge !== null && item.badge !== undefined && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: item.badge > 0 ? '#ef4444' : '#6b7280',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {item.badge}
              </span>
            )}
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

      <div className={styles.rightSection}>
        <button className={styles.themeBtn} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <FiMoon /> : <FiSun />}
        </button>
        
        {/* Language Dropdown */}
        <div className={styles.languageBtn} ref={languageRef} onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}>
          <span style={{ fontSize: '1.2rem' }}>{currentLanguage.flag}</span>
          <FiChevronDown style={{ fontSize: '0.8rem', marginLeft: '2px' }} />
          
          <div className={`${styles.languageDropdown} ${languageDropdownOpen ? styles.show : ''}`}>
            {languageOptions.map((option) => (
              <div
                key={option.code}
                className={`${styles.languageOption} ${currentLanguage?.code === option.code ? styles.active : ''}`}
                onClick={() => handleLanguageChange(option.code)}
              >
                <span>{option.flag}</span>
                <span>{option.name}</span>
              </div>
            ))}
          </div>
        </div>

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
        {user ? (
          <div className={styles.avatarBox} ref={avatarRef}>
            <span className={styles.avatar} onClick={() => setProfileMenuOpen((v) => !v)}>
              {user.name?.[0]?.toUpperCase() || "U"}
            </span>
            {profileMenuOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <span className={styles.profileId}>ID: {user._id?.slice(-7) || 'N/A'}</span>
                </div>
                <div className={styles.profileMenu}>
                  <button 
                    className={styles.profileMenuItem}
                    onClick={() => {
                      setActivePage('settings');
                      setProfileMenuOpen(false);
                      // Scroll to main content after a short delay to ensure page change is complete
                      setTimeout(() => {
                        const mainContent = document.querySelector('[data-main-content]');
                        if (mainContent) {
                          mainContent.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                          });
                        }
                      }, 100);
                    }}
                  >
                    <FaCog style={{ marginRight: 8 }} />
                    Settings
                  </button>
                  {/* Only show Purchases menu if user is logged in */}
                  {user && (
                    <button 
                      className={styles.profileMenuItem}
                      onClick={() => {
                        setActivePage('purchase');
                        setProfileMenuOpen(false);
                        // Scroll to main content after a short delay to ensure page change is complete
                        setTimeout(() => {
                          const mainContent = document.querySelector('[data-main-content]');
                          if (mainContent) {
                            mainContent.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }
                        }, 100);
                      }}
                    >
                      <FaClipboardList style={{ marginRight: 8 }} />
                      Purchases
                    </button>
                  )}
                  <button 
                    className={`${styles.profileMenuItem} ${styles.logoutBtn}`}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt style={{ marginRight: 8 }} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authBox}>
            <button className={styles.loginBtn} onClick={() => {
              setActivePage('login');
              // Scroll to main content after a short delay to ensure page change is complete
              setTimeout(() => {
                const mainContent = document.querySelector('[data-main-content]');
                if (mainContent) {
                  mainContent.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }
              }, 100);
            }}>
              {t("login")}
            </button>
            <button className={styles.registerBtn} onClick={() => {
              setActivePage('login');
              // Scroll to main content after a short delay to ensure page change is complete
              setTimeout(() => {
                const mainContent = document.querySelector('[data-main-content]');
                if (mainContent) {
                  mainContent.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }
              }, 100);
            }}>{t("register")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNav;
