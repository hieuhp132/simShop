// Axios interceptor để xử lý lỗi CORS và authentication
import axios from 'axios';
import { secureGetToken } from './utils/tokenSecurity.js';
import { setSyncedToken, removeSyncedToken } from './utils/tokenSync.js';

// Cấu hình domain backend cho toàn bộ client
const getApiBaseUrl = () => {
  // Nếu có environment variable, ưu tiên sử dụng
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // Nếu đang chạy trên GitHub Pages (production)
  if (window.location.hostname === 'hieuhp132.github.io') {
    // Render.com production URL
    return 'https://megasimbackend.onrender.com';
  }

  // Development - sử dụng localhost với port 3001 (khớp với server config)
  return "http://localhost:3001";
};

export const API_BASE_URL = getApiBaseUrl();

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// CSRF token management
let csrfToken = null;

// Get CSRF token
async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await apiClient.get('/api/secure/csrf');
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
}

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    console.log('🌐 Making request to:', config.url);
    
    // Add CSRF token for POST/PUT/DELETE requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
      const token = await getCsrfToken();
      if (token) {
        config.headers['x-csrf-token'] = token;
      }
    }
    
    // Tự động thêm Authorization header nếu có token (đã giải mã)
    try {
      const token = secureGetToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Authorization header added');
      }
    } catch (error) {
      console.log('⚠️ Failed to add Authorization header:', error.message);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status);
    return response;
  },
  async (error) => {
    if (error.response) {
      // Server trả về response với status code lỗi
      console.error('❌ Server error:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized - try to refresh token
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true;
        
        try {
          console.log('🔄 Attempting token refresh...');
          // Use unified refresh endpoint
          const refreshResponse = await apiClient.post('/api/auth/refresh-token');
          const newToken = refreshResponse.data.token || refreshResponse.data.accessToken || refreshResponse.data.user?.token;
          if (newToken) {
            // Store new access token via secure storage
            setSyncedToken(newToken);
            // Retry original request with fresh token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(error.config);
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          // Clear stored tokens and redirect to login
          removeSyncedToken();
          localStorage.removeItem('user');
          
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response (CORS, network error)
      console.error('❌ Network error:', error.message);
    } else {
      // Lỗi khác
      console.error('❌ Other error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Login with email/password
  async login(email, password, rememberMe = false) {
    const response = await apiClient.post('/api/secure/login', {
      email,
      password,
      rememberMe
    });
    
    if (response.data.accessToken) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // WebAuthn login
  async webauthnLogin(email, assertion, rememberMe = false) {
    const response = await apiClient.post('/api/secure/webauthn/login/verify', {
      email,
      assertion,
      rememberMe
    });
    
    if (response.data.accessToken) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await apiClient.post('/api/secure/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      csrfToken = null;
    }
  },

  // Get WebAuthn registration options
  async getWebAuthnRegOptions(email) {
    const response = await apiClient.get(`/api/secure/webauthn/register/options?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Register WebAuthn credential
  async registerWebAuthn(email, attestation) {
    const response = await apiClient.post('/api/secure/webauthn/register/verify', {
      email,
      attestation
    });
    return response.data;
  },

  // Get WebAuthn authentication options
  async getWebAuthnAuthOptions(email) {
    const response = await apiClient.get(`/api/secure/webauthn/login/options?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get access token
  getAccessToken() {
    return localStorage.getItem('authToken');
  }
};

// Export cho global access
if (typeof window !== 'undefined') {
  window.apiClient = apiClient;
  window.authAPI = authAPI;
}

export default apiClient; 