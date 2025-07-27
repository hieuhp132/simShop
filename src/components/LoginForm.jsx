import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../apiConfig';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Gọi đúng API backend
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }  // gửi cookie nếu backend trả cookie
      );

      if (response.data.success) {
        console.log('✅ Login successful, cookies should be set');
        
        // Reload trang sau khi đăng nhập thành công để hiển thị thông tin ngay lập tức
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setError("Đăng nhập thất bại!");
      }
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu!");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 250 }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Đăng nhập</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
