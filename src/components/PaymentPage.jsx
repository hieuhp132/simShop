import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './PaymentPage.module.css';
import { BalanceContext } from './TopNav';
import { API_BASE_URL } from '../apiConfig';

const defaultIcon = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';

export default function PaymentPage({ user }) {
  const { t } = useTranslation();
  const { balance, currency, fetchBalance } = useContext(BalanceContext);

  const [activeTab, setActiveTab] = useState('recharge');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const [amount, setAmount] = useState(1000);
  const [description, setDescription] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrState, setQrState] = useState('enter-amount'); // enter-amount | waiting | success
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const socketRef = useRef(null);

  // Đóng modal, reset trạng thái và disconnect socket nếu có
  const closeQrModal = () => {
    setShowQrModal(false);
    setQrState('enter-amount');
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  // Hàm gọi lại API lấy lịch sử giao dịch của user
  const fetchTransactions = async () => {
    try {
      setLoadingTx(true);
      const res = await axios.get(`${API_BASE_URL}/api/payment/history/${user._id}`);
      if (res.data?.success && res.data?.transactions) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error('❌ fetchTransactions error:', err);
    } finally {
      setLoadingTx(false);
    }
  };

  // Khi thanh toán thành công
  const handlePaymentSuccess = () => {
    fetchBalance();
    setQrState('success');

    // Nếu đang ở tab lịch sử thì load lại
    if (activeTab === 'history') {
      fetchTransactions();
    }

    // Đóng modal sau 3s
    setTimeout(() => {
      closeQrModal();
    }, 3000);
  };

  // Tạo đơn thanh toán SePay
  const createPayment = async () => {
    try {
      const newDesc = `NAPTIEN-${Date.now()}-${user._id}`;
      setDescription(newDesc);
      const res = await axios.post(`${API_BASE_URL}/api/payment/sepay`, {
        userId: user._id,
        amount,
        description: newDesc,
      });

      if (res.data?.success && res.data?.orderId) {
        setCurrentOrderId(res.data.orderId);
        setQrState('waiting');

        if (!socketRef.current) {
          socketRef.current = io(API_BASE_URL, { transports: ['websocket'] });
          socketRef.current.on('connect', () => {
            socketRef.current.emit('join', user._id);
          });
          socketRef.current.on('payment_success', (data) => {
            if (data.userId === user._id) {
              handlePaymentSuccess();
            }
          });
        }
      }
    } catch (err) {
      console.error('❌ createPayment error:', err);
    }
  };

  // Tự động gọi khi unmount component
  useEffect(() => () => closeQrModal(), []);

  // Tự động load lịch sử khi chuyển tab và có user
  useEffect(() => {
    if (activeTab === 'history' && user?._id) {
      fetchTransactions();
    }
  }, [activeTab, user]);

  const paymentMethods = [
    {
      key: 'card',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg',
      label: 'Pay using Visa/Mastercard cards',
      desc: 'Visa, Mastercard, MIR',
      detail: () => (
        <div style={{ textAlign: 'center' }}>
          <button disabled={!user} className={styles['disabled-button']}>
            Thanh toán qua thẻ Visa/Mastercard
          </button>
          {!user && <div className={styles['login-required']}>Bạn cần đăng nhập để thực hiện thanh toán</div>}
        </div>
      ),
    },
    {
      key: 'sepay',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/SePay_logo.svg/120px-SePay_logo.svg.png',
      label: 'Pay with SePay QR',
      desc: 'QR chuyển khoản ngân hàng qua SePay',
      detail: () => (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              setQrState('enter-amount');
              setShowQrModal(true);
            }}
            disabled={!user}
            className={styles['sepay-btn']}
          >
            Nạp qua SePay QR
          </button>
          {!user && <div className={styles['login-required']}>Bạn cần đăng nhập để thực hiện thanh toán</div>}
        </div>
      ),
    },
    {
      key: 'crypto_main',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bitcoin.svg',
      label: 'Pay with crypto 23 coins (main)',
      desc: 'BTC, ETH, USDT, ...',
      detail: () => (
        <div style={{ textAlign: 'center' }}>
          <button disabled={!user} className={styles['disabled-button']}>
            Thanh toán bằng Crypto
          </button>
          {!user && <div className={styles['login-required']}>Bạn cần đăng nhập để thực hiện thanh toán</div>}
        </div>
      ),
    },
    {
      key: 'other',
      icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png',
      label: 'Other payment methods',
      desc: 'More options',
      detail: () => (
        <div style={{ textAlign: 'center' }}>
          <button disabled={!user} className={styles['disabled-button']}>
            Liên hệ hỗ trợ
          </button>
          {!user && <div className={styles['login-required']}>Bạn cần đăng nhập để thực hiện thanh toán</div>}
        </div>
      ),
    },
  ];

  return (
    <div className={styles['payment-wrapper']}>
      <div className={styles['payment-card-box']} style={{ maxWidth: 600 }}>
        {/* Tabs */}
        <div className={styles['tabs']}>
          <button
            onClick={() => setActiveTab('recharge')}
            className={activeTab === 'recharge' ? styles['tab-active'] : styles['tab-inactive']}
          >
            {t('recharge')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? styles['tab-active'] : styles['tab-inactive']}
          >
            {t('history')}
          </button>
        </div>

        {/* Nội dung tab */}
        {activeTab === 'recharge' && (
          <div className={styles['recharge-list']}>
            {paymentMethods.map((method) => (
              <div key={method.key} className={styles['recharge-item']}>
                <div
                  className={styles['accordion-header']}
                  onClick={() => setOpenAccordion(openAccordion === method.key ? null : method.key)}
                >
                  <img src={method.icon || defaultIcon} alt={method.label} className={styles['payment-icon']} />
                  <div style={{ flex: 1 }}>
                    <div className={styles['accordion-title']}>{method.label}</div>
                    <div className={styles['accordion-desc']}>{method.desc}</div>
                  </div>
                  <span style={{ fontSize: 20 }}>{openAccordion === method.key ? '▲' : '▼'}</span>
                </div>
                {openAccordion === method.key && (
                  <div className={styles['accordion-detail']}>{method.detail(t)}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles['history-list']}>
            {loadingTx ? 'Đang tải...' : transactions.length === 0 ? 'Chưa có giao dịch nào.' : (
              transactions.map(tx => (
                <div key={tx._id} className={styles['history-item']}>
                  <div><b>Ngày:</b> {new Date(tx.transaction_date).toLocaleString()}</div>
                  <div><b>Số tiền nạp:</b> {tx.amount_in} | <b>Số dư sau:</b> {tx.accumulated}</div>
                  <div><b>Nội dung:</b> {tx.transaction_content}</div>
                  <div><b>Mã giao dịch:</b> {tx.code}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* QR Modal giữ nguyên */}
      {showQrModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-box']}>
            {qrState === 'enter-amount' && (
              <>
                <h3>Nạp tiền qua SePay QR</h3>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className={styles['amount-input']}
                />
                <button onClick={createPayment} className={styles['primary-btn']}>Tạo mã QR</button>
                <button onClick={closeQrModal} className={styles['cancel-btn']}>Hủy</button>
              </>
            )}

            {qrState === 'waiting' && (
              <>
                <img
                  src={`https://qr.sepay.vn/img?acc=VQRQADLIA6895&bank=MBBank&amount=${amount}&des=${description}&template=compact`}
                  alt="QR"
                  loading="lazy"
                  style={{ maxWidth: 180 }}
                />
                <div><b>Ngân hàng:</b> MBBank</div>
                <div><b>Số tài khoản:</b> VQRQADLIA6895</div>
                <div><b>Nội dung:</b> {description}</div>
                <div className={styles['waiting-text']}>
                  <span className={styles['spinner']} /> Đang chờ thanh toán...
                </div>

                {/* 🧪 Test webhook button - Dev only */}
                {process.env.NODE_ENV === 'development' && currentOrderId && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await axios.post(`${API_BASE_URL}/api/payment/sepay/test-webhook`, {
                          orderId: currentOrderId,
                          amount,
                        }, { withCredentials: true });
                        if (res.data?.success) {
                          alert('Test webhook successful!');
                          handlePaymentSuccess();
                        }
                      } catch (err) {
                        console.error(err);
                        alert('Test webhook failed.');
                      }
                    }}
                    className={styles['test-webhook-btn']}
                  >
                    Test Webhook
                  </button>
                )}

                <button onClick={closeQrModal} className={styles['cancel-btn']}>Hủy</button>
              </>
            )}

            {qrState === 'success' && (
              <>
                <h3>Thanh toán thành công!</h3>
                <button onClick={closeQrModal} className={styles['primary-btn']}>Đóng</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
