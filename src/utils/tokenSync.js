// Token synchronization utility

import { secureStoreToken, secureGetToken, secureRemoveToken } from './tokenSecurity.js';

class TokenSync {
  constructor() {
    this.isSyncing = false;
  }

  // Đồng bộ token từ localStorage sang cookies
  syncToCookies(token) {
    try {
      if (!token) return false;
      
      // Vấn đề: Không thể set cross-domain cookies từ client
      // Thay vào đó, chỉ lưu trong localStorage và gửi qua Authorization header
      console.log('⚠️ Cross-domain cookies not supported, using Authorization header');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to sync token to cookies:', error);
      return false;
    }
  }

  // Đồng bộ token từ cookies sang localStorage
  syncFromCookies() {
    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('token=')
      );
      
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        if (token) {
          secureStoreToken(token);
          console.log('✅ Token synced from cookies');
          return token;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to sync token from cookies:', error);
      return null;
    }
  }

  // Lấy token từ cả hai nguồn
  getToken() {
    // Thử từ localStorage trước
    let token = secureGetToken();
    
    if (!token) {
      // Nếu không có, thử từ cookies
      token = this.syncFromCookies();
    }
    
    return token;
  }

  // Lưu token vào cả hai nguồn
  setToken(token) {
    if (!token) return false;
    
    try {
      // Lưu vào localStorage
      secureStoreToken(token);
      
      // Cập nhật Authorization header cho axios
      if (typeof window !== 'undefined' && window.apiClient) {
        window.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('✅ Token saved to localStorage and Authorization header');
      console.log('🔍 Token format check:');
      console.log('- Token length:', token.length);
      console.log('- Token parts:', token.split('.').length);
      return true;
    } catch (error) {
      console.error('❌ Failed to set token:', error);
      return false;
    }
  }

  // Xóa token từ cả hai nguồn
  removeToken() {
    try {
      // Xóa từ localStorage
      secureRemoveToken();
      
      // Xóa từ cookies
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      console.log('✅ Token removed from both localStorage and cookies');
      return true;
    } catch (error) {
      console.error('❌ Failed to remove token:', error);
      return false;
    }
  }

  // Kiểm tra token có tồn tại không
  hasToken() {
    const token = this.getToken();
    return !!token;
  }

  // Debug token status
  debugTokenStatus() {
    const localStorageToken = secureGetToken();
    const cookies = document.cookie;
    
    console.log('🔍 Token Debug:');
    console.log('- localStorage token:', localStorageToken ? 'exists' : 'missing');
    console.log('- cookies:', cookies);
    console.log('- combined token:', this.getToken() ? 'exists' : 'missing');
  }
}

// Export singleton instance
export const tokenSync = new TokenSync();

// Helper functions
export const syncTokenToCookies = (token) => {
  return tokenSync.syncToCookies(token);
};

export const syncTokenFromCookies = () => {
  return tokenSync.syncFromCookies();
};

export const getSyncedToken = () => {
  return tokenSync.getToken();
};

export const setSyncedToken = (token) => {
  return tokenSync.setToken(token);
};

export const removeSyncedToken = () => {
  return tokenSync.removeToken();
};

export const hasSyncedToken = () => {
  return tokenSync.hasToken();
};

export const debugTokenStatus = () => {
  return tokenSync.debugTokenStatus();
}; 