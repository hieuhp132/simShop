// Session Manager để quản lý session và auto-logout

import { showSessionWarning } from './sessionDialog.js';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 giờ
const WARNING_TIMEOUT = 5 * 60 * 1000; // 5 phút trước khi hết hạn

class SessionManager {
  constructor() {
    this.sessionTimer = null;
    this.warningTimer = null;
    this.lastActivity = Date.now();
    this.isActive = false;
  }

  // Bắt đầu session
  startSession() {
    this.isActive = true;
    this.lastActivity = Date.now();
    this.resetTimers();
    this.setupActivityListeners();
  }

  // Dừng session
  stopSession() {
    this.isActive = false;
    this.clearTimers();
    this.removeActivityListeners();
  }

  // Reset timers
  resetTimers() {
    this.clearTimers();
    
    // Timer cho session timeout
    this.sessionTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, SESSION_TIMEOUT);

    // Timer cho warning
    this.warningTimer = setTimeout(() => {
      this.showSessionWarning();
    }, SESSION_TIMEOUT - WARNING_TIMEOUT);
  }

  // Clear timers
  clearTimers() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  // Setup activity listeners
  setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, this.handleActivity.bind(this), true);
    });
  }

  // Remove activity listeners
  removeActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.removeEventListener(event, this.handleActivity.bind(this), true);
    });
  }

  // Handle user activity
  handleActivity() {
    if (this.isActive) {
      this.lastActivity = Date.now();
      this.resetTimers();
    }
  }

  // Show session warning
  async showSessionWarning() {
    const warningMessage = 'Phiên làm việc của bạn sẽ hết hạn trong 5 phút. Bạn có muốn tiếp tục?';
    
    try {
      const shouldContinue = await showSessionWarning(warningMessage);
      
      if (shouldContinue) {
        // User wants to continue - reset timers
        this.lastActivity = Date.now();
        this.resetTimers();
      } else {
        // User doesn't want to continue - logout
        this.handleSessionTimeout();
      }
    } catch (error) {
      console.error('Session warning error:', error);
      // Default to logout on error
      this.handleSessionTimeout();
    }
  }

  // Handle session timeout
  handleSessionTimeout() {
    console.log('⏰ Session timeout - logging out user');
    
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('justLoggedOut');
    }
    
    // Redirect to login page
    window.location.href = '/?session=expired';
  }

  // Get remaining session time
  getRemainingTime() {
    if (!this.isActive) return 0;
    
    const elapsed = Date.now() - this.lastActivity;
    const remaining = SESSION_TIMEOUT - elapsed;
    
    return Math.max(0, remaining);
  }

  // Check if session is about to expire
  isSessionExpiringSoon() {
    const remaining = this.getRemainingTime();
    return remaining > 0 && remaining <= WARNING_TIMEOUT;
  }

  // Extend session
  extendSession() {
    if (this.isActive) {
      this.lastActivity = Date.now();
      this.resetTimers();
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();

// Helper functions
export const startUserSession = () => {
  sessionManager.startSession();
};

export const stopUserSession = () => {
  sessionManager.stopSession();
};

export const extendUserSession = () => {
  return sessionManager.extendSession();
};

export const getSessionRemainingTime = () => {
  return sessionManager.getRemainingTime();
};

export const isSessionExpiringSoon = () => {
  return sessionManager.isSessionExpiringSoon();
}; 