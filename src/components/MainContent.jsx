import React, { useState } from 'react';
import styles from './MainContent.module.css';

function MainContent({ activePage }) {
  const [priceTab, setPriceTab] = useState('price');

  // State cho Price Table
  const [priceSortBy, setPriceSortBy] = useState('rate');
  const [priceSortOrder, setPriceSortOrder] = useState('desc');
  const [filterService, setFilterService] = useState('Tất cả');
  const [filterCountry, setFilterCountry] = useState('Tất cả');

  // State cho Statistics tab
  const [statsSortBy, setStatsSortBy] = useState('rate');
  const [statsSortOrder, setStatsSortOrder] = useState('desc');
  const [hoveredBar, setHoveredBar] = useState(null);

  // State cho trang chi tiết FAQ
  const [faqDetail, setFaqDetail] = useState(null);

  // Dữ liệu mẫu cho Price Table
  const priceData = [
    { service: 'Telegram', flag: '🇻🇳', country: 'Việt Nam', operator: 'Virtual4', rate: 98, pcs: 1200, price: 35 },
    { service: 'Telegram', flag: '🇺🇸', country: 'Hoa Kỳ', operator: 'Virtual5', rate: 95, pcs: 800, price: 50 },
    { service: 'Telegram', flag: '🇷🇺', country: 'Nga', operator: 'Virtual7', rate: 97, pcs: 2000, price: 20 },
    { service: 'Telegram', flag: '🇯🇵', country: 'Nhật Bản', operator: 'Virtual8', rate: null, pcs: 300, price: 60 },
    { service: 'Facebook', flag: '🇻🇳', country: 'Việt Nam', operator: 'Virtual4', rate: 90, pcs: 500, price: 40 },
    { service: 'Facebook', flag: '🇺🇸', country: 'Hoa Kỳ', operator: 'Virtual5', rate: 85, pcs: 300, price: 55 },
    { service: 'Facebook', flag: '🇷🇺', country: 'Nga', operator: 'Virtual7', rate: 92, pcs: 700, price: 25 },
    { service: 'Facebook', flag: '🇯🇵', country: 'Nhật Bản', operator: 'Virtual8', rate: null, pcs: 100, price: 65 },
  ];

  // Lọc dữ liệu theo filter
  const filteredPriceData = priceData.filter(row =>
    (filterService === 'Tất cả' || row.service === filterService) &&
    (filterCountry === 'Tất cả' || row.country === filterCountry)
  );

  // Sắp xếp dữ liệu bảng giá
  const sortedPriceData = [...filteredPriceData].sort((a, b) => {
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

  // Dữ liệu mẫu cho Statistics (không thay đổi)
  const statsData = [
    { flag: '🇭🇺', country: 'Hungary', operator: 'Virtual38', rate: 90.91, price: 540 },
    { flag: '🇨🇾', country: 'Cyprus', operator: 'Virtual4', rate: 77.27, price: 23.8 },
    { flag: '🇦🇺', country: 'Australia', operator: 'Virtual38', rate: 54.55, price: 438.3 },
    { flag: '🇺🇸', country: 'USA', operator: 'Virtual40', rate: 46.2, price: 60 },
    { flag: '🇳🇱', country: 'Netherlands', operator: 'Virtual58', rate: 31.08, price: 266.7 },
    { flag: '🇰🇿', country: 'Kazakhstan', operator: 'Virtual58', rate: 24.64, price: 133.33 },
    { flag: '🇺🇸', country: 'USA', operator: 'Virtual28', rate: 24.39, price: 60 },
    { flag: '🇨🇾', country: 'Cyprus', operator: 'Virtual38', rate: 24.1, price: 286.67 },
    { flag: '🇺🇦', country: 'Ukraine', operator: 'Virtual58', rate: 19.5, price: 206.7 },
    { flag: '🇺🇾', country: 'Uruguay', operator: 'Virtual58', rate: 15.2, price: 303 },
  ];
  // Sắp xếp dữ liệu Statistics
  const sortedStatsData = [...statsData].sort((a, b) => {
    if (statsSortBy === 'rate') return statsSortOrder === 'desc' ? b.rate - a.rate : a.rate - b.rate;
    if (statsSortBy === 'price') return statsSortOrder === 'desc' ? b.price - a.price : a.price - b.price;
    if (statsSortBy === 'country') return statsSortOrder === 'desc' ? b.country.localeCompare(a.country) : a.country.localeCompare(b.country);
    return 0;
  });

  // Lấy danh sách dịch vụ và quốc gia cho dropdown
  const serviceOptions = ['Tất cả', ...Array.from(new Set(priceData.map(row => row.service)))];
  const countryOptions = ['Tất cả', ...Array.from(new Set(priceData.map(row => row.country)))];

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

  return (
    <div className={styles.homepage}>
      <div className={styles.card}>
        {activePage === 'home' && (
          <>
            {/* Giới thiệu dịch vụ */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Số điện thoại ảo nhận mã SMS và đăng ký mọi nền tảng</h2>
              <p className={styles.descriptionText}>
                5SIM cung cấp số điện thoại ảo để nhận mã xác thực SMS, đăng ký tài khoản, bảo vệ quyền riêng tư trên các nền tảng như Facebook, Google, Telegram, Zalo, TikTok, Shopee, v.v. Dịch vụ nhanh chóng, bảo mật, giá rẻ, hỗ trợ 24/7.
              </p>
            </div>

            {/* Lợi ích nổi bật */}
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📱</div>
                <div>
                  <div className={styles.infoTitle}>Hơn 500.000 số điện thoại</div>
                  <div className={styles.infoDesc}>Kho số lớn, đa quốc gia, luôn có sẵn để sử dụng cho mọi nhu cầu xác thực.</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🆕</div>
                <div>
                  <div className={styles.infoTitle}>Số mới cập nhật liên tục</div>
                  <div className={styles.infoDesc}>Hệ thống tự động cập nhật số mới mỗi ngày, đảm bảo luôn có số sạch, chưa từng sử dụng.</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🔄</div>
                <div>
                  <div className={styles.infoTitle}>Một lần hoặc nhiều lần SMS</div>
                  <div className={styles.infoDesc}>Chọn số dùng 1 lần hoặc thuê số nhận nhiều mã SMS trong thời gian dài.</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>👨‍💻</div>
                <div>
                  <div className={styles.infoTitle}>Cho cá nhân & nhà phát triển</div>
                  <div className={styles.infoDesc}>API mạnh mẽ, tài liệu chi tiết, phù hợp cả người dùng cá nhân lẫn doanh nghiệp.</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>💸</div>
                <div>
                  <div className={styles.infoTitle}>Phí hoa hồng thấp</div>
                  <div className={styles.infoDesc}>Giá dịch vụ cạnh tranh, minh bạch, không phí ẩn, thanh toán linh hoạt.</div>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>⏰</div>
                <div>
                  <div className={styles.infoTitle}>Hỗ trợ 24/7</div>
                  <div className={styles.infoDesc}>Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc qua Telegram, Facebook, Email.</div>
                </div>
              </div>
            </div>

            {/* Lợi ích khi dùng số ảo */}
            <div className={styles.section}>
              <h3 className={styles.sectionSubtitle}>Bạn có thể làm gì với số điện thoại tạm thời?</h3>
              <div className={styles.benefitGrid}>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitTitle}>Đăng ký hàng loạt, kiếm tiền</div>
                  <div className={styles.benefitDesc}>Tạo nhiều tài khoản, nhận mã xác thực nhanh chóng để tham gia các chương trình kiếm tiền, nhận thưởng, tiếp thị liên kết.</div>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitTitle}>Ẩn danh, bảo mật</div>
                  <div className={styles.benefitDesc}>Bảo vệ số thật, tránh spam, quảng cáo, lộ thông tin cá nhân khi đăng ký dịch vụ mới.</div>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitTitle}>Nhận ưu đãi, tham gia event</div>
                  <div className={styles.benefitDesc}>Dễ dàng nhận mã giảm giá, quà tặng, tham gia các sự kiện, minigame online.</div>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitTitle}>Vượt giới hạn địa lý</div>
                  <div className={styles.benefitDesc}>Đăng ký dịch vụ quốc tế, nhận mã xác thực từ bất kỳ đâu, không bị giới hạn vùng miền.</div>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.benefitTitle}>Chống lừa đảo</div>
                  <div className={styles.benefitDesc}>Giảm nguy cơ bị lừa đảo, bảo vệ tài khoản chính khi thử nghiệm dịch vụ mới hoặc nghi ngờ.</div>
                </div>
              </div>
            </div>

            {/* Ai hưởng lợi */}
            <div className={styles.section}>
              <h3 className={styles.sectionSubtitle}>Ai nên sử dụng số điện thoại ảo?</h3>
              <ul className={styles.benefitList}>
                <li>Người muốn bảo vệ quyền riêng tư, tránh spam</li>
                <li>Người làm MMO, tiếp thị liên kết, săn event</li>
                <li>Nhà phát triển, tester, marketer cần test dịch vụ</li>
                <li>Bất kỳ ai cần nhận mã xác thực online nhanh chóng</li>
              </ul>
            </div>

            {/* Hướng dẫn nhận SMS */}
            <div className={styles.section}>
              <h3 className={styles.sectionSubtitle}>Hướng dẫn nhận mã SMS bằng số ảo</h3>
              <div className={styles.guideGrid}>
                <div className={styles.guideStep}>
                  <div className={styles.guideNum}>1</div>
                  <div>
                    <div className={styles.guideTitle}>Chọn số điện thoại ảo</div>
                    <div className={styles.guideDesc}>Đăng nhập, chọn quốc gia, dịch vụ và số điện thoại phù hợp.</div>
                  </div>
                </div>
                <div className={styles.guideStep}>
                  <div className={styles.guideNum}>2</div>
                  <div>
                    <div className={styles.guideTitle}>Nhận mã xác thực</div>
                    <div className={styles.guideDesc}>Sử dụng số vừa chọn để đăng ký dịch vụ, nhận mã SMS gửi về ngay lập tức.</div>
                  </div>
                </div>
                <div className={styles.guideStep}>
                  <div className={styles.guideNum}>3</div>
                  <div>
                    <div className={styles.guideTitle}>Hoàn tất xác minh</div>
                    <div className={styles.guideDesc}>Nhập mã xác thực vào dịch vụ bạn cần, hoàn tất đăng ký an toàn.</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activePage === 'faq' && (
          <div className={styles.faqSection}>
            {!faqDetail ? (
              <>
                <h2 className={styles.faqTitle}>Câu hỏi thường gặp (FAQ)</h2>
                <div className={styles.faqGrid}>
                  <div className={styles.faqCol}>
                    <div className={styles.faqGroup}><span className={styles.faqIcon}>❓</span> <span className={styles.faqGroupTitle}>Câu hỏi chung</span></div>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Khi nào có số mới được thêm vào?')}>Khi nào có số mới được thêm vào?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Tài khoản vừa tạo bị khóa sau một thời gian')}>Tài khoản vừa tạo bị khóa sau một thời gian</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Có số trên website nhưng không thể mua được')}>Có số trên website nhưng không thể mua được</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Số tạm thời là gì?')}>Số tạm thời là gì?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Có số dùng lâu dài không?')}>Có số dùng lâu dài không?</a>
                  </div>
                  <div className={styles.faqCol}>
                    <div className={styles.faqGroup}><span className={styles.faqIcon}>💰</span> <span className={styles.faqGroupTitle}>Nạp & rút tiền</span></div>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Làm sao để nạp tiền vào tài khoản 5SIM?')}>Làm sao để nạp tiền vào tài khoản 5SIM?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Phí giao dịch')}>Phí giao dịch</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Tiền đã nạp nhưng chưa vào tài khoản')}>Tiền đã nạp nhưng chưa vào tài khoản</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Cách rút tiền từ tài khoản 5SIM?')}>Cách rút tiền từ tài khoản 5SIM?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Chuyển tiền sang tài khoản 5SIM khác')}>Chuyển tiền sang tài khoản 5SIM khác</a>
                  </div>
                  <div className={styles.faqCol}>
                    <div className={styles.faqGroup}><span className={styles.faqIcon}>⚠️</span> <span className={styles.faqGroupTitle}>Đánh giá thấp, không đủ tiền</span></div>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Thông báo "Không đủ tiền"')}>Thông báo "Không đủ tiền"</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Thông báo "Đánh giá thấp"')}>Thông báo "Đánh giá thấp"</a>
                    <div className={styles.faqGroup} style={{marginTop: '1.2rem'}}><span className={styles.faqIcon}>📝</span> <span className={styles.faqGroupTitle}>Đăng ký, đăng nhập, email</span></div>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Tôi không thể tạo tài khoản 5SIM')}>Tôi không thể tạo tài khoản 5SIM</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Không đăng nhập được bằng tài khoản/mật khẩu')}>Không đăng nhập được bằng tài khoản/mật khẩu</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Cách đổi email tài khoản 5SIM?')}>Cách đổi email tài khoản 5SIM?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Tài khoản bị hack phải làm sao?')}>Tài khoản bị hack phải làm sao?</a>
                  </div>
                  <div className={styles.faqCol}>
                    <div className={styles.faqGroup}><span className={styles.faqIcon}>🔑</span> <span className={styles.faqGroupTitle}>SMS, mã xác thực</span></div>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Không nhận được SMS thì làm gì?')}>Không nhận được SMS thì làm gì?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Mã xác nhận sai')}>Mã xác nhận sai</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Số điện thoại đã được sử dụng')}>Số điện thoại đã được sử dụng</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Làm sao nhận lại mã xác thực?')}>Làm sao nhận lại mã xác thực?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Cách xác thực qua cuộc gọi?')}>Cách xác thực qua cuộc gọi?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Nhận cuộc gọi và mã từ voice bot như thế nào?')}>Nhận cuộc gọi và mã từ voice bot như thế nào?</a>
                    <div className={styles.faqGroup} style={{marginTop: '1.2rem'}}><span className={styles.faqIcon}>🔗</span> <span className={styles.faqGroupTitle}>Thông tin API</span></div>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Làm sao lấy API key?')}>Làm sao lấy API key?</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Mua số qua API')}>Mua số qua API</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('IP bị chặn')}>IP bị chặn</a>
                  </div>
                  <div className={styles.faqCol}>
                    <div className={styles.faqGroup}><span className={styles.faqIcon}>🤝</span> <span className={styles.faqGroupTitle}>Hợp tác</span></div>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Tích hợp 5SIM vào phần mềm')}>Tích hợp 5SIM vào phần mềm</a>
                    <a href="#" className={styles.faqLink} onClick={() => handleFaqClick('Bán số trên nền tảng 5SIM')}>Bán số trên nền tảng 5SIM</a>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.faqDetailBox}>
                <div className={styles.faqBreadcrumb}>
                  <span className={styles.faqBreadcrumbLink} onClick={handleFaqBack}>FAQ</span>
                  <span className={styles.faqBreadcrumbSep}>/</span>
                  <span>{faqDetails[faqDetail]?.title}</span>
                </div>
                <h2 className={styles.faqDetailTitle}>{faqDetails[faqDetail]?.title}</h2>
                <div className={styles.faqDetailContent}>{faqDetails[faqDetail]?.content}</div>
                <button className={styles.faqBackBtn} onClick={handleFaqBack}>← Quay lại FAQ</button>
              </div>
            )}
          </div>
        )}

        {activePage === 'api' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>API Information</h2>
            <p className={styles.descriptionText}>Thông tin về API, hướng dẫn sử dụng API của 5SIM sẽ được hiển thị ở đây.</p>
          </div>
        )}
        {activePage === 'howto' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Hướng dẫn mua số và nhận mã SMS</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineStep}>
                <div className={styles.timelineIcon}>1</div>
                <div className={styles.timelineContent}><b>Đăng nhập hoặc đăng ký tài khoản</b></div>
                <div className={styles.timelineLine}></div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.timelineIcon}>2</div>
                <div className={styles.timelineContent}><b>Nạp tiền vào tài khoản</b><span className={styles.timelineNote}>Bạn có thể chọn nhiều phương thức thanh toán khác nhau.</span></div>
                <div className={styles.timelineLine}></div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.timelineIcon}>3</div>
                <div className={styles.timelineContent}><b>Chọn dịch vụ cần nhận mã</b><span className={styles.timelineNote}>Chọn website/app bạn muốn nhận mã SMS.</span></div>
                <div className={styles.timelineLine}></div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.timelineIcon}>4</div>
                <div className={styles.timelineContent}><b>Chọn quốc gia</b><span className={styles.timelineNote}>Chọn quốc gia phù hợp với dịch vụ.</span></div>
                <div className={styles.timelineLine}></div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.timelineIcon}>5</div>
                <div className={styles.timelineContent}><b>Chọn nhà mạng (nếu có)</b></div>
                <div className={styles.timelineLine}></div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.timelineIcon}>6</div>
                <div className={styles.timelineContent}><b>Nhấn "Mua số"</b><span className={styles.timelineNote}>Số sẽ hiển thị ngay, bạn dùng số này để đăng ký dịch vụ.</span></div>
                <div className={styles.timelineLine}></div>
              </div>
              <div className={styles.timelineStep}>
                <div className={styles.timelineIcon}>7</div>
                <div className={styles.timelineContent}><b>Nhận mã SMS</b><span className={styles.timelineNote}>Mã xác thực sẽ hiển thị ngay khi dịch vụ gửi về.</span></div>
          </div>
        </div>

            <div className={styles.infoBox}>
              <b>💡 Lưu ý:</b>
              <ul>
                <li>Nếu số không nhận được mã, bạn có thể hoàn tiền tự động sau 5-15 phút.</li>
                <li>Không dùng số cho các dịch vụ cấm, gian lận, spam.</li>
                <li>Hỗ trợ 24/7 qua Telegram, Facebook, Email.</li>
              </ul>
        </div>

            <div className={styles.section}>
              <h3 className={styles.sectionSubtitle}>Hướng dẫn sử dụng API</h3>
              <div className={styles.apiBox}>
                <div><b>API 5SIM là RESTful, trả về JSON.</b></div>
                <div>Để xác thực, thêm <code>Authorization: Bearer {`<API_KEY>`}</code> vào header.</div>
                <div className={styles.apiCodeBlock}>
                  <div>Ví dụ header:</div>
                  <pre>Authorization: Bearer sk-abc123xyz456</pre>
                </div>
                <div className={styles.apiCodeBlock}>
                  <div>Ví dụ curl:</div>
                  <pre>curl -H "Authorization: Bearer sk-abc123xyz456" https://5sim.net/v1/user/profile</pre>
                </div>
                <div className={styles.apiNote}>Xem tài liệu chi tiết tại <a href="https://5sim.net/docs" target="_blank" rel="noopener noreferrer">https://5sim.net/docs</a></div>
              </div>
            </div>
          </div>
        )}
        {activePage === 'free' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Số điện thoại ảo miễn phí để nhận SMS</h2>
            <p className={styles.descriptionText}>
              Bạn có thể sử dụng số điện thoại ảo miễn phí của 5SIM để nhận mã xác thực SMS mà không cần đăng ký tài khoản. Số miễn phí được cập nhật ngẫu nhiên, không theo lịch cố định. Bạn có thể dùng thử dịch vụ trước khi quyết định đăng ký.
            </p>
            <div className={styles.freeBoxWrap}>
              <div className={styles.freeBox}>
                <h3>Chọn số</h3>
                <div className={styles.freeBoxEmpty}>Không có số miễn phí khả dụng</div>
              </div>
              <div className={styles.freeBox}>
                <h3>Tin nhắn</h3>
                <div className={styles.freeBoxEmpty}>Chưa có tin nhắn nào được nhận</div>
              </div>
            </div>
            <div className={styles.freeNote}>
              Sau khi thử nghiệm, bạn nên đăng ký tài khoản để sử dụng đầy đủ các tính năng và nhận nhiều số hơn.
            </div>
          </div>
        )}

        {activePage === 'blog' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Blog về 5SIM – Nhận SMS và kích hoạt tài khoản mọi nền tảng</h2>
            <div className={styles.blogWrap}>
              <div className={styles.blogMain}>
                {[
                  {title:'Cách tạo tài khoản eBay không cần số điện thoại',date:'27/04/2023',read:'4 phút',desc:'eBay là một trong những sàn thương mại điện tử lớn nhất thế giới. Bạn có thể mua bán mọi thứ, từ quần áo, sách, đồ gia dụng đến đồ điện tử, xe cộ... Bài viết này hướng dẫn bạn tạo tài khoản eBay mà không cần số điện thoại.'},
                  {title:'Cách tạo tài khoản Kwai không cần số điện thoại',date:'27/04/2023',read:'4 phút',desc:'Kwai là nền tảng video giải trí, mạng xã hội nổi tiếng. Bạn có thể tạo tài khoản, đăng video, kiếm tiền mà không cần số điện thoại thật.'},
                  {title:'Số ảo Malaysia',date:'27/04/2023',read:'5 phút',desc:'Malaysia là quốc gia nhỏ nhưng phát triển mạnh về công nghệ, dịch vụ số. Số ảo Malaysia giúp bạn đăng ký nhiều dịch vụ quốc tế dễ dàng.'},
                  {title:'Số ảo Ấn Độ nhận SMS online',date:'14/02/2023',read:'4 phút',desc:'Ấn Độ là quốc gia đông dân, nhiều dịch vụ online cần xác thực SMS. Số ảo Ấn Độ giúp bạn nhận mã xác thực dễ dàng.'},
                  {title:'Số ảo Indonesia',date:'14/02/2023',read:'5 phút',desc:'Indonesia là quốc gia đa văn hóa, nhiều dịch vụ số phát triển. Số ảo Indonesia giúp bạn đăng ký tài khoản quốc tế nhanh chóng.'},
                  {title:'Số ảo Brazil',date:'18/01/2023',read:'4 phút',desc:'Brazil là quốc gia lớn, nhiều dịch vụ online, số ảo giúp bạn nhận mã xác thực, đăng ký tài khoản dễ dàng.'},
                  {title:'Cách tạo tài khoản Mail.ru không cần số điện thoại',date:'18/01/2023',read:'5 phút',desc:'Mail.ru là dịch vụ email lớn nhất tại Nga, hỗ trợ nhiều tính năng, số ảo giúp bạn đăng ký nhanh.'},
                  {title:'Cách tạo tài khoản Eneba không cần số điện thoại',date:'18/01/2023',read:'5 phút',desc:'Eneba là sàn game, gift card, key bản quyền lớn, số ảo giúp bạn đăng ký, mua bán an toàn.'},
                ].map((post, idx) => (
                  <div className={styles.blogCard} key={idx}>
                    <div className={styles.blogTitle}>{post.title}</div>
                    <div className={styles.blogMeta}>{post.date} · {post.read}</div>
                    <div className={styles.blogDesc}>{post.desc}</div>
                  </div>
                ))}
              </div>
              <div className={styles.blogSidebar}>
                <div className={styles.blogSidebarTitle}>Bài viết mới</div>
                <ul className={styles.blogSidebarList}>
                  <li>Cách tạo tài khoản eBay không cần số điện thoại</li>
                  <li>Cách tạo tài khoản Kwai không cần số điện thoại</li>
                  <li>Số ảo Malaysia</li>
                  <li>Số ảo Ấn Độ nhận SMS online</li>
                  <li>Số ảo Indonesia</li>
                </ul>
              </div>
            </div>
            <div className={styles.blogPagination}>
              <span className={styles.blogPageActive}>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        )}
        {activePage === 'price' && (
          <div className={styles.section}>
            <div className={styles.priceHeader}>
              <div className={styles.priceTabs}>
                <button className={priceTab === 'price' ? styles.priceTabActive : styles.priceTab} onClick={() => setPriceTab('price')}>Bảng giá</button>
                <button className={priceTab === 'stats' ? styles.priceTabActive : styles.priceTab} onClick={() => setPriceTab('stats')}>Thống kê</button>
              </div>
              <div className={styles.priceTitle}>{priceTab === 'price' ? 'Bảng giá dịch vụ' : 'Thống kê dịch vụ'}</div>
            </div>
            {priceTab === 'price' && (
              <>
                <div className={styles.priceFilters}>
                  <button className={styles.priceFilterBtn}>⭐ Dịch vụ yêu thích</button>
                  <button className={styles.priceFilterBtn}>⭐ Quốc gia yêu thích</button>
                  <select className={styles.priceSelect} value={filterService} onChange={e => setFilterService(e.target.value)}>
                    {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <select className={styles.priceSelect} value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
                    {countryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <select className={styles.priceSelect}><option>Giá</option><option>Thấp đến cao</option><option>Cao đến thấp</option></select>
                  <select className={styles.priceSelect}><option>Thời gian</option><option>3 ngày</option><option>7 ngày</option></select>
                  <button className={styles.priceFilterBtn}>CSV</button>
                </div>
                <div className={styles.priceNote}>Tỉ lệ thành công SMS được tính trong 3 ngày gần nhất</div>
                <div className={styles.priceTableWrapper}>
                  <table className={styles.priceTable}>
                    <thead>
                      <tr>
                        <th className={`sortable ${priceSortBy==='service' ? 'sorted' : ''}`} onClick={() => {setPriceSortBy('service');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>Dịch vụ</th>
                        <th className={`sortable ${priceSortBy==='country' ? 'sorted ' + (priceSortOrder==='desc' ? 'sorted-desc' : 'sorted-asc') : ''}`} onClick={() => {setPriceSortBy('country');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>Quốc gia</th>
                        <th>Nhà mạng</th>
                        <th className={`sortable ${priceSortBy==='rate' ? 'sorted ' + (priceSortOrder==='desc' ? 'sorted-desc' : 'sorted-asc') : ''}`} onClick={() => {setPriceSortBy('rate');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>Tỉ lệ</th>
                        <th>Số lượng</th>
                        <th className={`sortable ${priceSortBy==='price' ? 'sorted ' + (priceSortOrder==='desc' ? 'sorted-desc' : 'sorted-asc') : ''}`} onClick={() => {setPriceSortBy('price');setPriceSortOrder(priceSortOrder==='desc'?'asc':'desc')}}>Giá</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPriceData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.service}</td>
                          <td><span className={styles.flag}>{row.flag}</span> {row.country}</td>
                          <td>{row.operator}</td>
                          <td>{row.rate !== null ? row.rate + '%' : 'n/a'}</td>
                          <td>{row.pcs}</td>
                          <td>{row.price}₽</td>
                          <td><button className={styles.buyBtn}>Mua</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {priceTab === 'stats' && (
              <div className={styles.priceStatsBox}>
                <div className={styles.priceStatsTitle}>Thống kê dịch vụ (dữ liệu mẫu)</div>
            
                <div className={styles.statsChartHeaderGrid}>
                  <div className={styles.statsChartHeaderCol}>
                    <span className={styles.statsChartHeaderLabel}>Tỉ lệ thành công</span>
                    <span className={styles.statsChartHeaderCell} onClick={() => {setStatsSortBy('rate');setStatsSortOrder(statsSortOrder==='desc'?'asc':'desc')}}>
                      (%) {statsSortBy==='rate' ? (statsSortOrder==='desc'?'▼':'▲') : ''}
                    </span>
                  </div>
                  <div className={styles.statsChartHeaderCol}>
                    <span className={styles.statsChartHeaderLabel}>Giá số</span>
                    <span className={styles.statsChartHeaderCell} onClick={() => {setStatsSortBy('price');setStatsSortOrder(statsSortOrder==='desc'?'asc':'desc')}}>
                      (₽) {statsSortBy==='price' ? (statsSortOrder==='desc'?'▼':'▲') : ''}
                    </span>
                  </div>
                </div>
                <div className={styles.statsChartList}>
                  {sortedStatsData.map((row, idx) => {
                    // Tính % chiều dài bar cho giá
                    const minPrice = Math.min(...sortedStatsData.map(r => r.price));
                    const maxPrice = Math.max(...sortedStatsData.map(r => r.price));
                    const pricePercent = ((row.price - minPrice) / (maxPrice - minPrice + 1e-6)) * 100;
                    return (
                      <div className={styles.statsChartRow} key={idx}>
                        <div className={styles.statsChartInfo}>
                          <span className={styles.flag}>{row.flag}</span>
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
                              <div className="statsTooltip">Tỉ lệ thành công: {row.rate}%</div>
                            )}
                          </div>
                          <div className={styles.statsBarWrap}>
                            <div
                              className={styles.statsBarBlue}
                              style={{width: `${pricePercent}%`}}
                              onMouseEnter={() => setHoveredBar(`price${idx}`)}
                              onMouseLeave={() => setHoveredBar(null)}
                            ></div>
                            <span className={styles.statsBarValueRight}>{row.price}₽</span>
                            {hoveredBar === `price${idx}` && (
                              <div className="statsTooltip">Giá số: {row.price}₽</div>
                            )}
                          </div>
                        </div>
                        <button className={styles.statsBuyBtn}>Mua</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
        )}
      </div>
    </div>
  );
}

export default MainContent;
