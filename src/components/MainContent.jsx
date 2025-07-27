import React, { useState, useMemo, useContext, useEffect } from 'react';
import styles from './MainContent.module.css';
import { useTranslation } from 'react-i18next';
import { countryDataMap } from '../assets/data/adjusted/countryDataIndex';
import { BalanceContext } from './TopNav';
import LoginForm from './LoginForm';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import PaymentPage from './PaymentPage';
import { API_BASE_URL } from '../apiConfig';

function MainContent({ activePage, setActivePage, onLoginSuccess, user, priceTab, setPriceTab }) {
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
        onLoginSuccess && onLoginSuccess(response.data);
      } else {
        setError("Đăng nhập thất bại!");
      }
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu!");
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
    'Khi nào có số mới được thêm vào?': {
      title: 'Khi nào có số mới được thêm vào?',
      content: (
        <>
          <p>Thông tin về việc bổ sung số mới cho các quốc gia Nga, Anh, Hà Lan, Pháp, Kazakhstan có thể theo dõi trên Telegram <a href="https://t.me/new_numbers_5sim" target="_blank" rel="noopener noreferrer">https://t.me/new_numbers_5sim</a>.</p>
          <p>5SIM cũng có kênh tin tức trên Telegram <a href="https://t.me/news_en_5sim" target="_blank" rel="noopener noreferrer">https://t.me/news_en_5sim</a>.</p>
          <p>Số của các nhà mạng Virtual4 sẽ được cập nhật vào 6-8h sáng và 18-21h tối (giờ Moscow). Các nhà mạng khác thường được cập nhật hàng ngày.</p>
        </>
      ),
    },
    'Tài khoản vừa tạo bị khóa sau một thời gian': {
      title: 'Tài khoản vừa tạo bị khóa sau một thời gian',
      content: (
        <>
          <p>Theo quy định của 5SIM, chúng tôi không chịu trách nhiệm về việc tài khoản bị khóa do nhiều nguyên nhân khác nhau. Không hoàn tiền hoặc thay thế số trong trường hợp này.</p>
          <p>Một trong các lý do phổ biến là IP và vị trí địa lý không khớp với số điện thoại mua. Hãy sử dụng proxy/VPN chất lượng cao, mỗi tài khoản nên dùng proxy khác nhau.</p>
          <ul>
            <li>Dùng thiết bị khác nhau cho mỗi tài khoản.</li>
            <li>Không dùng số ảo cho tài khoản chính, tài khoản quan trọng.</li>
            <li>Không thực hiện hành vi spam, tự động hóa bất thường.</li>
          </ul>
        </>
      ),
    },
    'Có số trên website nhưng không thể mua được': {
      title: 'Có số trên website nhưng không thể mua được',
      content: (
        <>
          <p>Có hai lý do chính:</p>
          <ol>
            <li>Một số nhà mạng như virtual4, virtual7 không thể hiển thị chính xác số lượng. Hãy thử đổi nhà mạng hoặc quốc gia.</li>
            <li>Hệ thống có cơ chế đánh giá. Nếu bạn bấm "Hủy" hoặc "Ban" nhiều lần, tài khoản có thể bị khóa mua số trong 1 giờ.</li>
          </ol>
        </>
      ),
    },
    'Số tạm thời là gì?': {
      title: 'Số tạm thời là gì?',
      content: (
        <>
          <p>Số tạm thời là số dùng một lần để đăng ký, xác thực tài khoản trên các nền tảng mà không cần số cá nhân. Số này không gắn với thông tin cá nhân, không dùng cho tài khoản quan trọng.</p>
          <p>Không nên dùng số tạm thời cho tài khoản chính, tài khoản chứa thông tin bảo mật.</p>
        </>
      ),
    },
    'Có số dùng lâu dài không?': {
      title: 'Có số dùng lâu dài không?',
      content: (
        <>
          <p>5SIM chỉ cung cấp số tạm thời, thời gian sử dụng từ 10-20 phút. Hiện chưa hỗ trợ thuê số lâu dài.</p>
          <p>Bạn có thể để lại yêu cầu, chúng tôi sẽ liên hệ khi có dịch vụ thuê số lâu dài.</p>
        </>
      ),
    },
    'Thông báo "Không đủ tiền"': {
      title: 'Thông báo "Không đủ tiền"',
      content: (
        <>
          <p>Nếu chọn nhà mạng "Bất kỳ", hệ thống sẽ hiển thị giá thấp nhất. Nếu không còn số ở mức giá đó, bạn sẽ được cung cấp số của nhà mạng khác với giá cao hơn.</p>
          <p>Vì vậy, có thể bạn sẽ thấy thông báo này khi số giá rẻ đã hết.</p>
        </>
      ),
    },
    'Thông báo "Đánh giá thấp"': {
      title: 'Thông báo "Đánh giá thấp"',
      content: (
        <>
          <p>Nếu bạn hủy hoặc báo cáo số nhiều lần, tài khoản sẽ bị đánh giá thấp và có thể bị hạn chế mua số trong 1 giờ.</p>
        </>
      ),
    },
    'Tôi không thể tạo tài khoản 5SIM': {
      title: 'Tôi không thể tạo tài khoản 5SIM',
      content: (
        <>
          <p>Bạn cần xác minh email để hoàn tất đăng ký. Hãy kiểm tra hộp thư (bao gồm cả mục Spam) và làm theo hướng dẫn trong email xác nhận.</p>
        </>
      ),
    },
    'Không đăng nhập được bằng tài khoản/mật khẩu': {
      title: 'Không đăng nhập được bằng tài khoản/mật khẩu',
      content: (
        <>
          <ol>
            <li>Kiểm tra lại thông tin đăng nhập. Nếu quên mật khẩu, hãy sử dụng chức năng quên mật khẩu để đặt lại.</li>
            <li>Nếu đăng ký qua Google, hãy đăng nhập bằng nút Google.</li>
            <li>Nếu tài khoản bị xóa do không sử dụng hơn 1 năm, số dư sẽ không được hoàn lại.</li>
            <li>Thử đổi địa chỉ IP nếu gặp lỗi liên quan đến IP.</li>
          </ol>
        </>
      ),
    },
    'Cách đổi email tài khoản 5SIM?': {
      title: 'Cách đổi email tài khoản 5SIM?',
      content: (
        <>
          <p>Hiện tại không hỗ trợ đổi email tài khoản. Bạn chỉ có thể tạo tài khoản mới với email khác.</p>
        </>
      ),
    },
    'Tài khoản bị hack phải làm sao?': {
      title: 'Tài khoản bị hack phải làm sao?',
      content: (
        <>
          <ol>
            <li>Vào cài đặt tài khoản, đổi mật khẩu và tick chọn chấm dứt tất cả phiên đăng nhập, khóa API key.</li>
            <li>Không dùng chung mật khẩu cho nhiều website.</li>
            <li>Kiểm tra xem email có bị lộ trên <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer">haveibeenpwned.com</a>.</li>
            <li>Quét virus, kiểm tra thiết bị.</li>
            <li>Luôn dùng proxy/VPN khi thao tác API.</li>
          </ol>
        </>
      ),
    },
    'Không nhận được SMS thì làm gì?': {
      title: 'Không nhận được SMS thì làm gì?',
      content: (
        <>
          <p>Nếu không nhận được SMS, bạn nên thử mua số khác hoặc đổi nhà mạng/quốc gia. Đôi khi cần thử lại vài lần mới nhận được mã do tỉ lệ thành công không phải 100%. Xem thống kê tỉ lệ nhận SMS tại <a href="https://5sim.net/prices" target="_blank" rel="noopener noreferrer">bảng giá</a>.</p>
          <p>Hãy đảm bảo bạn dùng proxy/VPN đúng quốc gia, thử đổi trình duyệt hoặc thiết bị nếu vẫn không nhận được mã.</p>
          <p>Nếu không nhận được SMS, tiền sẽ tự động hoàn về tài khoản sau khi đơn hàng kết thúc.</p>
        </>
      ),
    },
    'Mã xác nhận sai': {
      title: 'Mã xác nhận sai',
      content: (
        <>
          <p>Nếu mã xác nhận bạn nhận được không hợp lệ, để được hoàn tiền bạn cần:</p>
          <ol>
            <li>Gửi số đơn hàng hoặc số điện thoại đã mua.</li>
            <li>Đính kèm ảnh chụp màn hình quá trình đăng ký, trong đó hiển thị rõ số điện thoại, thời gian đăng ký, mã xác nhận nhận được và cảnh báo mã sai.</li>
          </ol>
          <p>Bạn cũng có thể quay video quá trình nếu cần.</p>
        </>
      ),
    },
    'Số điện thoại đã được sử dụng': {
      title: 'Số điện thoại đã được sử dụng',
      content: (
        <>
          <p>Nếu số đã được sử dụng, để hoàn tiền bạn cần:</p>
          <ol>
            <li>Gửi số đơn hàng hoặc số điện thoại đã mua.</li>
            <li>BẮT BUỘC gửi ảnh chụp màn hình quá trình đăng ký, trong đó hiển thị rõ số điện thoại, thời gian đăng ký, mã xác nhận và cảnh báo số đã dùng.</li>
            <li>Mỗi ngày chỉ hoàn tối đa 3 đơn cho mỗi quốc gia + nhà mạng.</li>
          </ol>
          <p>Nếu bạn dùng app, hãy gửi video quá trình thao tác và cảnh báo số đã dùng.</p>
        </>
      ),
    },
    'Làm sao nhận lại mã xác thực?': {
      title: 'Làm sao nhận lại mã xác thực?',
      content: (
        <>
          <p>Sau khi nhận SMS đầu tiên, bạn có thể nhận thêm mã mới trong vòng 5 phút (nếu dịch vụ hỗ trợ). Một số nhà mạng chỉ nhận được 1 SMS duy nhất.</p>
          <p>Bạn có thể nhận số lượng lớn SMS trong 6-30 phút với các nhà mạng hỗ trợ nhiều lần nhận mã.</p>
        </>
      ),
    },
    'Cách xác thực qua cuộc gọi?': {
      title: 'Cách xác thực qua cuộc gọi?',
      content: (
        <>
          <p>Nếu bạn cần nhận mã qua cuộc gọi, hãy chọn dịch vụ hỗ trợ xác thực bằng cuộc gọi (ví dụ: Virtual53, MTS, Yota, Megafon, Beeline...). Mã xác thực là các số cuối của số điện thoại hoặc sẽ hiển thị trên giao diện nhận SMS.</p>
        </>
      ),
    },
    'Nhận cuộc gọi và mã từ voice bot như thế nào?': {
      title: 'Nhận cuộc gọi và mã từ voice bot như thế nào?',
      content: (
        <>
          <p>Để nhận mã từ voice bot, hãy chọn quốc gia Mỹ và nhà mạng Virtual28. Khi có cuộc gọi đến, hệ thống sẽ hiển thị mã xác thực trên giao diện nhận SMS.</p>
        </>
      ),
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
    'Tiền đã nạp nhưng chưa vào tài khoản': {
      title: 'Tiền đã nạp nhưng chưa vào tài khoản',
      content: (
        <>
          <p>Hãy kiểm tra lại phương thức thanh toán, gửi biên lai giao dịch cho bộ phận hỗ trợ để được kiểm tra và cộng tiền thủ công nếu cần.</p>
        </>
      ),
    },
    'Cách rút tiền từ tài khoản 5SIM?': {
      title: 'Cách rút tiền từ tài khoản 5SIM?',
      content: (
        <>
          <p>Khi rút tiền, hệ thống sẽ hiển thị các lưu ý về phí và điều kiện rút. Bạn nên sử dụng hết số dư trong hệ thống để tránh mất phí không cần thiết.</p>
        </>
      ),
    },
    'Chuyển tiền sang tài khoản 5SIM khác': {
      title: 'Chuyển tiền sang tài khoản 5SIM khác',
      content: (
        <>
          <p>Hiện tại không thể chuyển tiền giữa các tài khoản 5SIM.</p>
        </>
      ),
    },
    'Tôi không thể tạo tài khoản 5SIM': {
      title: 'Tôi không thể tạo tài khoản 5SIM',
      content: (
        <>
          <p>Bạn cần xác minh email để hoàn tất đăng ký. Hãy kiểm tra hộp thư (bao gồm cả mục Spam) và làm theo hướng dẫn trong email xác nhận.</p>
        </>
      ),
    },
    'Không đăng nhập được bằng tài khoản/mật khẩu': {
      title: 'Không đăng nhập được bằng tài khoản/mật khẩu',
      content: (
        <>
          <ol>
            <li>Kiểm tra lại email và mật khẩu đã nhập đúng chưa.</li>
            <li>Nếu đăng ký qua Google, hãy đăng nhập bằng nút Google.</li>
            <li>Nếu tài khoản bị xóa do không sử dụng hơn 1 năm, số dư sẽ không được hoàn lại.</li>
            <li>Thử đổi địa chỉ IP nếu gặp lỗi liên quan đến IP.</li>
          </ol>
        </>
      ),
    },
    'Cách đổi email tài khoản 5SIM?': {
      title: 'Cách đổi email tài khoản 5SIM?',
      content: (
        <>
          <p>Hiện tại không hỗ trợ đổi email tài khoản. Bạn chỉ có thể tạo tài khoản mới với email khác.</p>
        </>
      ),
    },
    'Tài khoản bị hack phải làm sao?': {
      title: 'Tài khoản bị hack phải làm sao?',
      content: (
        <>
          <ol>
            <li>Vào cài đặt tài khoản, đổi mật khẩu và tick chọn chấm dứt tất cả phiên đăng nhập, khóa API key.</li>
            <li>Không dùng chung mật khẩu cho nhiều website.</li>
            <li>Kiểm tra xem email có bị lộ trên <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer">haveibeenpwned.com</a>.</li>
            <li>Quét virus, kiểm tra thiết bị.</li>
            <li>Luôn dùng proxy/VPN khi thao tác API.</li>
          </ol>
        </>
      ),
    },
    'Làm sao lấy API key?': {
      title: 'Làm sao lấy API key?',
      content: (
        <>
          <ol>
            <li>Vào mục "Hồ sơ" trên website.</li>
            <li>Chọn "Lấy API key".</li>
            <li>Nếu phần mềm có 5sim.net, chọn "API key 5SIM protocol". Nếu không, chọn "API key API1 protocol (Deprecated API)".</li>
          </ol>
        </>
      ),
    },
    'Mua số qua API': {
      title: 'Mua số qua API',
      content: (
        <>
          <p>Xem tài liệu API tại <a href="https://5sim.net/manual" target="_blank" rel="noopener noreferrer">https://5sim.net/manual</a> để biết cách mua số qua API.</p>
          <p>API hỗ trợ nhiều phần mềm, có thể nhận hoa hồng cho mỗi đơn hàng qua API.</p>
        </>
      ),
    },
    'IP bị chặn': {
      title: 'IP bị chặn',
      content: (
        <>
          <p>Nếu IP bị chặn, có thể do vượt quá giới hạn truy cập. Xem chi tiết tại <a href="https://docs.5sim.net/ru/#c897b4c6d4" target="_blank" rel="noopener noreferrer">docs.5sim.net</a>. Hãy thử đổi mạng hoặc dùng VPN/proxy.</p>
        </>
      ),
    },
    'Tích hợp 5SIM vào phần mềm': {
      title: 'Tích hợp 5SIM vào phần mềm',
      content: (
        <>
          <p>Xem tài liệu API để biết cách tích hợp 5SIM vào phần mềm của bạn.</p>
        </>
      ),
    },
    'Bán số trên nền tảng 5SIM': {
      title: 'Bán số trên nền tảng 5SIM',
      content: (
        <>
          <p>Liên hệ với đội ngũ 5SIM để biết thêm chi tiết về việc hợp tác bán số.</p>
        </>
      ),
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

  if (activePage === 'login') {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'70vh',width:'100%'}}>
        <div style={{maxWidth:420,width:'100%',margin:'0 auto',padding:'2.5rem 2.2rem',boxShadow:'0 4px 32px #0002',borderRadius:20,background:'#fff'}}>
          <h2 style={{textAlign:'center',marginBottom:18,fontWeight:700,fontSize:'1.7rem'}}>Log in with the help</h2>
          <button style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'10px 0',background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:10,fontWeight:600,fontSize:'1rem',marginBottom:18,cursor:'pointer'}}>
            <FaGoogle style={{fontSize:20}}/> Sign in with Google
          </button>
          <div style={{display:'flex',alignItems:'center',gap:10,margin:'18px 0'}}>
            <div style={{flex:1,height:1,background:'#e5e7eb'}}></div>
            <span style={{color:'#888',fontWeight:500}}>OR</span>
            <div style={{flex:1,height:1,background:'#e5e7eb'}}></div>
          </div>
          <LoginForm onLoginSuccess={onLoginSuccess} onClose={() => setActivePage('nav_home')} />
          <div style={{marginTop:18,textAlign:'center',fontSize:'0.97rem',color:'#444'}}>
            Do not have account? <a href="#" style={{color:'#2563eb',fontWeight:600,textDecoration:'none'}}>Registration</a>
          </div>
        </div>
      </div>
    );
  }

  if (activePage === 'nav_payment') {
    return <PaymentPage user={user} />;
  }

  if (activePage === 'purchase') {
    return (
      <div className={styles.purchaseCard}>
        <div className={styles.purchaseTabs}>
          <button className={purchaseTab === 'active' ? styles.purchaseTabActive : styles.purchaseTab} onClick={() => setPurchaseTab('active')}>Active orders</button>
          <button className={purchaseTab === 'history' ? styles.purchaseTabActive : styles.purchaseTab} onClick={() => setPurchaseTab('history')}>Order history</button>
        </div>
        <div className={styles.purchaseContent}>
          {purchaseTab === 'active' ? (
            <div className={styles.purchaseEmpty}>
              <div style={{fontWeight: 600, fontSize: 20, marginBottom: 8}}>No active orders</div>
              <div style={{color: '#888', marginBottom: 24}}>You have not purchased any numbers yet.</div>
              <ol style={{textAlign:'left', color:'#444', maxWidth:420}}>
                <li><b>Top Up your Balance:</b> Add funds to your balance via any of the payment methods offered by our website.</li>
                <li><b>Select a Service:</b> In the left panel you can choose the service you need.</li>
                <li><b>Select a Country:</b> Choose the country and operator you need.</li>
                <li><b>Apply the Phone Number:</b> Press the cart button to buy the number, then paste the number where required.</li>
              </ol>
            </div>
          ) : (
            <div className={styles.purchaseEmpty}>
              <div style={{fontWeight: 600, fontSize: 20, marginBottom: 8}}>No orders found</div>
              <div style={{color: '#888'}}>You have not purchased any numbers yet.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const statsDisplayData = sortedStatsData.slice(0, 20);
  const statsMinPrice = statsDisplayData.length > 0 ? Math.min(...statsDisplayData.map(r => r.price)) : 0;
  const statsMaxPrice = statsDisplayData.length > 0 ? Math.max(...statsDisplayData.map(r => r.price)) : 1;

  return (
    <div className={styles.homepage}>
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
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Khi nào có số mới được thêm vào?')}>{t('faq_new_numbers')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Tài khoản vừa tạo bị khóa sau một thời gian')}>{t('faq_account_locked')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Có số trên website nhưng không thể mua được')}>{t('faq_cannot_buy')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Số tạm thời là gì?')}>{t('faq_temporary_number')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Có số dùng lâu dài không?')}>{t('faq_long_term_number')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_technical_questions')}</span></div>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Tôi không thể tạo tài khoản 5SIM')}>{t('faq_cannot_create_account')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Không đăng nhập được bằng tài khoản/mật khẩu')}>{t('faq_login_issue')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Cách đổi email tài khoản 5SIM?')}>{t('faq_change_email')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Tài khoản bị hack phải làm sao?')}>{t('faq_account_hacked')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Làm sao lấy API key?')}>{t('faq_get_api_key')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_sms_questions')}</span></div>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Không nhận được SMS thì làm gì?')}>{t('faq_no_sms')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Mã xác nhận sai')}>{t('faq_wrong_code')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Số điện thoại đã được sử dụng')}>{t('faq_number_used')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Làm sao nhận lại mã xác thực?')}>{t('faq_re_code')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Cách xác thực qua cuộc gọi?')}>{t('faq_call_verification')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Nhận cuộc gọi và mã từ voice bot như thế nào?')}>{t('faq_voice_bot')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_payment_questions')}</span></div>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Làm sao để nạp tiền vào tài khoản 5SIM?')}>{t('faq_top_up')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Phí giao dịch')}>{t('faq_transaction_fee')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Tiền đã nạp nhưng chưa vào tài khoản')}>{t('faq_funds_not_credited')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Cách rút tiền từ tài khoản 5SIM?')}>{t('faq_withdraw')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Chuyển tiền sang tài khoản 5SIM khác')}>{t('faq_transfer_funds')}</a>
                    </div>
                    <div className={styles.faqCol}>
                      <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>{t('faq_api_questions')}</span></div>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Mua số qua API')}>{t('faq_api_buy_number')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('IP bị chặn')}>{t('faq_ip_blocked')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Tích hợp 5SIM vào phần mềm')}>{t('faq_integrate_api')}</a>
                      <a href="#" className={styles.faqLink} onClick={() => setFaqDetail('Bán số trên nền tảng 5SIM')}>{t('faq_sell_numbers')}</a>
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
}

export default MainContent;
