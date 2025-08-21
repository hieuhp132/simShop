// Custom session warning dialog

class SessionDialog {
  constructor() {
    this.dialog = null;
    this.resolve = null;
    this.reject = null;
  }

  // Tạo dialog HTML
  createDialog(message) {
    const dialog = document.createElement('div');
    dialog.className = 'session-warning-dialog';
    dialog.innerHTML = `
      <div class="session-warning-overlay">
        <div class="session-warning-modal">
          <div class="session-warning-header">
            <h3>⚠️ Session Warning</h3>
          </div>
          <div class="session-warning-content">
            <p>${message}</p>
          </div>
          <div class="session-warning-actions">
            <button class="session-warning-btn session-warning-btn-continue">
              Tiếp tục
            </button>
            <button class="session-warning-btn session-warning-btn-logout">
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    `;

    // Thêm styles
    const style = document.createElement('style');
    style.textContent = `
      .session-warning-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .session-warning-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .session-warning-modal {
        background: white;
        border-radius: 8px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .session-warning-header h3 {
        margin: 0 0 16px 0;
        color: #d97706;
        font-size: 18px;
        font-weight: 600;
      }
      
      .session-warning-content p {
        margin: 0 0 20px 0;
        color: #374151;
        line-height: 1.5;
        font-size: 14px;
      }
      
      .session-warning-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      
      .session-warning-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .session-warning-btn-continue {
        background: #059669;
        color: white;
      }
      
      .session-warning-btn-continue:hover {
        background: #047857;
      }
      
      .session-warning-btn-logout {
        background: #dc2626;
        color: white;
      }
      
      .session-warning-btn-logout:hover {
        background: #b91c1c;
      }
    `;

    document.head.appendChild(style);
    return dialog;
  }

  // Hiển thị dialog
  show(message) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      
      this.dialog = this.createDialog(message);
      document.body.appendChild(this.dialog);
      
      // Setup event listeners
      const continueBtn = this.dialog.querySelector('.session-warning-btn-continue');
      const logoutBtn = this.dialog.querySelector('.session-warning-btn-logout');
      
      continueBtn.addEventListener('click', () => {
        this.hide();
        resolve(true);
      });
      
      logoutBtn.addEventListener('click', () => {
        this.hide();
        resolve(false);
      });
      
      // Auto-hide after 30 seconds
      setTimeout(() => {
        if (this.dialog && this.dialog.parentNode) {
          this.hide();
          resolve(false);
        }
      }, 30000);
    });
  }

  // Ẩn dialog
  hide() {
    if (this.dialog && this.dialog.parentNode) {
      this.dialog.parentNode.removeChild(this.dialog);
      this.dialog = null;
    }
  }
}

// Export singleton instance
export const sessionDialog = new SessionDialog();

// Helper function
export const showSessionWarning = (message) => {
  return sessionDialog.show(message);
}; 