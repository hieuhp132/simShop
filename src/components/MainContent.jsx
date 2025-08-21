import React, { useState, useMemo, useContext, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import styles from './MainContent.module.css';
import { useTranslation } from 'react-i18next';
import { countryDataMap } from '../assets/data/adjusted/countryDataIndex.js';
import { BalanceContext } from './TopNav';
import LoginForm from './LoginForm';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import PaymentPage from './PaymentPage';
import PurchasePage from './PurchasePage';
import Settings from './Settings';
import { API_BASE_URL } from '../apiConfig.js';

const MainContent = forwardRef(({ activePage, setActivePage, onLoginSuccess, user, priceTab, setPriceTab }, ref) => {
  const [priceSortBy, setPriceSortBy] = useState('rate');
  const [priceSortOrder, setPriceSortOrder] = useState('desc');
  const [filterService, setFilterService] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [statsSortBy, setStatsSortBy] = useState('rate');
  const [statsSortOrder, setStatsSortOrder] = useState('desc');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [faqDetail, setFaqDetail] = useState(null);
  const { t } = useTranslation();
  const { balance, currency } = useContext(BalanceContext);
  const RUB_TO_VND = 330;

  // Ref để truy cập PurchasePage
  const purchasePageRef = useRef();

  // Callback để refresh đơn hàng khi có đơn hàng mới được tạo
  const handleOrderCreated = (orderData) => {
    console.log('🔄 Order created, refreshing purchase page...', orderData);
    if (purchasePageRef.current) {
      purchasePageRef.current.refreshOrders();
    }
  };

  // Expose handleOrderCreated method to parent component
  useImperativeHandle(ref, () => ({
    handleOrderCreated
  }));

  // Mapping flag cho các quốc gia
  const countryFlagMap = {
    'vietnam': '🇻🇳', 'usa': '🇺🇸', 'russia': '🇷🇺', 'england': '🇬🇧', 'italy': '🇮🇹',
    'spain': '🇪🇸', 'france': '🇫🇷', 'germany': '🇩🇪', 'china': '🇨🇳', 'japan': '🇯🇵',
    'korea': '🇰🇷', 'india': '🇮🇳', 'brazil': '🇧🇷', 'canada': '🇨🇦', 'australia': '🇦🇺',
    'netherlands': '🇳🇱', 'poland': '🇵🇱', 'ukraine': '🇺🇦', 'belarus': '🇧🇾',
    'moldova': '🇲🇩', 'georgia': '🇬🇪', 'latvia': '🇱🇻', 'lithuania': '🇱🇹',
    'croatia': '🇭🇷', 'slovenia': '🇸🇮', 'slovakia': '🇸🇰', 'greece': '🇬🇷',
    'cyprus': '🇨🇾', 'portugal': '🇵🇹', 'ireland': '🇮🇪', 'finland': '🇫🇮',
    'sweden': '🇸🇪', 'norway': '🇳🇴', 'denmark': '🇩🇰', 'switzerland': '🇨🇭',
    'austria': '🇦🇹', 'belgium': '🇧🇪', 'malaysia': '🇲🇾', 'singapore': '🇸🇬',
    'thailand': '🇹🇭', 'philippines': '🇵🇭', 'indonesia': '🇮🇩', 'cambodia': '🇰🇭',
    'laos': '🇱🇦', 'myanmar': '🇲🇲', 'bangladesh': '🇧🇩', 'pakistan': '🇵🇰',
    'sri_lanka': '🇱🇰', 'nepal': '🇳🇵', 'afghanistan': '🇦🇫', 'iran': '🇮🇷',
    'iraq': '🇮🇶', 'syria': '🇸🇾', 'lebanon': '🇱🇧', 'jordan': '🇯🇴',
    'israel': '🇮🇱', 'saudi_arabia': '🇸🇦', 'yemen': '🇾🇪', 'oman': '🇴🇲',
    'uae': '🇦🇪', 'qatar': '🇶🇦', 'bahrain': '🇧🇭', 'kuwait': '🇰🇼',
    'egypt': '🇪🇬', 'libya': '🇱🇾', 'tunisia': '🇹🇳', 'algeria': '🇩🇿',
    'morocco': '🇲🇦', 'senegal': '🇸🇳', 'liberia': '🇱🇷', 'ghana': '🇬🇭',
    'togo': '🇹🇬', 'nigeria': '🇳🇬', 'ethiopia': '🇪🇹', 'kenya': '🇰🇪',
    'uganda': '🇺🇬', 'tanzania': '🇹🇿', 'malawi': '🇲🇼', 'angola': '🇦🇴',
    'argentina': '🇦🇷', 'chile': '🇨🇱', 'uruguay': '🇺🇾', 'paraguay': '🇵🇾',
    'bolivia': '🇧🇴', 'peru': '🇵🇪', 'ecuador': '🇪🇨', 'colombia': '🇨🇴',
    'venezuela': '🇻🇪', 'mexico': '🇲🇽', 'guatemala': '🇬🇹', 'honduras': '🇭🇳',
    'haiti': '🇭🇹', 'dominican_republic': '🇩🇴', 'cuba': '🇨🇺', 'jamaica': '🇯🇲'
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabOrders, setTabOrders] = useState('active');
  const [purchaseTab, setPurchaseTab] = useState('active');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
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
    setLoading(false);
  };

  // Khi app khởi động, flatten countryDataMap thành flatData (chỉ build lại khi countryDataMap thay đổi)
  const flatData = useMemo(() => {
    if (!countryDataMap || Object.keys(countryDataMap).length === 0) return [];
    
    const rows = [];
    Object.entries(countryDataMap).forEach(([countryKey, countryObj]) => {
      if (!countryObj[countryKey]) return;
      Object.entries(countryObj[countryKey]).forEach(([service, operators]) => {
        Object.entries(operators).forEach(([operator, info]) => {
          rows.push({
            service,
            country: countryKey.charAt(0).toUpperCase() + countryKey.slice(1),
            operator,
            price: info.cost,
            count: info.count,
            rate: info.rate ?? null,
            flag: countryFlagMap[countryKey] || '🏳️'
          });
        });
      });
    });

    return rows;
  }, [countryDataMap]);

  // Tối ưu hóa performance với useMemo
  const priceData = useMemo(() => flatData, [flatData]);
  const statsData = useMemo(() => flatData.filter(row => typeof row.rate === 'number' && typeof row.price === 'number'), [flatData]);

  // allKey luôn là 'all'
  const allKey = 'all';
  
  const serviceOptions = useMemo(() => [allKey, ...Array.from(new Set(priceData.map(row => row.service)))], [priceData]);
  const countryOptions = useMemo(() => [allKey, ...Array.from(new Set(priceData.map(row => row.country)))], [priceData]);

  const filteredPriceData = useMemo(() => priceData.filter(row =>
    (filterService === allKey || row.service === filterService) &&
    (filterCountry === allKey || row.country === filterCountry) &&
    (row.rate === null || row.rate !== 100)
  ), [priceData, filterService, filterCountry]);

  const sortedPriceData = useMemo(() => {
    const sorted = [...filteredPriceData].sort((a, b) => {
      if (priceSortBy === 'rate') {
        if (a.rate === null) return 1;
        if (b.rate === null) return -1;
        return priceSortOrder === 'desc' ? b.rate - a.rate : a.rate - b.rate;
      }
      if (priceSortBy === 'price') return priceSortOrder === 'desc' ? b.price - a.price : a.price - b.price;
      if (priceSortBy === 'country') return priceSortOrder === 'desc' ? b.country.localeCompare(a.country) : a.country.localeCompare(b.country);
      if (priceSortBy === 'service') return priceSortOrder === 'desc' ? b.service.localeCompare(a.service) : a.service.localeCompare(b.service);
      return 0;
    });

    return sorted;
  }, [filteredPriceData, priceSortBy, priceSortOrder]);

  const sortedStatsData = useMemo(() => {
    const sorted = [...statsData].sort((a, b) => {
      if (statsSortBy === 'rate') return statsSortOrder === 'desc' ? b.rate - a.rate : a.rate - b.rate;
      if (statsSortBy === 'price') return statsSortOrder === 'desc' ? b.price - a.price : a.price - b.price;
      if (statsSortBy === 'country') return statsSortOrder === 'desc' ? b.country.localeCompare(a.country) : a.country.localeCompare(b.country);
      return 0;
    });
    return sorted.slice(0, 20); // Tăng lên 20 rows để hiển thị nhiều hơn
  }, [statsData, statsSortBy, statsSortOrder]);
  // Lấy danh sách dịch vụ và quốc gia cho dropdown
  const countryNameMap = {
    'Việt Nam': t('country_vietnam'),
    'Hoa Kỳ': t('country_usa'),
    'Nga': t('country_russia'),
    'Nhật Bản': t('country_japan'),
    // ... bổ sung thêm nếu có ...
  };

  // Danh sách câu hỏi và nội dung chi tiết
  const faqDetails = {
    [t('faq_new_numbers')]: {
      title: t('faq_new_numbers'),
      content: <p>{t('faq_detail_new_numbers')}</p>,
    },
    [t('faq_account_locked')]: {
      title: t('faq_account_locked'),
      content: <p>{t('faq_detail_account_locked')}</p>,
    },
    [t('faq_cannot_buy')]: {
      title: t('faq_cannot_buy'),
      content: <p>{t('faq_detail_cannot_buy')}</p>,
    },
    [t('faq_temporary_number')]: {
      title: t('faq_temporary_number'),
      content: <p>{t('faq_detail_temporary_number')}</p>,
    },
    [t('faq_long_term_number')]: {
      title: t('faq_long_term_number'),
      content: <p>{t('faq_detail_long_term_number')}</p>,
    },
    [t('faq_low_rating_no_money_msg')]: {
      title: t('faq_low_rating_no_money_msg'),
      content: <p>{t('faq_detail_funds_not_credited')}</p>,
    },
    [t('faq_low_rating_msg')]: {
      title: t('faq_low_rating_msg'),
      content: <p>{t('faq_detail_account_locked')}</p>,
    },
    [t('faq_cannot_create_account')]: {
      title: t('faq_cannot_create_account'),
      content: <p>{t('faq_detail_cannot_create_account')}</p>,
    },
    [t('faq_cannot_login')]: {
      title: t('faq_cannot_login'),
      content: <p>{t('faq_detail_login_issue')}</p>,
    },
    'Cách đổi email tài khoản 5SIM?': {
      title: 'Cách đổi email tài khoản 5SIM?',
      content: (
        <>
          <p>Hiện tại không hỗ trợ đổi email tài khoản. Bạn chỉ có thể tạo tài khoản mới với email khác.</p>
        </>
      ),
    },
    [t('faq_account_hacked')]: {
      title: t('faq_account_hacked'),
      content: <p>{t('faq_detail_account_hacked')}</p>,
    },
    [t('faq_no_sms')]: {
      title: t('faq_no_sms'),
      content: <p>{t('faq_detail_no_sms')}</p>,
    },
    [t('faq_wrong_code')]: {
      title: t('faq_wrong_code'),
      content: <p>{t('faq_detail_wrong_code')}</p>,
    },
    [t('faq_number_used')]: {
      title: t('faq_number_used'),
      content: <p>{t('faq_detail_number_used')}</p>,
    },
    [t('faq_re_code')]: {
      title: t('faq_re_code'),
      content: <p>{t('faq_detail_re_code')}</p>,
    },
    [t('faq_call_verification')]: {
      title: t('faq_call_verification'),
      content: <p>{t('faq_detail_call_verification')}</p>,
    },
    [t('faq_voice_bot')]: {
      title: t('faq_voice_bot'),
      content: <p>{t('faq_detail_voice_bot')}</p>,
    },
    'Làm sao để nạp tiền vào tài khoản 5SIM?': {
      title: 'Làm sao để nạp tiền vào tài khoản 5SIM?',
      content: (
        <>
          <ol>
            <li>Đăng nhập tài khoản 5SIM.</li>
            <li>Nhấn vào số dư và chọn phương thức nạp tiền phù hợp.</li>
            <li>Nhập số tiền cần nạp và làm theo hướng dẫn để thanh toán.</li>
            <li>Bạn sẽ được chuyển sang trang thanh toán, điền thông tin và hoàn tất giao dịch.</li>
          </ol>
        </>
      ),
    },
    'Phí giao dịch': {
      title: 'Phí giao dịch',
      content: (
        <>
          <p>Khi nạp tiền, hệ thống sẽ hiển thị rõ phí giao dịch và tỷ giá chuyển đổi (nếu có) trước khi bạn xác nhận thanh toán.</p>
        </>
      ),
    },
    [t('faq_funds_not_credited')]: {
      title: t('faq_funds_not_credited'),
      content: <p>{t('faq_detail_funds_not_credited')}</p>,
    },
    [t('faq_withdraw')]: {
      title: t('faq_withdraw'),
      content: <p>{t('faq_detail_withdraw')}</p>,
    },
    [t('faq_transfer_funds')]: {
      title: t('faq_transfer_funds'),
      content: <p>{t('faq_detail_transfer_funds')}</p>,
    },
    [t('faq_get_api_key')]: {
      title: t('faq_get_api_key'),
      content: <p>{t('faq_detail_get_api_key')}</p>,
    },
    [t('faq_api_buy_number')]: {
      title: t('faq_api_buy_number'),
      content: <p>{t('faq_detail_api_buy_number')}</p>,
    },
    [t('faq_ip_blocked')]: {
      title: t('faq_ip_blocked'),
      content: <p>{t('faq_detail_ip_blocked')}</p>,
    },
    [t('faq_integrate_api')]: {
      title: t('faq_integrate_api'),
      content: <p>{t('faq_detail_integrate_api')}</p>,
    },
    [t('faq_sell_numbers')]: {
      title: t('faq_sell_numbers'),
      content: <p>{t('faq_detail_sell_numbers')}</p>,
    },
  };

  // Xử lý click vào câu hỏi FAQ
  const handleFaqClick = (question) => {
    setFaqDetail(question);
  };

  // Xử lý quay lại danh sách FAQ
  const handleFaqBack = () => {
    setFaqDetail(null);
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    const googleAuthUrl = `${API_BASE_URL}/api/auth/google`;
    window.location.href = googleAuthUrl;
  };

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20; // Giảm từ 50 xuống 20 để tăng performance
  const pagedPriceData = useMemo(() => {
    const paged = sortedPriceData.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

    return paged;
  }, [sortedPriceData, page]);
  const totalPages = Math.ceil(sortedPriceData.length / PAGE_SIZE);
  
  // Loading effect khi chuyển tab
  useEffect(() => {
    if (activePage === 'nav_price') {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [activePage, priceTab]);

  // Scroll to main content when activePage changes
  useEffect(() => {
    if (activePage && activePage !== 'nav_home') {
      setTimeout(() => {
        const mainContent = document.querySelector('[data-main-content]');
        if (mainContent) {
          mainContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  }, [activePage]);

  if (activePage === 'login') {
    return (
      <div className={styles.homepage} data-main-content>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <div className={styles.loginLogo}>
                
                <h1 className={styles.loginTitle}>{t('login_welcome_title')}</h1>
              </div>
              <p className={styles.loginSubtitle}>{t('login_access_service')}</p>
            </div>

            <div className={styles.loginForm}>
              <button 
                onClick={handleGoogleLogin}
                className={styles.googleLoginBtn}
                type="button"
              >
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google"
                  className={styles.googleIcon}
                />
                <span>{t('login_google_button')}</span>
              </button>
              
              <div className={styles.divider}>
                <div className={styles.dividerLine}></div>
                <span className={styles.dividerText}>{t('login_or')}</span>
                <div className={styles.dividerLine}></div>
              </div>

              <LoginForm onLoginSuccess={onLoginSuccess} onClose={() => setActivePage('nav_home')} />
              
              <div className={styles.loginFooter}>
                <p className={styles.registerText}>
                  {t('login_no_account')} 
                  <a href="#" className={styles.registerLink}> {t('login_register_now')}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activePage === 'nav_payment') {
    return (
      <div className={styles.homepage} data-main-content>
        <PaymentPage user={user} />
      </div>
    );
  }

  if (activePage === 'purchase') {
    return (
      <div className={styles.homepage} data-main-content>
        <PurchasePage ref={purchasePageRef} user={user} setActivePage={setActivePage} />
      </div>
    );
  }

  if (activePage === 'settings') {
    return (
      <div className={styles.homepage} data-main-content>
        <Settings user={user} />
      </div>
    );
  }

  const statsDisplayData = sortedStatsData.slice(0, 20);
  const statsMinPrice = statsDisplayData.length > 0 ? Math.min(...statsDisplayData.map(r => r.price)) : 0;
  const statsMaxPrice = statsDisplayData.length > 0 ? Math.max(...statsDisplayData.map(r => r.price)) : 1;

  return (
    <div className={styles.homepage} data-main-content>
      <div className={styles.card}>
        {/* Trang chủ */}
        {activePage === 'nav_home' && (
          <>
            {/* Giới thiệu dịch vụ */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>{t('main_home_title')}</h4>
              <p className={styles.descriptionText}>{t('main_home_desc')}</p>
            </div>
            {/* Lợi ích nổi bật */}
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📱</div>
                <div>
                  <div className={styles.infoTitle}>{t('main_benefit_phones_title')}</div>
                  <div className={styles.infoDesc}>{t('main_benefit_phones_desc')}</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🆕</div>
                <div>
                  <div className={styles.infoTitle}>{t('main_benefit_new_title')}</div>
                  <div className={styles.infoDesc}>{t('main_benefit_new_desc')}</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🔄</div>
                <div>
                  <div className={styles.infoTitle}>{t('main_benefit_sms_title')}</div>
                  <div className={styles.infoDesc}>{t('main_benefit_sms_desc')}</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>👨‍💻</div>
                <div>
                  <div className={styles.infoTitle}>{t('main_benefit_dev_title')}</div>
                  <div className={styles.infoDesc}>{t('main_benefit_dev_desc')}</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>💸</div>
                <div>
                  <div className={styles.infoTitle}>{t('main_benefit_fee_title')}</div>
                  <div className={styles.infoDesc}>{t('main_benefit_fee_desc')}</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>⏰</div>
                <div>
                  <div className={styles.infoTitle}>{t('main_benefit_support_title')}</div>
                  <div className={styles.infoDesc}>{t('main_benefit_support_desc')}</div>
                </div>
              </div>
            </div>
            {/* Ai nên dùng */}
            <div className={styles.section}>
              <h3 className={styles.sectionSubtitle}>{t('main_who_title')}</h3>
              <ul className={styles.benefitList}>
                <li>{t('main_who_privacy')}</li>
                <li>{t('main_who_mmo')}</li>
                <li>{t('main_who_dev')}</li>
                <li>{t('main_who_anyone')}</li>
              </ul>
            </div>
            {/* Hướng dẫn nhận SMS */}
            <div className={styles.section}>
              <h3 className={styles.sectionSubtitle}>{t('main_guide_title')}</h3>
              <div className={styles.guideGrid}>
                <div className={styles.guideStep}>
                  <div className={styles.guideNum}>1</div>
                  <div>
                    <div className={styles.guideTitle}>{t('main_guide_step1_title')}</div>
                    <div className={styles.guideDesc}>{t('main_guide_step1_desc')}</div>
                  </div>
                </div>
                <div className={styles.guideStep}>
                  <div className={styles.guideNum}>2</div>
                  <div>
                    <div className={styles.guideTitle}>{t('main_guide_step2_title')}</div>
                    <div className={styles.guideDesc}>{t('main_guide_step2_desc')}</div>
                  </div>
                </div>
                <div className={styles.guideStep}>
                  <div className={styles.guideNum}>3</div>
                  <div>
                    <div className={styles.guideTitle}>{t('main_guide_step3_title')}</div>
                    <div className={styles.guideDesc}>{t('main_guide_step3_desc')}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* FAQ */}
        {activePage === 'nav_faq' && (
          <>
            <h2 className={styles.sectionTitle}>{t('faq_title')}</h2>
            <div className={styles.faqSection}>
              {!faqDetail ? (
                <>
                  <div className={styles.faqGrid}>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_common_questions')}</span></div>
                            <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_new_numbers'))}>{t('faq_new_numbers')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_account_locked'))}>{t('faq_account_locked')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_cannot_buy'))}>{t('faq_cannot_buy')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_temporary_number'))}>{t('faq_temporary_number')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_long_term_number'))}>{t('faq_long_term_number')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_technical_questions')}</span></div>
                            <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_cannot_create_account'))}>{t('faq_cannot_create_account')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_cannot_login'))}>{t('faq_cannot_login')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_change_email'))}>{t('faq_change_email')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_account_hacked'))}>{t('faq_account_hacked')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_get_api_key'))}>{t('faq_get_api_key')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_sms_questions')}</span></div>
                            <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_no_sms'))}>{t('faq_no_sms')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_wrong_code'))}>{t('faq_wrong_code')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_number_used'))}>{t('faq_number_used')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_re_code'))}>{t('faq_re_code')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_call_verification'))}>{t('faq_call_verification')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_voice_bot'))}>{t('faq_voice_bot')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_payment_questions')}</span></div>
                            <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_top_up'))}>{t('faq_top_up')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_transaction_fee'))}>{t('faq_transaction_fee')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_funds_not_credited'))}>{t('faq_funds_not_credited')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_withdraw'))}>{t('faq_withdraw')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_transfer_funds'))}>{t('faq_transfer_funds')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_api_questions')}</span></div>
                            <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_api_buy_number'))}>{t('faq_api_buy_number')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_ip_blocked'))}>{t('faq_ip_blocked')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_integrate_api'))}>{t('faq_integrate_api')}</a>
      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail(t('faq_sell_numbers'))}>{t('faq_sell_numbers')}</a>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.faqDetailBox}>
                  <div className={styles.faqBreadcrumb}>
                    <span className={styles.faqBreadcrumbLink} onClick={() => setFaqDetail(null)}>{t('faq_back_to_faq')}</span>
                    <span className={styles.faqBreadcrumbSep}>/</span>
                    <span>{faqDetail}</span>
                  </div>
                  <h2 className={styles.faqDetailTitle}>{faqDetail}</h2>
                  <div className={styles.faqDetailContent}>{faqDetails[faqDetail]?.content}</div>
                  <button className={styles.faqBackBtn} onClick={() => setFaqDetail(null)}>{t('faq_back_to_faq')}</button>
                </div>
              )}
            </div>
          </>
        )}
        {/* Price */}
        {activePage === 'nav_price' && (
          <>
            <div className={styles.priceHeader}>
              <div className={styles.priceTabs}>
                <button className={priceTab === 'price' ? styles.priceTabActive : styles.priceTab} onClick={() => setPriceTab('price')}>{t('price_table_tab')}</button>
                <button className={priceTab === 'stats' ? styles.priceTabActive : styles.priceTab} onClick={() => setPriceTab('stats')}>{t('stats_tab')}</button>
              </div>
              <div className={styles.priceTitle}>{priceTab === 'price' ? t('price_table_title') : t('stats_title')}</div>
            </div>
            {priceTab === 'price' && (
              <>
                <div className={styles.priceFilters}>
                  <button className={styles.priceFilterBtn}>⭐ {t('price_favorite_services')}</button>
                  <button className={styles.priceFilterBtn}>⭐ {t('price_favorite_countries')}</button>
                  <select className={styles.priceSelect} value={filterService} onChange={e => setFilterService(e.target.value)}>
                    {serviceOptions.map(opt => <option key={opt} value={opt}>{opt === allKey ? t('all') : opt}</option>)}
                  </select>
                  <select className={styles.priceSelect} value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
                    {countryOptions.map(opt => <option key={opt} value={opt}>{opt === allKey ? t('all') : opt}</option>)}
                  </select>
                  <select className={styles.priceSelect}><option>{t('price_sort_by_price')}</option><option>{t('price_sort_low_to_high')}</option><option>{t('price_sort_high_to_low')}</option></select>
                  <select className={styles.priceSelect}><option>{t('price_time_period')}</option><option>{t('price_3_days')}</option><option>{t('price_7_days')}</option></select>
                  <button className={styles.priceFilterBtn}>{t('price_csv_export')}</button>
                </div>
                <div className={styles.priceNote}>{t('price_success_rate_note')}</div>
                <div className={styles.priceTableWrapper}>
                  <table className={styles.priceTable}>
                    <thead>
                      <tr>
                        <th className={`sortable ${priceSortBy==='service' ? 'sorted' : ''}`} onClick={() => {setPriceSortBy('service');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>{t('price_service')}</th>
                        <th className={`sortable ${priceSortBy==='country' ? 'sorted ' + (priceSortOrder==='desc' ? 'sorted-desc' : 'sorted-asc') : ''}`} onClick={() => {setPriceSortBy('country');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>{t('price_country')}</th>
                        <th>{t('price_operator')}</th>
                        <th className={`sortable ${priceSortBy==='rate' ? 'sorted ' + (priceSortOrder==='desc' ? 'sorted-desc' : 'sorted-asc') : ''}`} onClick={() => {setPriceSortBy('rate');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>{t('price_rate')}</th>
                        <th>{t('price_quantity')}</th>
                        <th className={`sortable ${priceSortBy==='price' ? 'sorted ' + (priceSortOrder==='desc' ? 'sorted-desc' : 'sorted-asc') : ''}`} onClick={() => {setPriceSortBy('price');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>{t('price_price')}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedPriceData.map((row, idx) => (
                        <tr key={row.service + row.country + row.operator}>
                          <td>{row.service}</td>
                          <td>{row.country}</td>
                          <td>{row.operator}</td>
                          <td>{row.rate !== null ? row.rate + '%' : 'n/a'}</td>
                          <td>{row.count ?? ''}</td>
                          <td>{currency === 'rub' ? row.price : Math.round(row.price * RUB_TO_VND)}{currency === 'rub' ? '₽' : '₫'}</td>
                          <td><button className={styles.buyBtn}>{t('price_buy_button')}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:12,margin:'16px 0'}}>
                  <button disabled={page === 1} onClick={() => setPage(page-1)}>&lt; Prev</button>
                  <span>Trang {page}/{totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(page+1)}>Next &gt;</button>
                </div>
              </>
            )}
            {priceTab === 'stats' && (
              <div className={styles.priceStatsBox}>
                <div className={styles.priceStatsTitle}>{t('stats_title')}</div>
                <div className={styles.statsChartHeaderGrid}>
                  <div className={styles.statsChartHeaderCol}>
                    <span className={styles.statsChartHeaderLabel}>{t('stats_success_rate')}</span>
                    <span className={styles.statsChartHeaderCell} onClick={() => {setStatsSortBy('rate');setStatsSortOrder(statsSortOrder==='desc'?'asc':'desc')}}>
                      ({t('stats_rate_percent')}) {statsSortBy==='rate' ? (statsSortOrder==='desc'?'▼':'▲') : ''}
                    </span>
                  </div>
                  <div className={styles.statsChartHeaderCol}>
                    <span className={styles.statsChartHeaderLabel}>{t('stats_number_price')}</span>
                    <span className={styles.statsChartHeaderCell} onClick={() => {setStatsSortBy('price');setStatsSortOrder(statsSortOrder==='desc'?'asc':'desc')}}>
                      ({t('stats_price_ruble')}) {statsSortBy==='price' ? (statsSortOrder==='desc'?'▼':'▲') : ''}
                    </span>
                  </div>
                </div>
                <div className={styles.statsChartList}>
                  {statsDisplayData.map((row, idx) => {
                    const pricePercent = ((row.price - statsMinPrice) / (statsMaxPrice - statsMinPrice + 1e-6)) * 100;
                    return (
                      <div className={styles.statsChartRow} key={idx}>
                        <div className={styles.statsChartInfo}>
                          <span className={styles.statsChartCountry}>{row.country}</span>
                          <span className={styles.statsChartOp}>{row.operator}</span>
                        </div>
                        <div className={styles.statsChartBars}>
                          <div className={styles.statsBarWrap}>
                            <div
                              className={styles.statsBarGreen}
                              style={{width: `${row.rate}%`}}
                              onMouseEnter={() => setHoveredBar(`rate${idx}`)}
                              onMouseLeave={() => setHoveredBar(null)}
                            ></div>
                            <span className={styles.statsBarValueRight}>{row.rate}%</span>
                            {hoveredBar === `rate${idx}` && (
                              <div className="statsTooltip">{t('stats_tooltip_rate')}: {row.rate}%</div>
                            )}
                          </div>
                          <div className={styles.statsBarWrap}>
                            <div
                              className={styles.statsBarBlue}
                              style={{width: `${pricePercent}%`}}
                              onMouseEnter={() => setHoveredBar(`price${idx}`)}
                              onMouseLeave={() => setHoveredBar(null)}
                            ></div>
                            <span className={styles.statsBarValueRight}>{currency === 'rub' ? row.price : Math.round(row.price * RUB_TO_VND)}{currency === 'rub' ? '₽' : '₫'}</span>
                            {hoveredBar === `price${idx}` && (
                              <div className="statsTooltip">{t('stats_tooltip_price')}: {currency === 'rub' ? row.price : Math.round(row.price * RUB_TO_VND)}{currency === 'rub' ? '₽' : '₫'}</div>
                            )}
                          </div>
                        </div>
                        <button className={styles.statsBuyBtn}>{t('price_buy_button')}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        {/* Blog */}
        {activePage === 'nav_blog' && (
          <>
            <h2 className={styles.sectionTitle}>{t('blog_title')}</h2>
            <div className={styles.blogWrap}>
              <div className={styles.blogMain}>
                {/* Danh sách bài viết mẫu */}
                {[{
                  title: t('blog_ebay_title'),
                  date: '27/04/2023',
                  read: '4 phút',
                  desc: t('blog_ebay_desc')
                },{
                  title: t('blog_kwai_title'),
                  date: '27/04/2023',
                  read: '4 phút',
                  desc: t('blog_kwai_desc')
                }].map((post, idx) => (
                  <div className={styles.blogCard} key={idx}>
                    <div className={styles.blogTitle}>{post.title}</div>
                    <div className={styles.blogMeta}>{post.date} · {post.read}</div>
                    <div className={styles.blogDesc}>{post.desc}</div>
                  </div>
                ))}
              </div>
              <div className={styles.blogSidebar}>
                <div className={styles.blogSidebarTitle}>{t('blog_new_posts')}</div>
                <ul className={styles.blogSidebarList}>
                  <li>{t('blog_ebay_post')}</li>
                  <li>{t('blog_kwai_post')}</li>
                </ul>
              </div>
            </div>
          </>
        )}
        {/* How to buy */}
        {activePage === 'nav_howto' && (
          <>
            <h2 className={styles.sectionTitle}>{t('howto_title')}</h2>
            <div className={styles.timeline}>
              {[1,2,3,4,5,6,7].map(step => (
                <div className={styles.timelineStep} key={step}>
                  <div className={styles.timelineIcon}>{step}</div>
                  <div className={styles.timelineContent}><b>{t(`howto_step${step}_title`)}</b><span className={styles.timelineNote}>{t(`howto_step${step}_note`)}</span></div>
                  <div className={styles.timelineLine}></div>
                </div>
              ))}
            </div>
            <div className={styles.infoBox}>
              <b>{t('howto_note_attention')}</b>
              <ul>
                <li>{t('howto_note_auto_refund')}</li>
                <li>{t('howto_note_do_not_use_for_forbidden')}</li>
                <li>{t('howto_note_support')}</li>
              </ul>
            </div>
          </>
        )}
        {/* Free */}
        {activePage === 'nav_free' && (
          <>
            <h2 className={styles.sectionTitle}>{t('free_title')}</h2>
            <p className={styles.descriptionText}>{t('free_desc')}</p>
            <div className={styles.freeBoxWrap}>
              <div className={styles.freeBox}>
                <h3>{t('free_choose_number')}</h3>
                <div className={styles.freeBoxEmpty}>{t('free_no_numbers_available')}</div>
              </div>
              <div className={styles.freeBox}>
                <h3>{t('free_messages')}</h3>
                <div className={styles.freeBoxEmpty}>{t('free_no_messages_received')}</div>
              </div>
            </div>
            <div className={styles.freeNote}>{t('free_after_trial')}</div>
          </>
        )}
        {/* API */}
        {activePage === 'nav_api' && (
          <>
            <h2 className={styles.sectionTitle}>{t('api_info_title')}</h2>
            <p className={styles.descriptionText}>{t('api_info_desc')}</p>
            <div className={styles.section}>
              <h3 className={styles.sectionSubtitle}>{t('howto_api_guide_title')}</h3>
              <div className={styles.apiBox}>
                <div><b>{t('api_5sim_is_restful')}</b></div>
                <div>{t('api_add_authorization_header')}</div>
                <div className={styles.apiCodeBlock}>
                  <div>{t('api_example_header')}</div>
                  <pre>Authorization: Bearer {'<API_KEY>'}</pre>
                </div>
                <div className={styles.apiCodeBlock}>
                  <div>{t('api_example_curl')}</div>
                  <pre>curl -H "Authorization: Bearer sk-abc123xyz456" https://5sim.net/v1/user/profile</pre>
                </div>
                <div className={styles.apiNote}>{t('api_see_docs')}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default MainContent;
