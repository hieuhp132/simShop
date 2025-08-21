// Utility để bảo mật token trong localStorage

// Tạo encryption key động từ browser fingerprint
const getEncryptionKey = () => {
  try {
    // Tạo key từ browser fingerprint
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown'
    ].join('|');
    
    // Hash fingerprint để tạo key
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Dùng key ổn định giữa các lần load thay vì thêm timestamp gây lệch key
    return 'k_' + hash.toString(36);
  } catch (error) {
    console.error('Failed to generate encryption key:', error);
    return 'fallback-key-' + Date.now();
  }
};

const ENCRYPTION_KEY = getEncryptionKey();

// Mã hóa token trước khi lưu vào localStorage
export const encryptToken = (token) => {
  try {
    // Tạo salt ngẫu nhiên
    const salt = Math.random().toString(36).substring(2, 15);
    
    // XOR encryption với key và salt
    let encrypted = '';
    for (let i = 0; i < token.length; i++) {
      const charCode = token.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      const saltChar = salt.charCodeAt(i % salt.length);
      const encryptedChar = charCode ^ keyChar ^ saltChar;
      encrypted += String.fromCharCode(encryptedChar);
    }
    
    // Encode thành base64 với salt
    const result = btoa(salt + ':' + encrypted);
    return result;
  } catch (error) {
    console.error('Token encryption failed:', error);
    return null;
  }
};

// Giải mã token từ localStorage
export const decryptToken = (encryptedToken) => {
  try {
    if (!encryptedToken) return null;
    
    // Decode từ base64
    const decoded = atob(encryptedToken);
    const parts = decoded.split(':');
    
    if (parts.length !== 2) {
      console.error('Invalid encrypted token format');
      return null;
    }
    
    const [salt, encrypted] = parts;
    
    // XOR decryption với key và salt
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      const saltChar = salt.charCodeAt(i % salt.length);
      const decryptedChar = charCode ^ keyChar ^ saltChar;
      decrypted += String.fromCharCode(decryptedChar);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Token decryption failed:', error);
    return null;
  }
};

// Lưu token an toàn vào localStorage
export const secureStoreToken = (token) => {
  try {
    // Mã hóa token trước khi lưu
    const encrypted = encryptToken(token);
    if (encrypted) {
      localStorage.setItem('authToken', encrypted);
      
      // Thêm session-based backup
      sessionStorage.setItem('authTokenBackup', encrypted);
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to store token:', error);
    return false;
  }
};

// Lấy token an toàn từ localStorage
export const secureGetToken = () => {
  try {
    // Thử từ localStorage trước
    let encrypted = localStorage.getItem('authToken');
    
    // Nếu không có, thử từ sessionStorage
    if (!encrypted) {
      encrypted = sessionStorage.getItem('authTokenBackup');
    }
    
    if (!encrypted) return null;
    
    // Hỗ trợ legacy/plaintext JWT từng được lưu trực tiếp
    if (typeof encrypted === 'string' && encrypted.split('.').length === 3) {
      const token = encrypted;
      console.log('🔍 Retrieved token format check:');
      console.log('- Token length:', token.length);
      console.log('- Token starts with:', token.substring(0, 20) + '...');
      console.log('- Token parts:', token.split('.').length);
      return token;
    }

    // Giải mã token (định dạng mới được mã hóa)
    const token = decryptToken(encrypted);
    
    // Debug token format
    if (token) {
      console.log('🔍 Retrieved token format check:');
      console.log('- Token length:', token.length);
      console.log('- Token starts with:', token.substring(0, 20) + '...');
      console.log('- Token parts:', token.split('.').length);
    }
    
    return token;
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

// Xóa token an toàn
export const secureRemoveToken = () => {
  try {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authTokenBackup');
    return true;
  } catch (error) {
    console.error('Failed to remove token:', error);
    return false;
  }
};

// Kiểm tra token có hợp lệ không
export const validateToken = (token) => {
  if (!token) return false;
  
  try {
    // Kiểm tra format JWT cơ bản
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload để kiểm tra expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Thêm function để clear token khi tab đóng
export const setupTokenCleanup = () => {
  // Clear token khi tab đóng
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('authTokenBackup');
  });
  
  // Clear token khi browser đóng
  window.addEventListener('unload', () => {
    sessionStorage.removeItem('authTokenBackup');
  });
}; 