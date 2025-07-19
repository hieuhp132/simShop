import { useState, useEffect, useRef } from 'react';
import styles from './TopNav.module.css';

function TopNav({ activePage, setActivePage, theme, setTheme }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleLogin = () => {
    const mockUser = {
      name: 'Hieu Nguyen',
      email: 'hieu@example.com',
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const navItems = [
    { key: 'home', label: 'Trang chủ', icon: '🏠' },
    { key: 'faq', label: 'FAQ', icon: '❓' },
    { key: 'api', label: 'API', icon: '🔗' },
    { key: 'howto', label: 'Cách mua?', icon: '🛒' },
    { key: 'free', label: 'Miễn phí', icon: '🎁' },
    { key: 'blog', label: 'Blog', icon: '📰' },
  ];

  const handleNavClick = (key) => {
    setActivePage(key);
    setMenuOpen(false);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>📱 5SIM</div>

      {/* Hamburger icon for mobile */}
      <button className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">
        ☰
      </button>

      {/* Menu ngang cho desktop */}
      <div className={styles.navCenter}>
        {navItems.map(item => (
          <span
            key={item.key}
            className={activePage === item.key ? `${styles.link} ${styles.active}` : styles.link}
            onClick={() => handleNavClick(item.key)}
          >
            {item.label}
          </span>
        ))}
      </div>

      {/* Overlay menu cho mobile */}
      {menuOpen && (
        <div className={styles.menuOverlay}>
          <div className={styles.menuDrawer} ref={menuRef}>
            {navItems.map(item => (
              <div
                key={item.key}
                className={activePage === item.key ? `${styles.menuDrawerItem} ${styles.active}` : styles.menuDrawerItem}
                onClick={() => handleNavClick(item.key)}
              >
                <span className={styles.menuItemIcon}>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.navRight}>
        <button
          className={styles.themeBtn}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title={theme === 'light' ? 'Chuyển sang Dark mode' : 'Chuyển sang Light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <div className={styles.avatar}>{user.name[0]}</div>
            <span>{user.name}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <button className={styles.loginBtn} onClick={handleLogin}>
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
}

export default TopNav;
