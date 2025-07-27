import React, { useState, useEffect } from 'react';
import SideBar from './components/SideBar';
import MainContent from './components/MainContent';
import TopNav from './components/TopNav';
import TabNav from './components/TabNav';
import Footer from './components/Footer';
import './App.css';
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

function App() {
  const [activePage, setActivePage] = useState('nav_home');
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [priceTab, setPriceTab] = useState('price');

  // Xóa localStorage khi khởi động (vì giờ dùng cookies)
  useEffect(() => {
    localStorage.removeItem('authToken');
    console.log('🗑️ Cleaned localStorage on app start');
  }, []);

  // Kiểm tra trạng thái đăng nhập khi khởi động app
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/sim/user/profile`, {
          withCredentials: true
        });
        console.log('✅ User already logged in:', res.data);
        setUser(res.data);
      } catch (err) {
        console.log('❌ User not logged in or session expired');
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  // Hàm xử lý đăng nhập thành công
  const handleLoginSuccess = async () => {
    try {
      // Chỉ sử dụng cookies, không cần Authorization header
      const config = {
        withCredentials: true
      };
      
      const res = await axios.get(`${API_BASE_URL}/api/sim/user/profile`, config);
      console.log('✅ User profile loaded:', res.data);
      setUser(res.data);
      setActivePage('nav_home'); // về trang chủ sau khi login
    } catch (err) {
      console.error('❌ Failed to load user profile:', err);
      setUser(null);
      setActivePage('nav_home');
    }
  };

  const handleNavClick = (key) => {
    setActivePage(key);
  };

  const handleSelectNetwork = (networkInfo) => {
    if (networkInfo) {
      setActivePage('nav_payment');
    }
  };

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <div className="app-wrapper">
      <TopNav activePage={activePage} setActivePage={handleNavClick} theme={theme} setTheme={setTheme} user={user} setUser={setUser} onLoginSuccess={handleLoginSuccess} />
      <TabNav activePage={activePage} setActivePage={handleNavClick} />
      <div className="main-layout">
        <SideBar 
          onSelectNetwork={handleSelectNetwork} 
          setActivePage={setActivePage}
          setPriceTab={setPriceTab}
          priceTab={priceTab}
        />
        <MainContent
          activePage={activePage}
          setActivePage={setActivePage}
          onLoginSuccess={handleLoginSuccess}
          user={user}
          priceTab={priceTab}
          setPriceTab={setPriceTab}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
