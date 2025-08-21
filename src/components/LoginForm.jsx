import React, { useState } from "react";
import apiClient from '../apiConfig.js';
import { API_BASE_URL } from '../apiConfig.js';
import styles from './LoginForm.module.css';
import { useTranslation } from 'react-i18next';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password }
      );
      if (response.data.success) {
        onLoginSuccess(response.data.user);
      } else {
        setError(t("login_failed"));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t("wrong_credentials"));
    }
  };


  return (
    <div className={styles['loginForm']}>
      <h2 className={styles['loginTitle']}>{t("login_title")}</h2>
      {error && <div className={styles['error']}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles['form']}>
        <div className={styles['formGroup']}>
          <label className={styles['formLabel']}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles['formInput']}
            placeholder={t("email_placeholder")}
          />
        </div>
        
        <div className={styles['formGroup']}>
          <label className={styles['formLabel']}>{t("password_label")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles['formInput']}
            placeholder={t("password_placeholder")}
          />
        </div>
        
        <button type="submit" className={styles['loginBtn']}>
          {t("login_button")}
        </button>
      </form>

    </div>
  );
}
