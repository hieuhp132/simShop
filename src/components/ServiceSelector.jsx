import React from "react";
import { useTranslation } from "react-i18next";

export default function ServiceSelector() {
  const { t } = useTranslation();
  return (
    <div className="service-selector">
      <label>{t("service_selector")}</label>
    </div>
  );
}
