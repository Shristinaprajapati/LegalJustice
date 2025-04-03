import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import axios from 'axios';
import io from 'socket.io-client';
import { MdAccountCircle, MdCalendarToday, MdCreditCard, MdClose } from "react-icons/md";
import { FaMoneyBillAlt, FaFileInvoiceDollar } from "react-icons/fa";
import 'font-awesome/css/font-awesome.min.css'; 
import { Icon } from "@iconify/react";
import PaymentTab from './PaymentTab';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', clientId: '' });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const socket = useRef(null); 
  const [activeTab, setActiveTab] = useState("profile"); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
  
      axios
        .get('http://localhost:8080/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const user = response.data;
          setUserData({ name: user.name, email: user.email, clientId: user.clientId });
  
          socket.current = io('ws://localhost:8080');
  
          socket.current.emit('register', user.clientId);
  
          socket.current.on('receiveNotification', (notificationData) => {
            setNotifications((prevNotifications) => {
              const isDuplicate = prevNotifications.some(
                (notification) => notification.message === notificationData.message
              );
              return isDuplicate ? prevNotifications : [notificationData, ...prevNotifications];
            });
          });
  
          axios
            .get(`http://localhost:8080/api/notifications/${user.clientId}`)
            .then((response) => {
              const notificationsFromDb = response.data.notifications;
              setNotifications((prevNotifications) => {
                const newNotifications = notificationsFromDb.filter((newNotification) =>
                  !prevNotifications.some((existingNotification) => 
                    existingNotification.message === newNotification.message
                  )
                );
                return [...newNotifications, ...prevNotifications];
              });
            })
            .catch((error) => {
              console.error('Error fetching notifications:', error);
            });
  
          axios
            .get(`http://localhost:8080/api/bookings/client/${user.clientId}`)
            .then((response) => {
              setBookings(response.data.bookings);
            })
            .catch((error) => {
              console.error('Error fetching bookings:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [setShowNotifications, setNotifications]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate('/login');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleViewAllNotifications = () => {
    setIsOpen(true); // Open the sidebar
    setActiveTab("notification"); // Switch to notification tab
    setShowNotifications(false); // Close the dropdown
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/Images/logo1.png" alt="Legal Justice Logo" />
      </div>
      <nav className={isOpen ? styles.navOpen : ''}>
        <ul className={styles.navLinks}>
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/service" onClick={() => setIsOpen(false)}>Services</Link></li>
          <li><Link to="/practice-areas" onClick={() => setIsOpen(false)}>Practice Areas</Link></li>
          <li><Link to="/aboutus" onClick={() => setIsOpen(false)}>About</Link></li>
          <li><Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
          <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
        </ul>
      </nav>

      <div className={styles.notificationIcon} onClick={toggleNotifications}>
        <i className={`fa fa-bell ${styles.bellIcon}`} />
        {notifications.length > 0 && (
          <span className={styles.notificationBadge}>
            {notifications.length}
          </span>
        )}
        {showNotifications && (
          <div className={`${styles.notificationsDropdown} ${showNotifications ? styles.show : ''}`}>
            <div className={styles.notificationHeader}>
              <span className={styles.notificationTitle}>Notifications 🔔</span>
            </div>
            <ul className={styles.notificationList}>
              {notifications.slice(0, 5).map((notification, index) => {
                let formattedDate = '';
                try {
                  if (notification.timestamp) {
                    const dateObj = new Date(notification.timestamp);
                    formattedDate = dateObj.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                  }
                } catch (e) {
                  formattedDate = new Date().toLocaleString();
                }

                return (
                  <li 
                    key={index} 
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                  >
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationMessage}>
                        {notification.message}
                        {notification.type === 'document' && (
                          <span className={styles.documentBadge}>Document</span>
                        )}
                      </p>
                      <div className={styles.notificationMeta}>
                        <span className={styles.notificationTime}>
                          {formattedDate}
                        </span>
                        {notification.redirectUrl && (
                          <div className={styles.notificationActions}>
                            <a 
                              href={notification.redirectUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.notificationLink}
                            >
                              <button className={styles.notificationButton}>
                                {notification.buttonText || 'View'}
                              </button>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className={styles.notificationFooter}>
              <button 
                className={styles.notificationViewAll}
                onClick={handleViewAllNotifications}
              >
                View All Notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoggedIn ? (
        <div
          className={`${styles.profileSection} ${isOpen ? styles.active : ''}`}
          onClick={toggleMenu}
        >
          <div className={styles.profileAvatar}>
            <img src="/Images/profile1.png" alt="Profile Avatar" />
          </div>

          {isOpen && (
            <div className={styles.overlay} onClick={handleClose}>
              <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
                <div className={styles.iconBarWrapper}>
                  <div className={styles.iconBar}>
                    <div className={styles.icon} onClick={handleClose}>
                      <Icon icon="mdi:close" />
                    </div>
                    <div className={styles.icon} onClick={() => setActiveTab("profile")}>
                      <Icon icon="mdi:account-circle-outline" />
                    </div>
                    <div className={styles.icon} onClick={() => setActiveTab("booking")}>
                      <Icon icon="mdi:calendar-check-outline" />
                    </div>
                    <div className={styles.icon} onClick={() => setActiveTab("payment")}>
                      <Icon icon="mdi:credit-card-outline" />
                    </div>
                    <div className={styles.icon} onClick={() => setActiveTab("notification")}>
                      <Icon icon="mdi:bell-outline" />
                    </div>
                  </div>
                </div>

                <div className={styles.content}>
                  {activeTab === "profile" && (
                    <ul className={styles.menu}>
                      <li className={styles.profileSection}>
                        <div className={styles.profileContent}>
                          <Icon icon="mdi:account-circle-outline" className={styles.profileIcon} />
                          <div className={styles.profileText}>
                            <strong className={styles.profileName}>{userData.name}</strong>
                            <p className={styles.profileEmail}>{userData.email}</p>
                          </div>
                        </div>
                      </li>

                      <li
                        className={styles.settingsSection}
                        onClick={() => setActiveSubTab(activeSubTab === "settings" ? null : "settings")}
                      >
                        <div className={styles.settingsContent}>
                          <div className={styles.settingsTitle}>
                            <Icon icon="mdi:cog-outline" className={styles.settingsIcon} />
                            <h2 className={styles.sectionTitle}>Settings</h2>
                          </div>
                        </div>
                      </li>

                      {activeSubTab === "settings" && (
                        <li className={styles.settingsDetails}>
                          <div className={styles.settingsText}>
                            <label className={styles.inputLabel}>Reset Password:</label>
                            <input type="password" placeholder="Enter new password" className={styles.inputField} />
                            <button className={styles.saveBtn}>Change Password</button>
                          </div>
                        </li>
                      )}

                      <li onClick={handleLogout} className={styles.logout}>
                        Logout
                      </li>
                    </ul>
                  )}

                  {activeTab === "booking" && (
   <div className={styles.section}>
   <h2 className={styles.sectionTitle}>Your Bookings</h2>
   {loading ? (
     <p className={styles.loading}>Loading bookings...</p>
   ) : error ? (
     <p className={styles.error}>{error}</p>
   ) : bookings.length === 0 ? (
     <p className={styles.noBookings}>No bookings found.</p>
   ) : (
     <div className={styles.bookingList}>
       {bookings.map((booking) => (
         <div key={booking._id} className={styles.bookingCard}>
           <h3 className={styles.serviceTitle}>
             {booking.service?.title || "Consulting Appointment"}
           </h3>
           {booking.date && (
             <p className={styles.bookingDate}>
               <Icon icon="mdi:calendar-month-outline" /> {new Date(booking.date).toDateString()}
             </p>
           )}
           {booking.timeSlot && (
             <p className={styles.bookingTime}>
               <Icon icon="mdi:clock-outline" /> {booking.timeSlot}
             </p>
           )}
           <p className={`${styles.bookingStatus} ${styles[booking.status.toLowerCase()]}`}>
             {booking.status}
           </p>
         </div>
       ))}
     </div>
   )}
 </div>
 
                  )}

                  {activeTab === "payment" && (
                    <PaymentTab clientId={userData.clientId} />
                  )}

{activeTab === "notification" && (
  <div className={styles.notificationTab}>
    <h2 className={styles.sectionTitle}>All Notifications</h2>
    {notifications.length === 0 ? (
      <p className={styles.noNotifications}>No notifications found.</p>
    ) : (
      <div className={styles.notificationScrollContainer}>
        <ul className={styles.fullNotificationList}>
          {notifications.map((notification, index) => {
            let formattedDate = '';
            try {
              if (notification.timestamp) {
                const dateObj = new Date(notification.timestamp);
                formattedDate = dateObj.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });
              }
            } catch (e) {
              formattedDate = new Date().toLocaleString();
            }

            return (
              <li 
                key={index} 
                className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
              >
                <div className={styles.notificationContent}>
                  <p className={styles.notificationMessage}>
                    {notification.message}
                    {notification.type === 'document' && (
                      <span className={styles.documentBadge}>Document</span>
                    )}
                  </p>
                  <div className={styles.notificationMeta}>
                    <span className={styles.notificationTime}>
                      {formattedDate}
                    </span>
                    {notification.redirectUrl && (
                      <div className={styles.notificationActions}>
                        <a 
                          href={notification.redirectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.notificationLink}
                        >
                          <button className={styles.notificationButton}>
                            {notification.buttonText || 'View'}
                          </button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    )}
  </div>
)}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.authButtons}>
          <button className={styles.loginBtn}>
            <Link to="/login">Login</Link>
          </button>
          <button className={styles.signupBtn}>
            <Link to="/signup">SignUp</Link>
          </button>
        </div>
      )}

      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
    </header>
  );
};

export default Header;