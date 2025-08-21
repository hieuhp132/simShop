import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../apiConfig.js';
import io from 'socket.io-client';
import styles from './PaymentPage.module.css';
import { BalanceContext } from './TopNav';
import { API_BASE_URL } from '../apiConfig.js';

import sepayIcon from '../assets/icons/sepay.png';
import visaIcon from '../assets/icons/visa.png';

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
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');

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
      const res = await apiClient.get(`/api/payment/history/${user._id}`);
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

  const generateRandomHex = (length) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const paymentStateTest = async () => {
    try {
      const idTestOrder = '8a3ee20a80458ff1f20bfbcad49fa98f';
      setQrState('waiting');
      
      // Test socket connection first
      console.log('🔌 Testing socket connection...');
      if (!socketRef.current) {
        socketRef.current = io(API_BASE_URL, { transports: ['websocket'] });
        
        socketRef.current.on('connect', () => {
          console.log('✅ Socket connected successfully!');
          console.log('🔌 Socket ID:', socketRef.current.id);
          socketRef.current.emit('join_user_room', user._id);
          console.log('👤 Joined user room:', user._id);
        });

        socketRef.current.on('payment_success', (data) => {
          console.log('🎉 Payment success event received:', data);
          if (data.userId === user._id) {
            console.log('✅ Payment success confirmed for user:', user._id);
            handlePaymentSuccess();
          } else {
            console.log('⚠️ Payment success for different user:', data.userId);
          }
        });

        socketRef.current.on('disconnect', () => {
          console.log('🔌 Socket disconnected');
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
        });
      } else {
        console.log('🔌 Socket already connected, ID:', socketRef.current.id);
      }

      const res = await apiClient.post('/api/payment/sepay/check-payment-status', {
        orderId: idTestOrder,
      });

      if(res.data?.success) {
        console.log("✅ Đơn đã thanh toán, chờ xác nhận từ socket...");
        console.log("🔍 Socket status:", socketRef.current ? 'Connected' : 'Not connected');
        console.log("🔍 Socket ID:", socketRef.current?.id);
      }

    } catch (err) {
      console.error('❌ paymentStateTest error:', err);
    }
  };

  // Tạo đơn thanh toán SePay
  const createPayment = async () => {
    try {
      // 1. Tạo socket connection TRƯỚC khi tạo payment
      if (!socketRef.current) {
        console.log('🔌 Creating socket connection for payment...');
        socketRef.current = io(API_BASE_URL, { transports: ['websocket'] });
        
        socketRef.current.on('connect', () => {
          console.log('✅ Socket connected, joining user room:', user._id);
          socketRef.current.emit('join_user_room', user._id);
        });

        socketRef.current.on('payment_success', (data) => {
          console.log('📡 Received payment_success event:', data);
          if (data.userId === user._id) {
            console.log('✅ Payment success confirmed for user:', user._id);
            handlePaymentSuccess();
          } else {
            console.log('⚠️ Payment success for different user:', data.userId);
          }
        });

        socketRef.current.on('disconnect', () => {
          console.log('🔌 Socket disconnected');
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
        });
      } else {
        console.log('🔌 Socket already connected, ID:', socketRef.current.id);
      }

      // 2. Đợi socket connect xong (nếu cần)
      if (socketRef.current && !socketRef.current.connected) {
        console.log('⏳ Waiting for socket to connect...');
        await new Promise((resolve) => {
          socketRef.current.once('connect', resolve);
          // Timeout sau 5s
          setTimeout(resolve, 5000);
        });
      }

      // 3. Tạo payment
      const orderId = generateRandomHex(16);
      const newDesc = `NAPTIEN${orderId}`;
      setDescription(newDesc);
      
      console.log('📤 Creating payment with orderId:', orderId);
      const res = await apiClient.post('/api/payment/sepay', {
        userId: user._id,
        amount: amount,
        description: newDesc,
      });

      if (res.data?.success && res.data?.orderId && res.data?.qrImageUrl && res.data?.account && res.data?.bank) {
        setCurrentOrderId(res.data.orderId);
        setQrImageUrl(res.data.qrImageUrl);
        setAccount(res.data.account);
        setBank(res.data.bank);
        setQrState('waiting');

        console.log('✅ Payment created successfully, waiting for webhook...');
        console.log('🔍 Socket status:', socketRef.current?.connected ? 'Connected' : 'Not connected');
        console.log('🔍 Socket ID:', socketRef.current?.id);

        // 4. Check payment status (optional)
        const webhooks = await apiClient.post('/api/payment/sepay/check-payment-status', {
          orderId: res.data.orderId,
        });

        if(webhooks.data?.success) {
          console.log("✅ Đơn đã thanh toán, chờ xác nhận từ socket...");
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
      icon: visaIcon,
      label: 'Pay using Visa/Mastercard cards',
      desc: 'Visa, Mastercard, MIR',
      detail: () => (
        <div style={{ textAlign: 'center' }}>
          <button disabled={!user} className={styles['disabled-button']}>
            Thanh toán qua thẻ Visa/Mastercard
          </button>
          {!user && <div className={styles['login-required']}>{t('login_required')}</div>}
        </div>
      ),
    },
    {
      key: 'sepay',
      icon: sepayIcon,
      label: 'Sepay',
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
          {!user && <div className={styles['login-required']}>{t('login_required')}</div>}
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
          {!user && <div className={styles['login-required']}>{t('login_required')}</div>}
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
          {!user && <div className={styles['login-required']}>{t('login_required')}</div>}
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
            {loadingTx ? t('loading') : transactions.length === 0 ? t('no_transactions') : (
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
                <button onClick={createPayment} className={styles['primary-btn']}>{t('test_payment_success')}</button>
                <button onClick={closeQrModal} className={styles['cancel-btn']}>{t('cancel')}</button>
              </>
            )}

            {qrState === 'waiting' && (
              <>
                <img
                  src={qrImageUrl}
                  alt="QR"
                  loading="lazy"
                  style={{ maxWidth: 180 }}
                />
                <div><b>Ngân hàng:</b> {bank}</div>
                <div><b>Số tài khoản:</b> {account}</div>
                <div><b>Nội dung:</b> {description}</div>
                <div className={styles['waiting-text']}>
                  <span className={styles['spinner']} /> {t('waiting_payment')}
                </div>

                {/* 🧪 Test buttons - Dev only */}
                {process.env.NODE_ENV === 'development' && currentOrderId && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={async () => {
                        try {
                          const response = await apiClient.post('/api/payment/sepay/test-webhook', {
                            orderId: currentOrderId,
                            amount,
                          }, { withCredentials: true });
                          if (response.data?.success) {
                            alert(t('alert_test_webhook_success'));
                            handlePaymentSuccess();
                          } else {
                            alert(t('alert_test_webhook_failed'));
                          }
                        } catch (err) {
                          console.error(err);
                          alert(t('alert_test_webhook_failed'));
                        }
                      }}
                      className={styles['test-webhook-btn']}
                      style={{ marginRight: '10px' }}
                    >
                      Test Webhook
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log('🧪 Manually triggering payment_success event...');
                        if (socketRef.current) {
                          socketRef.current.emit('payment_success', {
                            userId: user._id,
                            orderId: currentOrderId,
                          });
                          console.log('📡 Manual event emitted');
                        } else {
                          console.log('❌ Socket not connected');
                        }
                      }}
                      className={styles['test-webhook-btn']}
                    >
                      Test Socket Event
                    </button>
                  </div>
                )}

                <button onClick={closeQrModal} className={styles['cancel-btn']}>Hủy</button>
              </>
            )}

            {qrState === 'success' && (
              <>
                <h3>Thanh toán thành công!</h3>
                <button onClick={closeQrModal} className={styles['primary-btn']}>{t('close')}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
