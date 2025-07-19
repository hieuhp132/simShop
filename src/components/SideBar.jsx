import React, { useEffect, useState } from 'react';
import { getCountriesList } from '../api';
import styles from './SideBar.module.css';

function SideBar() {
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountriesList();
        const countryArray = Object.entries(data);
        setCountries(countryArray);
      } catch (error) {
        console.error('Lỗi khi tải danh sách quốc gia:', error);
      }
    };

    if (isCountryDropdownOpen) {
      fetchCountries();
    }
  }, [isCountryDropdownOpen]);

  useEffect(() => {
    const fetchServices = () => {
      setServices(['Amazon', 'Facebook', 'Google', 'Instagram', 'Twitter']);
    };

    if (isServiceDropdownOpen) {
      fetchServices();
    }
  }, [isServiceDropdownOpen]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setIsCountryDropdownOpen(false);
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    setIsServiceDropdownOpen(false);
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Dịch vụ SMS</h2>

      <div className={styles.selector}>
        <label className={styles.label}>1. Chọn dịch vụ</label>
        <select
          className={styles.input}
          value={selectedService}
          onChange={handleServiceChange}
          onClick={() => setIsServiceDropdownOpen(true)}
        >
          <option value={selectedService} disabled>
            {selectedService || 'Chọn dịch vụ'}
          </option>
          {isServiceDropdownOpen &&
            services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.selector}>
        <label className={styles.label}>2. Chọn quốc gia</label>
        <select
          className={styles.input}
          value={selectedCountry}
          onChange={handleCountryChange}
          onClick={() => setIsCountryDropdownOpen(true)}
        >
          <option value={selectedCountry} disabled>
            {selectedCountry || 'Chọn quốc gia'}
          </option>
          {isCountryDropdownOpen &&
            countries.map(([code, info]) => (
              <option key={code} value={info.text_en}>
                {info.text_en}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.selector}>
        <label className={styles.label}>3. Chọn nhà mạng</label>
        <button
          className={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#bae6fd')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e0f2fe')}
        >
          Virtual4 - 10₽
        </button>
        <button
          className={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#bae6fd')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e0f2fe')}
        >
          Virtual47 - 5₽
        </button>
      </div>
    </div>
  );
}

export default SideBar;
