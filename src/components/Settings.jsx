import React, { useState, useEffect } from 'react';
import { FaCopy, FaEye, FaEyeSlash, FaSave, FaTrash, FaUserTimes } from 'react-icons/fa';
import styles from './Settings.module.css';
import { countryDataMap } from '../assets/data/adjusted/countryDataIndex.js';
import { useTranslation } from 'react-i18next';


function Settings({ user }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [operator, setOperator] = useState('Any');
  const [operators, setOperators] = useState(['Any', 'virtual4', 'virtual47', 'virtual21', 'virtual7']);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [maxPrice, setMaxPrice] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const { t } = useTranslation();

  // Extract operators từ dữ liệu tất cả quốc gia và filter theo tỉ lệ thành công
  useEffect(() => {
    const extractOperators = () => {
      try {
        console.log('Country data map:', countryDataMap);
        
        if (!countryDataMap) {
          console.log('No country data found');
          setOperators(['Any', 'virtual4', 'virtual47', 'virtual21', 'virtual7']);
          return;
        }

        const operatorStats = new Map();
        let totalCountries = 0;
        let totalServices = 0;
        
        // Lặp qua tất cả quốc gia
        Object.entries(countryDataMap).forEach(([countryName, countryData]) => {
          console.log(`Processing country: ${countryName}`);
          totalCountries++;
          
          // Xử lý cấu trúc dữ liệu khác nhau của các quốc gia
          let servicesData;
          if (countryData[countryName]) {
            // Cấu trúc: { "vietnam": { services... } }
            servicesData = countryData[countryName];
          } else {
            // Cấu trúc: { services... } trực tiếp
            servicesData = countryData;
          }
          
          // Lặp qua tất cả services trong mỗi quốc gia
          Object.values(servicesData).forEach(service => {
            // Lặp qua tất cả virtual types trong mỗi service
            Object.keys(service).forEach(virtualType => {
              if (virtualType.startsWith('virtual')) {
                const virtualData = service[virtualType];
                totalServices++;
                
                // Tính tỉ lệ thành công trung bình
                let totalRate = 0;
                let rateCount = 0;
                
                // Cộng tất cả các rate có sẵn
                if (virtualData.rate !== undefined) {
                  totalRate += virtualData.rate;
                  rateCount++;
                }
                if (virtualData.rate24 !== undefined) {
                  totalRate += virtualData.rate24;
                  rateCount++;
                }
                if (virtualData.rate72 !== undefined) {
                  totalRate += virtualData.rate72;
                  rateCount++;
                }
                if (virtualData.rate168 !== undefined) {
                  totalRate += virtualData.rate168;
                  rateCount++;
                }
                if (virtualData.rate720 !== undefined) {
                  totalRate += virtualData.rate720;
                  rateCount++;
                }
                
                // Tính tỉ lệ trung bình
                const avgRate = rateCount > 0 ? totalRate / rateCount : 0;
                
                // Lưu thống kê cho operator này
                if (!operatorStats.has(virtualType)) {
                  operatorStats.set(virtualType, {
                    totalRate: 0,
                    totalCount: 0,
                    avgRate: 0,
                    countries: new Set()
                  });
                }
                
                const stats = operatorStats.get(virtualType);
                stats.totalRate += avgRate;
                stats.totalCount += 1;
                stats.avgRate = stats.totalRate / stats.totalCount;
                stats.countries.add(countryName);
              }
            });
          });
        });

        console.log(`Processed ${totalCountries} countries with ${totalServices} total services`);
        console.log(`Found ${operatorStats.size} unique operators`);

        // Convert to array và sort theo tỉ lệ thành công
        const sortedOperators = Array.from(operatorStats.entries())
          .sort((a, b) => b[1].avgRate - a[1].avgRate); // Sort theo tỉ lệ cao nhất
        
        console.log('Top 30 operators with success rates:');
        sortedOperators.slice(0, 30).forEach(([op, stats], index) => {
          console.log(`${index + 1}. ${op}: ${stats.avgRate.toFixed(2)}% (${stats.totalCount} services, ${stats.countries.size} countries)`);
        });
        
        const operatorList = sortedOperators
          .slice(0, 20) // Lấy top 20
          .map(([operator, stats]) => operator);
        
        // Thêm "Any" vào đầu danh sách
        operatorList.unshift('Any');
        
        console.log('Top 20 operators by success rate:', operatorList);
        setOperators(operatorList);
      } catch (error) {
        console.error('Error extracting operators:', error);
        // Fallback to default operators
        setOperators(['Any', 'virtual4', 'virtual47', 'virtual21', 'virtual7']);
      }
    };

    extractOperators();
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    // Có thể thêm toast notification ở đây
    console.log(`${type} copied to clipboard`);
  };

  const handleSave = () => {
    // Logic để lưu cài đặt
    console.log('Settings saved');
  };

  const handleClearBanned = () => {
    // Logic để xóa số bị cấm
    console.log('Banned numbers cleared');
  };

  const handleChangePassword = () => {
    if (newPassword !== repeatPassword) {
      alert(t('alert_new_passwords_not_match'));
      return;
    }
    if (newPassword.length < 6) {
      alert(t('alert_password_too_short'));
      return;
    }
    // Logic để đổi mật khẩu
    console.log('Password changed:', { oldPassword, newPassword });
    setOldPassword('');
    setNewPassword('');
    setRepeatPassword('');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Logic để xóa tài khoản
      console.log('Account deleted');
    }
  };

  const handleCreateMaxPrice = () => {
    if (!maxPrice || isNaN(maxPrice)) {
      alert('Please enter a valid price!');
      return;
    }
    console.log('Max price created:', maxPrice);
    setMaxPrice('');
  };

  const handleSavePriceLimit = () => {
    const price = parseFloat(maxPrice);
    if (isNaN(price) || price <= 0) {
      alert(t('alert_invalid_price'));
      return;
    }
    console.log('Max price created:', maxPrice);
    setMaxPrice('');
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h2>Settings</h2>
      </div>

      <div className={styles.settingsTabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'prices' ? styles.active : ''}`}
          onClick={() => setActiveTab('prices')}
        >
          Prices
        </button>
      </div>

      {activeTab === 'prices' ? (
        <div className={styles.settingsContent}>
          {showBanner && (
            <div className={styles.banner}>
              <span>Outline max price per any service to buy phone numbers at great value!</span>
              <div className={styles.bannerActions}>
                <button className={styles.adjustBtn}>Adjust</button>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowBanner(false)}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Max purchase price</h3>
            </div>
            <p className={styles.sectionDesc}>
              Avoid losing money in case an operator increases their prices. Create a price limitation for your purchases.
            </p>
            <div className={styles.formGroup}>
              <label>Max price:</label>
              <div className={styles.priceInput}>
                <input 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Enter max price"
                  className={styles.priceField}
                />
                <span className={styles.currency}>₫</span>
              </div>
            </div>
            <button className={styles.createBtn} onClick={handleCreateMaxPrice}>
              Create
            </button>
          </div>

          
        </div>
      ) : (
        <div className={styles.settingsContent}>
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label>User ID:</label>
              <div className={styles.inputWithCopy}>
                <input 
                  type="text" 
                  value={user?._id?.slice(-7) || 'N/A'} 
                  readOnly 
                  className={styles.readOnlyInput}
                />
                <button 
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(user?._id?.slice(-7) || 'N/A', 'User ID')}
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email:</label>
              <div className={styles.inputWithCopy}>
                <input 
                  type="email" 
                  value={user?.email || 'N/A'} 
                  readOnly 
                  className={styles.readOnlyInput}
                />
                <button 
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(user?.email || 'N/A', 'Email')}
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Operator by default:</label>
              <select 
                value={operator} 
                onChange={(e) => setOperator(e.target.value)}
                className={styles.select}
              >
                {operators.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

            <button className={styles.saveBtn} onClick={handleSave}>
              <FaSave style={{ marginRight: 8 }} />
              Save
            </button>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Banned numbers</h3>
              <button className={styles.clearBtn} onClick={handleClearBanned}>
                <FaTrash style={{ marginRight: 8 }} />
                Clear all
              </button>
            </div>
            <p className={styles.sectionDesc}>
              No banned numbers found.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Sound</h3>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Change password</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Old password:</label>
              <div className={styles.passwordInput}>
                <input 
                  type={showOldPassword ? "text" : "password"} 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                  className={styles.passwordField}
                />
                <button 
                  className={styles.eyeBtn}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>New password:</label>
              <div className={styles.passwordInput}>
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={styles.passwordField}
                />
                <button 
                  className={styles.eyeBtn}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Repeat password:</label>
              <div className={styles.passwordInput}>
                <input 
                  type={showRepeatPassword ? "text" : "password"} 
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={styles.passwordField}
                />
                <button 
                  className={styles.eyeBtn}
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                >
                  {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button className={styles.changePasswordBtn} onClick={handleChangePassword}>
              Change password
            </button>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Delete account</h3>
            </div>
            <p className={styles.sectionDesc}>
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <button className={styles.deleteAccountBtn} onClick={handleDeleteAccount}>
              <FaUserTimes style={{ marginRight: 8 }} />
              Delete account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings; 