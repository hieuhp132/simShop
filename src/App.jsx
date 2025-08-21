import React, { useState, useEffect, useRef } from 'react';
import SideBar from './components/SideBar';
import MainContent from './components/MainContent';
import TopNav from './components/TopNav';
import TabNav from './components/TabNav';
import Footer from './components/Footer';
import './App.css';
import apiClient from './apiConfig';
import { API_BASE_URL } from './apiConfig';
import { secureStoreToken, secureGetToken, secureRemoveToken, validateToken, setupTokenCleanup } from './utils/tokenSecurity';
import { startUserSession, stopUserSession } from './utils/sessionManager';
import { setupTokenRefreshInterceptor } from './utils/tokenRefresh';
import { setSyncedToken, getSyncedToken, removeSyncedToken, debugTokenStatus } from './utils/tokenSync';

function App() {
  const [activePage, setActivePage] = useState('nav_home');
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [priceTab, setPriceTab] = useState('price');

  // Ref để truy cập MainContent
  const mainContentRef = useRef();

  // Xóa localStorage khi khởi động (vì giờ dùng cookies)
  useEffect(() => {
    removeSyncedToken();
    console.log('🗑️ Cleaned all tokens on app start');
    
    // Setup token refresh interceptor
    setupTokenRefreshInterceptor();
    setupTokenCleanup(); // Setup token cleanup khi tab đóng
  }, []);

  // Kiểm tra trạng thái đăng nhập khi khởi động app
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if user just logged out
      const justLoggedOut = sessionStorage.getItem('justLoggedOut');
      if (justLoggedOut === 'true') {
        console.log('🚫 User just logged out, skipping auth check');
        sessionStorage.removeItem('justLoggedOut');
        setUser(null);
        return;
      }

      // Check for Google OAuth success parameter
      const urlParams = new URLSearchParams(window.location.search);
      const googleAuth = urlParams.get('googleAuth');
      const token = urlParams.get('token');

      if (googleAuth === 'success' && token) {
        console.log('🎉 Google OAuth success detected, loading user profile...');
        // Clear the URL parameter
        //window.history.replaceState({}, document.title, window.location.pathname);
        
        // Sử dụng synced storage cho token
        if (validateToken(token)) {
          setSyncedToken(token);
          
          // Debug token status
          debugTokenStatus();
        } else {
          console.error('❌ Invalid token received from Google OAuth');
          setUser(null);
          return;
        }

        window.history.replaceState({}, document.title, window.location.pathname);
        
        await handleLoginSuccess();
        return;
      } else if (googleAuth === 'error') {
        console.log('❌ Google OAuth error detected');
        const reason = urlParams.get('reason');
        console.error('Google OAuth error reason:', reason);
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
        setUser(null);
        return;
      }

      try {
        const res = await apiClient.get(`${API_BASE_URL}/api/sim/user/profile`);
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
      console.log('🔄 Loading user profile after Google OAuth...');
      
      // Thêm delay để đảm bảo cookie được set
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Debug cookies trước
      try {
        const debugResponse = await apiClient.get(`${API_BASE_URL}/api/auth/debug-cookies`);
        console.log('🔍 Debug cookies:', debugResponse.data);
      } catch (debugErr) {
        console.log('⚠️ Debug cookies failed:', debugErr.message);
      }

      // Kiểm tra token
      try {
        const tokenCheck = await apiClient.get(`${API_BASE_URL}/api/auth/check-token`);
        console.log('✅ Token check result:', tokenCheck.data);
      } catch (tokenErr) {
        console.log('⚠️ Token check failed:', tokenErr.response?.data);
        
        // Nếu token không có trong cookies, thử từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        
        if (tokenFromUrl) {
          console.log('🔍 Found token in URL, syncing to cookies...');
          setSyncedToken(tokenFromUrl);
          
          // Thêm delay để đảm bảo token được sync
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Load user profile
      const res = await apiClient.get(`${API_BASE_URL}/api/sim/user/profile`);
      console.log('✅ User profile loaded:', res.data);
      setUser(res.data);
      setActivePage('nav_home');
      
      // Bắt đầu session management
      startUserSession();
      
    } catch (err) {
      console.error('❌ Failed to load user profile:', err);
      
      // Nếu token không có, redirect về login
      if (err.response?.status === 401) {
        console.log('🔐 Token missing, trying alternative approach...');
        // Thử approach khác - sử dụng localStorage
        await handleTokenAlternative();
      } else {
        setUser(null);
        setActivePage('nav_home');
      }
    }
  };

// Thêm function để handle token alternative
const handleTokenAlternative = async () => {
  try {
    // Thử gọi API với Authorization header
    const token = getSyncedToken();
    if (token && validateToken(token)) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await apiClient.get(`${API_BASE_URL}/api/sim/user/profile`, config);
      console.log('✅ User profile loaded with header token:', res.data);
      setUser(res.data);
      setActivePage('nav_home');
      
      // Bắt đầu session management
      startUserSession();
    } else {
      console.log('❌ No valid token found');
      debugTokenStatus(); // Debug token status
      removeSyncedToken(); // Xóa token không hợp lệ
      setUser(null);
      setActivePage('login');
    }
  } catch (error) {
    console.error('❌ Alternative approach failed:', error);
    removeSyncedToken(); // Xóa token nếu có lỗi
    setUser(null);
    setActivePage('login');
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

  // Callback để refresh đơn hàng khi có đơn hàng mới được tạo
  const handleOrderCreated = (orderData) => {
    console.log('🔄 Order created in App, delegating to MainContent...', orderData);
    if (mainContentRef.current && mainContentRef.current.handleOrderCreated) {
      mainContentRef.current.handleOrderCreated(orderData);
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
          user={user}
          onOrderCreated={handleOrderCreated}
        />
        <MainContent
          ref={mainContentRef}
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
