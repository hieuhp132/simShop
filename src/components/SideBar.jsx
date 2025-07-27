import React, { useState, useMemo, useEffect, useContext } from 'react';
import styles from './SideBar.module.css';
import { useTranslation } from 'react-i18next';
import { countryDataMap } from '../assets/data/adjusted/countryDataIndex';
import { BalanceContext } from './TopNav';

// Lấy danh sách tất cả quốc gia
const allCountries = Object.keys(countryDataMap).filter(
  (key) => key !== 'list'
);

// Lấy danh sách tất cả dịch vụ
function getAllServices() {
  const serviceSet = new Set();
  allCountries.forEach((country) => {
    const countryObj = countryDataMap[country]?.[country];
    if (countryObj) {
      Object.keys(countryObj).forEach((service) => serviceSet.add(service));
    }
  });
  return Array.from(serviceSet).sort();
}

function getServicesByCountry(country) {
  const countryObj = countryDataMap[country]?.[country];
  return countryObj ? Object.keys(countryObj) : [];
}

function getCountriesByService(service) {
  return allCountries.filter((country) => {
    const countryObj = countryDataMap[country]?.[country];
    return countryObj && countryObj[service];
  });
}

function getTotalCountForService(service, countryFilter) {
  let total = 0;
  const countries = countryFilter ? [countryFilter] : allCountries;
  countries.forEach((country) => {
    const countryObj = countryDataMap[country]?.[country];
    if (countryObj && countryObj[service]) {
      Object.values(countryObj[service]).forEach((net) => {
        if (net && typeof net.count === 'number') total += net.count;
      });
    }
  });
  return total;
}

function getTotalCountForCountry(country, serviceFilter) {
  let total = 0;
  const countryObj = countryDataMap[country]?.[country];
  if (!countryObj) return 0;
  const services = serviceFilter ? [serviceFilter] : Object.keys(countryObj);
  services.forEach((service) => {
    if (countryObj[service]) {
      Object.values(countryObj[service]).forEach((net) => {
        if (net && typeof net.count === 'number') total += net.count;
      });
    }
  });
  return total;
}

// Format số có dấu cách hàng nghìn
function formatNumber(num) {
  return num.toLocaleString('en-US').replace(/,/g, ' ');
}

// (Demo) Icon cho dịch vụ và quốc gia
const serviceIcons = {
  facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg',
  telegram: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg',
  whatsapp: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg',
  google: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg',
  microsoft: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg',
  amazon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
  instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg',
  tiktok: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg',
  uber: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/uber.svg',
  discord: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg',
  // ... thêm các dịch vụ khác nếu muốn
};
const countryIcons = {
  vietnam: 'https://flagcdn.com/24x18/vn.png',
  usa: 'https://flagcdn.com/24x18/us.png',
  russia: 'https://flagcdn.com/24x18/ru.png',
  england: 'https://flagcdn.com/24x18/gb.png',
  italy: 'https://flagcdn.com/24x18/it.png',
  spain: 'https://flagcdn.com/24x18/es.png',
  france: 'https://flagcdn.com/24x18/fr.png',
  germany: 'https://flagcdn.com/24x18/de.png',
  china: 'https://flagcdn.com/24x18/cn.png',
  japan: 'https://flagcdn.com/24x18/jp.png',
  korea: 'https://flagcdn.com/24x18/kr.png',
  india: 'https://flagcdn.com/24x18/in.png',
  brazil: 'https://flagcdn.com/24x18/br.png',
  canada: 'https://flagcdn.com/24x18/ca.png',
  australia: 'https://flagcdn.com/24x18/au.png',
  netherlands: 'https://flagcdn.com/24x18/nl.png',
  poland: 'https://flagcdn.com/24x18/pl.png',
  ukraine: 'https://flagcdn.com/24x18/ua.png',
  belarus: 'https://flagcdn.com/24x18/by.png',
  moldova: 'https://flagcdn.com/24x18/md.png',
  georgia: 'https://flagcdn.com/24x18/ge.png',
  latvia: 'https://flagcdn.com/24x18/lv.png',
  lithuania: 'https://flagcdn.com/24x18/lt.png',
  croatia: 'https://flagcdn.com/24x18/hr.png',
  slovenia: 'https://flagcdn.com/24x18/si.png',
  slovakia: 'https://flagcdn.com/24x18/sk.png',
  greece: 'https://flagcdn.com/24x18/gr.png',
  cyprus: 'https://flagcdn.com/24x18/cy.png',
  portugal: 'https://flagcdn.com/24x18/pt.png',
  ireland: 'https://flagcdn.com/24x18/ie.png',
  finland: 'https://flagcdn.com/24x18/fi.png',
  sweden: 'https://flagcdn.com/24x18/se.png',
  norway: 'https://flagcdn.com/24x18/no.png',
  denmark: 'https://flagcdn.com/24x18/dk.png',
  switzerland: 'https://flagcdn.com/24x18/ch.png',
  austria: 'https://flagcdn.com/24x18/at.png',
  belgium: 'https://flagcdn.com/24x18/be.png',
  malaysia: 'https://flagcdn.com/24x18/my.png',
  singapore: 'https://flagcdn.com/24x18/sg.png',
  thailand: 'https://flagcdn.com/24x18/th.png',
  philippines: 'https://flagcdn.com/24x18/ph.png',
  indonesia: 'https://flagcdn.com/24x18/id.png',
  cambodia: 'https://flagcdn.com/24x18/kh.png',
  laos: 'https://flagcdn.com/24x18/la.png',
  myanmar: 'https://flagcdn.com/24x18/mm.png',
  bangladesh: 'https://flagcdn.com/24x18/bd.png',
  pakistan: 'https://flagcdn.com/24x18/pk.png',
  sri_lanka: 'https://flagcdn.com/24x18/lk.png',
  nepal: 'https://flagcdn.com/24x18/np.png',
  afghanistan: 'https://flagcdn.com/24x18/af.png',
  iran: 'https://flagcdn.com/24x18/ir.png',
  iraq: 'https://flagcdn.com/24x18/iq.png',
  syria: 'https://flagcdn.com/24x18/sy.png',
  lebanon: 'https://flagcdn.com/24x18/lb.png',
  jordan: 'https://flagcdn.com/24x18/jo.png',
  israel: 'https://flagcdn.com/24x18/il.png',
  saudi_arabia: 'https://flagcdn.com/24x18/sa.png',
  yemen: 'https://flagcdn.com/24x18/ye.png',
  oman: 'https://flagcdn.com/24x18/om.png',
  uae: 'https://flagcdn.com/24x18/ae.png',
  qatar: 'https://flagcdn.com/24x18/qa.png',
  bahrain: 'https://flagcdn.com/24x18/bh.png',
  kuwait: 'https://flagcdn.com/24x18/kw.png',
  egypt: 'https://flagcdn.com/24x18/eg.png',
  libya: 'https://flagcdn.com/24x18/ly.png',
  tunisia: 'https://flagcdn.com/24x18/tn.png',
  algeria: 'https://flagcdn.com/24x18/dz.png',
  morocco: 'https://flagcdn.com/24x18/ma.png',
  senegal: 'https://flagcdn.com/24x18/sn.png',
  liberia: 'https://flagcdn.com/24x18/lr.png',
  ghana: 'https://flagcdn.com/24x18/gh.png',
  togo: 'https://flagcdn.com/24x18/tg.png',
  nigeria: 'https://flagcdn.com/24x18/ng.png',
  ethiopia: 'https://flagcdn.com/24x18/et.png',
  kenya: 'https://flagcdn.com/24x18/ke.png',
  uganda: 'https://flagcdn.com/24x18/ug.png',
  tanzania: 'https://flagcdn.com/24x18/tz.png',
  malawi: 'https://flagcdn.com/24x18/mw.png',
  angola: 'https://flagcdn.com/24x18/ao.png',
  argentina: 'https://flagcdn.com/24x18/ar.png',
  chile: 'https://flagcdn.com/24x18/cl.png',
  uruguay: 'https://flagcdn.com/24x18/uy.png',
  paraguay: 'https://flagcdn.com/24x18/py.png',
  bolivia: 'https://flagcdn.com/24x18/bo.png',
  peru: 'https://flagcdn.com/24x18/pe.png',
  ecuador: 'https://flagcdn.com/24x18/ec.png',
  colombia: 'https://flagcdn.com/24x18/co.png',
  venezuela: 'https://flagcdn.com/24x18/ve.png',
  mexico: 'https://flagcdn.com/24x18/mx.png',
  guatemala: 'https://flagcdn.com/24x18/gt.png',
  honduras: 'https://flagcdn.com/24x18/hn.png',
  haiti: 'https://flagcdn.com/24x18/ht.png',
  dominican_republic: 'https://flagcdn.com/24x18/do.png',
  cuba: 'https://flagcdn.com/24x18/cu.png',
  jamaica: 'https://flagcdn.com/24x18/jm.png',
  albania: 'https://flagcdn.com/24x18/al.png',
  hongkong: 'https://flagcdn.com/24x18/hk.png',
  mongolia: 'https://flagcdn.com/24x18/mn.png',
  northmacedonia: 'https://flagcdn.com/24x18/mk.png',
  salvador: 'https://flagcdn.com/24x18/sv.png',
  serbia: 'https://flagcdn.com/24x18/rs.png',
  tajikistan: 'https://flagcdn.com/24x18/tj.png',
  mauritius: 'https://flagcdn.com/24x18/mu.png',
  romania: 'https://flagcdn.com/24x18/ro.png',
  dominicana: 'https://flagcdn.com/24x18/do.png'
};
const defaultIcon = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'; // icon dấu hỏi tròn

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function SideBar({ onSelectNetwork, setActivePage, setPriceTab, priceTab }) {
  const { t } = useTranslation();
  const { currency } = useContext(BalanceContext);
  const RUB_TO_VND = 330;

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [sidebarPriceTab, setSidebarPriceTab] = useState('price');

  // Sync với main content khi priceTab thay đổi
  useEffect(() => {
    if (priceTab) {
      setSidebarPriceTab(priceTab);
    }
  }, [priceTab]);


  const debouncedServiceSearch = useDebounce(serviceSearch, 250);
  const debouncedCountrySearch = useDebounce(countrySearch, 250);

  // Memo hóa danh sách dịch vụ
  const filteredServiceOptions = useMemo(() => {
    let options = getAllServices();
    if (selectedCountry) options = getServicesByCountry(selectedCountry);
    options = options.filter(s => s.toLowerCase().includes(debouncedServiceSearch.toLowerCase()));
    return options.sort((a, b) => getTotalCountForService(b, selectedCountry) - getTotalCountForService(a, selectedCountry));
  }, [selectedCountry, debouncedServiceSearch]);

  // Memo hóa danh sách quốc gia
  const filteredCountryOptions = useMemo(() => {
    let options = allCountries;
    if (selectedService) options = getCountriesByService(selectedService);
    options = options.filter(c => c.toLowerCase().includes(debouncedCountrySearch.toLowerCase()));
    return options.sort((a, b) => getTotalCountForCountry(b, selectedService) - getTotalCountForCountry(a, selectedService));
  }, [selectedService, debouncedCountrySearch]);

  // Networks
  const networks =
    selectedCountry && selectedService
      ? Object.entries(
          countryDataMap[selectedCountry]?.[selectedCountry]?.[selectedService] || {}
        )
      : [];

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedNetwork(null);
    if (selectedService && !getServicesByCountry(country).includes(selectedService)) {
      setSelectedService('');
      onSelectNetwork(null);
    } else {
      onSelectNetwork(null);
    }
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setSelectedNetwork(null);
    if (selectedCountry && !getCountriesByService(service).includes(selectedCountry)) {
      setSelectedCountry('');
      onSelectNetwork(null);
    } else {
      onSelectNetwork(null);
    }
  };

  const handleNetworkClick = (network, info) => {
    if (!selectedCountry || !selectedService) return;
    setSelectedNetwork({ network, info });
    onSelectNetwork({
      country: selectedCountry,
      service: selectedService,
      network,
      cost: info.cost,
      count: info.count
    });
  };

  // Số lượng hiển thị mặc định
  const MAX_SERVICE = 7;
  const MAX_COUNTRY = 7;

  // Lấy giá thấp nhất cho dịch vụ (from 1₽)
  function getMinCostForService(service, countryFilter) {
    let min = null;
    const countries = countryFilter ? [countryFilter] : allCountries;
    countries.forEach((country) => {
      const countryObj = countryDataMap[country]?.[country];
      if (countryObj && countryObj[service]) {
        Object.values(countryObj[service]).forEach((net) => {
          if (typeof net.cost === 'number') {
            if (min === null || net.cost < min) min = net.cost;
          }
        });
      }
    });
    return min;
  }

  return (
    <div className={styles.sidebar}>
      {/* Header lớn với logo 5sim */}
      <div className={styles.sidebarHeader}>
        <img src="/assets/icons/5sim-logo.svg" alt="5sim" className={styles.sidebarLogo} />
        <div className={styles.sidebarTitle}>5sim Virtual Numbers<br/>for Receiving SMS Codes</div>
      </div>
      {/* Tabs nhỏ */}
      <div className={styles.sidebarTabs}>
        <button
          className={sidebarPriceTab === 'price' ? styles.sidebarTabActive : styles.sidebarTab}
          onClick={() => {
            setActivePage && setActivePage('nav_price');
            setPriceTab && setPriceTab('price');
            setSidebarPriceTab('price');
          }}
        >{t('price_table_tab')}</button>
        <button
          className={sidebarPriceTab === 'stats' ? styles.sidebarTabActive : styles.sidebarTab}
          onClick={() => {
            setActivePage && setActivePage('nav_price');
            setPriceTab && setPriceTab('stats');
            setSidebarPriceTab('stats');
          }}
        >{t('stats_tab')}</button>
      </div>

      {/* Service */}
      <div className={styles.selector}>
        <label className={styles.label}>{t('sidebar_select_service')}</label>
        <input
          className={styles.searchBox}
          placeholder={t('sidebar_select_service_placeholder')}
          value={serviceSearch}
          onChange={e => setServiceSearch(e.target.value)}
        />
        <div className={styles.list}>
          {(showAllServices ? filteredServiceOptions : filteredServiceOptions.slice(0, MAX_SERVICE)).map((service) => {
            const minCost = getMinCostForService(service, selectedCountry);
            const count = getTotalCountForService(service, selectedCountry);
            return (
              <button
                key={service}
                className={
                  styles.listItem +
                  (selectedService === service ? ' ' + styles.listItemActive : '')
                }
                onClick={() => handleServiceChange(service)}
              >
                <span className={styles.listItemMain}>
                  {/* Star icon */}
                  <span style={{color:'#bbb',marginRight:6,fontSize:18}}>&#9734;</span>
                  <img
                    src={serviceIcons[service] && typeof serviceIcons[service] === 'string' && serviceIcons[service].trim() !== '' ? serviceIcons[service] : defaultIcon}
                    alt="icon"
                    className={styles.listItemIcon}
                    onError={e => { e.target.onerror = null; e.target.src = defaultIcon; }}
                  />
                  <span className={styles.listItemName} style={{marginLeft: 0}}>{service}</span>
                </span>
                <span className={styles.listItemRight}>
                  {minCost !== null && (
                    <span className={styles.listItemSub}>
                      from {currency === 'rub' ? minCost : Math.round(minCost * RUB_TO_VND)}{currency === 'rub' ? '₽' : '₫'}
                    </span>
                  )}
                  <span className={styles.listItemCount}>{formatNumber(count)} <span style={{color:'#888',fontWeight:400,fontSize:'0.97em'}}>numbers</span></span>
                </span>
              </button>
            );
          })}
        </div>
        {filteredServiceOptions.length > MAX_SERVICE && (
          <button className={styles.showAllBtn} onClick={() => setShowAllServices(s => !s)}>
            {showAllServices ? (t('collapse_list') || 'Collapse list') : (t('show_all') || 'Show all')}
          </button>
        )}
      </div>

      {/* Country */}
      <div className={styles.selector}>
        <label className={styles.label}>{t('sidebar_select_country')}</label>
        <input
          className={styles.searchBox}
          placeholder={t('sidebar_select_country_placeholder')}
          value={countrySearch}
          onChange={e => setCountrySearch(e.target.value)}
        />
        <div className={styles.list}>
          {(showAllCountries ? filteredCountryOptions : filteredCountryOptions.slice(0, MAX_COUNTRY)).map((c) => {
            return (
              <button
                key={c}
                className={
                  styles.listItem +
                  (selectedCountry === c ? ' ' + styles.listItemActive : '')
                }
                onClick={() => handleCountryChange(c)}
              >
                <span className={styles.listItemMain}>
                  <span style={{color:'#bbb',marginRight:6,fontSize:18}}>&#9734;</span>
                  <img
                    src={countryIcons[c] || countryIcons[c.replace(/\s+/g, '_')] || defaultIcon}
                    alt="icon"
                    className={styles.listItemIcon}
                    onError={e => { e.target.onerror = null; e.target.src = defaultIcon; }}
                  />
                  <span className={styles.listItemName} style={{marginLeft: 0}}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
                </span>
              </button>
            );
          })}
        </div>
        {filteredCountryOptions.length > MAX_COUNTRY && (
          <button className={styles.showAllBtn} onClick={() => setShowAllCountries(s => !s)}>
            {showAllCountries ? (t('collapse_list') || 'Collapse list') : (t('show_all') || 'Show all')}
          </button>
        )}
      </div>

      {/* Networks */}
      <div className={styles.selector}>
        <label className={styles.label}>{t('sidebar_select_network')}</label>
        {(!selectedCountry || !selectedService) ? (
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: '1rem',
            color: '#888',
            textAlign: 'center',
            fontSize: '1rem',
            marginTop: 8
          }}>
            {t('sidebar_select_network_hint') || 'Vui lòng chọn dịch vụ và quốc gia trước'}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:10}}>
            {selectedCountry && selectedService && networks
              .sort((a, b) => a[1].cost - b[1].cost)
              .map(([network, info]) => (
                <div
                  key={network}
                  style={{
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    background:'#fff',
                    border:'1.5px solid #e5e7eb',
                    borderRadius:14,
                    boxShadow:'0 2px 8px #0001',
                    padding:'12px 18px',
                    cursor:'pointer',
                    transition:'box-shadow 0.18s, border 0.18s',
                    fontWeight:600,
                    fontSize:'1.08rem',
                    position:'relative',
                    ...(selectedNetwork?.network === network ? {border:'2px solid #2563eb',boxShadow:'0 4px 16px #2563eb22'} : {}),
                  }}
                  onClick={() => handleNetworkClick(network, info)}
                  onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px #2563eb22')}
                  onMouseOut={e => (e.currentTarget.style.boxShadow = selectedNetwork?.network === network ? '0 4px 16px #2563eb22' : '0 2px 8px #0001')}
                >
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {/* Có thể thêm icon mạng nếu muốn */}
                    <span style={{fontWeight:700}}>{network}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:12,minWidth:120,justifyContent:'flex-end'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'center',marginRight:6}}>
                      <span style={{color:'#2563eb',fontWeight:700,fontSize:'1.13rem',lineHeight:1.1}}>
                        {currency === 'rub' ? info.cost : Math.round(info.cost * RUB_TO_VND)}{currency === 'rub' ? '₽' : '₫'}
                      </span>
                      <span style={{color:'#22c55e',fontWeight:500,fontSize:'0.98rem',lineHeight:1}}>
                        {formatNumber(info.count)} <span style={{color:'#888',fontWeight:400,fontSize:'0.97em'}}>numbers</span>
                      </span>
                    </div>
                    <button
                      className="cartBuyBtn"
                      style={{
                        width:36,height:36,borderRadius:'50%',background:'#f4f7ff',border:'1.5px solid #2563eb33',display:'flex',alignItems:'center',justifyContent:'center',padding:0,marginLeft:0,transition:'background 0.18s, border 0.18s',cursor:'pointer',boxShadow:'0 1px 4px #2563eb11',outline:'none',
                      }}
                      onClick={e => { e.stopPropagation(); setActivePage && setActivePage('nav_payment'); }}
                      title="Buy"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#cartGradient)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id="cartGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                        <circle cx="10" cy="20" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                        <path d="M2 4h2l2.2 13.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.8L20 7H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
