import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import styles from './AdminDashboard.module.css';
import { io } from 'socket.io-client';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationPanelRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const socket = io('http://localhost:8080');

    // Register admin (use dynamic ID if needed)
    socket.emit('register', '674952ba89c4cfb98008666d');

    // Listen for incoming notifications
    socket.on('adminNotification', (notification) => {
      const formattedNotification = {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt,
        timestamp: new Date(notification.createdAt).toLocaleTimeString(),
        read: false,
      };

      setNotifications((prev) => [formattedNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Fetch all notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetched = response.data.data.map((notif) => ({
          ...notif,
          timestamp: new Date(notif.createdAt).toLocaleTimeString(),
        }));

        setNotifications(fetched);
        setUnreadCount(fetched.filter((n) => !n.read).length);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/admin/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.notificationWrapper}>
      <button
        className={styles.notificationButton}
        onClick={() => setShowNotifications((prev) => !prev)}
      >
        <FaBell className={styles.notificationIcon} />
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className={styles.notificationDropdown} ref={notificationPanelRef}>
          <div className={styles.notificationHeader}>
            <h4>Notifications</h4>
          </div>

          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification._id);
                  }
                }}
              >
                <div className={styles.notificationContent}>
                  <h5>{notification.title}</h5>
                  <p>{notification.message}</p>
                  <small>{notification.timestamp}</small>
                </div>
                {!notification.read && (
                  <div className={styles.unreadIndicator}></div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noNotifications}>No notifications yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
