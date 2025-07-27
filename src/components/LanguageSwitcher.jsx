import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div style={{ margin: '8px' }}>
      <button onClick={() => i18n.changeLanguage('vi')}>VI</button>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
    </div>
  );
} 