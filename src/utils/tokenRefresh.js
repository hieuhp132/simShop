// Token refresh utility

import apiClient from '../apiConfig.js';
import { API_BASE_URL } from '../apiConfig.js';
import { secureStoreToken, secureGetToken, secureRemoveToken } from './tokenSecurity.js';
import { stopUserSession } from './sessionManager.js';
import { setSyncedToken, getSyncedToken, removeSyncedToken } from './tokenSync.js';

class TokenRefreshManager {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process failed requests queue
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Refresh token
  async refreshToken() {
    if (this.isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      console.log('🔄 Refreshing token...');
      
      const response = await apiClient.post(`${API_BASE_URL}/api/auth/refresh-token`);
      
      if (response.data.success) {
        console.log('✅ Token refreshed successfully');
        
        // Update stored token if using localStorage
        const token = response.data.token || response.data.user?.token;
        if (token) {
          setSyncedToken(token);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        this.processQueue(null, token);
        return token;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // Clear all auth data on refresh failure
      removeSyncedToken();
      stopUserSession();
      
      this.processQueue(error, null);
      
      // Redirect to login
      window.location.href = '/?session=expired';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Check if token needs refresh
  shouldRefreshToken(token) {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      
      // Refresh if token expires in less than 10 minutes
      return timeUntilExpiry < 600;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  // Get valid token (refresh if needed)
  async getValidToken() {
    const token = getSyncedToken();
    
    if (!token) {
      throw new Error('No token available');
    }
    
    if (this.shouldRefreshToken(token)) {
      return await this.refreshToken();
    }
    
    return token;
  }
}

// Export singleton instance
export const tokenRefreshManager = new TokenRefreshManager();

// Helper functions
export const refreshTokenIfNeeded = async () => {
  return await tokenRefreshManager.getValidToken();
};

export const shouldRefreshToken = (token) => {
  return tokenRefreshManager.shouldRefreshToken(token);
};

// Axios interceptor to handle token refresh
export const setupTokenRefreshInterceptor = () => {
  // Request interceptor
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await tokenRefreshManager.getValidToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get valid token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await tokenRefreshManager.refreshToken();
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed in interceptor:', refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}; 