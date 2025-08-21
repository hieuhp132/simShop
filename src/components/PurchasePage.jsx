import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../apiConfig.js';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import styles from './PurchasePage.module.css';

const PurchasePage = forwardRef(({ user, setActivePage }, ref) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!user?._id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/api/orders/${user._id}`);

      if (response.data?.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        alert(t('alert_server_not_available'));
      } else {
        alert(t('alert_cannot_get_sms'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Expose refreshOrders method to parent component
  useImperativeHandle(ref, () => ({
    refreshOrders: fetchOrders
  }));

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const orderStatusConfig = {
      active: { color: '#22c55e', bg: '#dcfce7', text: t('order_status_active') },
      completed: { color: '#2563eb', bg: '#dbeafe', text: t('order_status_completed') },
      expired: { color: '#ef4444', bg: '#fee2e2', text: t('order_status_expired') },
      pending: { color: '#f59e0b', bg: '#fef3c7', text: t('order_status_pending') },
    };

    const config = orderStatusConfig[status] || orderStatusConfig['pending'];

    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: config.color,
          backgroundColor: config.bg,
          border: `1px solid ${config.color}33`,
        }}
      >
        {config.text}
      </span>
    );
  };

  const handleViewSms = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await apiClient.post(`/api/orders/${order._id}/sms`, {});

      if (response.data?.success) {
        setOtpCode(response.data.otpCode || '');
        setUserOtpInput('');
        setShowSmsModal(true);
      } else {
        alert(t('alert_cannot_get_sms'));
      }
    } catch (error) {
      console.error('Error fetching SMS:', error);
      alert(t('alert_cannot_get_sms'));
    }
  };

  const handleRenewOrder = async (orderId) => {
    try {
      const response = await apiClient.patch(`/api/orders/${orderId}/status`, { status: 'active' });

      if (response.data?.success) {
        alert(t('alert_renew_success'));
        await fetchOrders();
      } else {
        alert(t('alert_renew_failure'));
      }
    } catch (error) {
      console.error('Error renewing order:', error);
      alert(t('alert_cannot_renew'));
    }
  };

  const handleConfirmOtp = async () => {
    if (!selectedOrder) {
      alert(t('alert_no_order_selected'));
      return;
    }
    if (userOtpInput.trim() === '') {
      alert(t('alert_enter_otp'));
      return;
    }
    if (userOtpInput !== otpCode) {
      alert(t('alert_wrong_otp'));
      return;
    }

    setOtpLoading(true);
    try {
      const response = await apiClient.patch(`/api/orders/${selectedOrder._id}/status`, { status: 'active' });

      if (response.data?.success) {
        alert(t('alert_order_activated'));
        setShowSmsModal(false);
        await fetchOrders();
      } else {
        alert(t('alert_cannot_activate_order'));
      }
    } catch (error) {
      console.error('Error activating order:', error);
      alert(t('alert_cannot_activate_order'));
    } finally {
      setOtpLoading(false);
    }
  };

  const renderOrderCard = (order) => (
    <div key={order._id} className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div className={styles.orderInfo}>
          <h3 className={styles.orderTitle}>
            {order.service} - {order.country}
          </h3>
          <p className={styles.orderSubtitle}>
            {t('purchase_phone')}: <strong>{order.phoneNumber || 'N/A'}</strong>
          </p>
        </div>
        <div className={styles.orderStatus}>{getStatusBadge(order.status)}</div>
      </div>

      <div className={styles.orderDetails}>
        <div className={styles.orderDetail}>
          <span className={styles.detailLabel}>{t('purchase_operator')}:</span>
          <span className={styles.detailValue}>{order.network || 'N/A'}</span>
        </div>
        <div className={styles.orderDetail}>
          <span className={styles.detailLabel}>{t('purchase_cost')}:</span>
          <span className={styles.detailValue}>
            {typeof order.price === 'number' ? order.price.toLocaleString() : 'N/A'}{' '}
            {order.currency || ''}
          </span>
        </div>
        <div className={styles.orderDetail}>
          <span className={styles.detailLabel}>{t('purchase_created')}:</span>
          <span className={styles.detailValue}>{formatDate(order.createdAt)}</span>
        </div>
        {order.expiresAt && (
          <div className={styles.orderDetail}>
            <span className={styles.detailLabel}>{t('purchase_expires')}:</span>
            <span className={styles.detailValue}>{formatDate(order.expiresAt)}</span>
          </div>
        )}
        {order.smsMessages && (
          <div className={styles.orderDetail}>
            <span className={styles.detailLabel}>{t('purchase_sms_received')}:</span>
            <span className={styles.detailValue}>{order.smsMessages.length} {t('messages')}</span>
          </div>
        )}
      </div>

      {order.status === 'pending' && (
        <div className={styles.orderActions}>
          <button className={styles.actionBtn} onClick={() => handleViewSms(order)}>
            {t('get_otp_code')}
          </button>
          <button className={styles.actionBtn} onClick={() => handleRenewOrder(order._id)}>
            {t('extend')}
          </button>
        </div>
      )}
    </div>
  );

  const renderSmsModal = () => (
    <div className={styles.modalOverlay} onClick={() => setShowSmsModal(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{t('sms_messages')} - {selectedOrder?.phoneNumber}</h3>
          <button className={styles.closeBtn} onClick={() => setShowSmsModal(false)}>
            ×
          </button>
        </div>

        <div className={styles.smsList}>
          {selectedOrder?.smsMessages?.length > 0 ? (
            selectedOrder.smsMessages.map((sms, index) => (
              <div key={index} className={styles.smsItem}>
                <div className={styles.smsHeader}>
                  <span className={styles.smsSender}>{sms.sender}</span>
                  <span className={styles.smsTime}>{formatDate(sms.receivedAt)}</span>
                </div>
                <div className={styles.smsMessage}>{sms.message}</div>
              </div>
            ))
          ) : (
            <div className={styles.noSms}>{t('no_sms_messages')}</div>
          )}

          {/* OTP & input người dùng */}
          <div className={styles.smsItem}>
            <p>
              <strong>{t('otp_label')}</strong> {otpCode || t('no_otp')}
            </p>

            <label>{t('enter_otp_to_activate')}:</label>
            <input
              type="text"
              value={userOtpInput}
              onChange={(e) => setUserOtpInput(e.target.value)}
              className={styles.otpInput}
              placeholder={t('otp_placeholder')}
              disabled={otpLoading}
            />
            <button onClick={handleConfirmOtp} disabled={otpLoading} className={styles.actionBtn}>
              {otpLoading ? t('otp_confirming') : t('otp_confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = (isActive) => {
    if (!user) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔐</div>
          <h3 className={styles.emptyTitle}>{t('please_login')}</h3>
          <p className={styles.emptyDescription}>
            {t('login_to_view_orders')}
          </p>
          <button 
            className={styles.loginPromptBtn} 
            onClick={() => setActivePage('login')}
          >
            {t('login_now')}
          </button>
        </div>
      );
    }

    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>{isActive ? '📱' : '📋'}</div>
        <h3 className={styles.emptyTitle}>
          {isActive ? t('no_active_orders') : t('no_order_history')}
        </h3>
        <p className={styles.emptyDescription}>
          {isActive ? t('order_description') : t('completed_orders_description')}
        </p>
        {isActive && (
          <div className={styles.emptySteps}>
            <h4>{t('how_to_buy_guide')}:</h4>
            <ol>
              <li>
                <strong>{t('recharge')}:</strong> {t('recharge_description')}
              </li>
              <li>
                <strong>{t('select_service')}:</strong> {t('select_service_description')}
              </li>
              <li>
                <strong>{t('select_country')}:</strong> {t('select_country_description')}
              </li>
              <li>
                <strong>{t('buy_number')}:</strong> {t('buy_number_description')}
              </li>
            </ol>
          </div>
        )}
      </div>
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active') {
      return order.status === 'active' || order.status === 'pending';
    }
    return order.status === 'completed' || order.status === 'expired';
  });

  return (
    <div className={styles.purchaseWrapper}>
      <div className={styles.purchaseCard}>
        <div className={styles.purchaseHeader}>
          <div className={styles.headerTop}>
            <button className={styles.backBtn} onClick={() => setActivePage('nav_home')}>
              <FaArrowLeft /> {t('back')}
            </button>
            <button className={styles.buyNewBtn} onClick={() => setActivePage('nav_home')}>
              <FaPlus /> {t('buy_new_number')}
            </button>
          </div>
          <h2 className={styles.purchaseTitle}>{t('order_management')}</h2>
          <p className={styles.purchaseSubtitle}>
            {t('order_management_description')}
          </p>
        </div>

        <div className={styles.purchaseTabs}>
          <button
            className={`${styles.purchaseTab} ${
              activeTab === 'active' ? styles.purchaseTabActive : ''
            }`}
            onClick={() => setActiveTab('active')}
          >
            {t('purchase_active_orders')} ({orders.filter((o) => o.status === 'active' || o.status === 'pending').length})
          </button>
          <button
            className={`${styles.purchaseTab} ${
              activeTab === 'history' ? styles.purchaseTabActive : ''
            }`}
            onClick={() => setActiveTab('history')}
          >
            {t('purchase_order_history')} ({orders.filter((o) => o.status === 'completed' || o.status === 'expired').length})
          </button>
        </div>

        <div className={styles.purchaseContent}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>{t('loading')}</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className={styles.ordersList}>{filteredOrders.map(renderOrderCard)}</div>
          ) : (
            renderEmptyState(activeTab === 'active')
          )}
        </div>
      </div>

      {showSmsModal && renderSmsModal()}
    </div>
  );
});

export default PurchasePage;