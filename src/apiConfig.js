// Cấu hình domain backend cho toàn bộ client
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // Nếu đang chạy trên GitHub Pages (production)
  if (window.location.hostname === 'hieuhp132.github.io') {
    // Ngrok URL thực từ người dùng
    return 'https://581958177605.ngrok-free.app';
  }

  // Development - sử dụng localhost
  return "http://localhost:3001";
};

export const API_BASE_URL = getApiBaseUrl(); 