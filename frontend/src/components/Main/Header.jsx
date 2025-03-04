import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import axios from 'axios';
import io from 'socket.io-client'; // Import Socket.IO
import 'font-awesome/css/font-awesome.min.css'; 
import { Icon } from "@iconify/react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', clientId: '' });
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const [showNotifications, setShowNotifications] = useState(false); // State to control dropdown visibility
  const navigate = useNavigate();
  const socket = useRef(null); 
  const [activeTab, setActiveTab] = useState("profile"); 

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);

  useEffect(() => {
    // Check if there's a token in localStorage, meaning the user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
  
      // Fetch user details using the token for authentication
      axios
        .get('http://localhost:8080/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }, // Pass the token in the request header
        })
        .then((response) => {
          const user = response.data; // The user object returned from authentication
          setUserData({ name: user.name, email: user.email, clientId: user.clientId });  // Explicitly set clientId
  
          // Connect to the socket server after fetching user data
          socket.current = io('ws://localhost:8080');
          console.log(socket.current);
  
          // Register clientId with socket on login
          socket.current.emit('register', user.clientId);  // Emit the clientId to register the socket
  
          // Listen for 'receiveNotification' event from the backend
          socket.current.on('receiveNotification', (notificationData) => {
            console.log('Received notification:', notificationData);
  
            // Deduplicate: Check if the notification is already in the list
            setNotifications((prevNotifications) => {
              const isDuplicate = prevNotifications.some(
                (notification) => notification.message === notificationData.message
              );
  
              if (isDuplicate) {
                return prevNotifications;
              } else {
                return [notificationData, ...prevNotifications];
              }
            });
          });
  
          // Fetch notifications for the logged-in user using the clientId
          axios
            .get(`http://localhost:8080/api/notifications/${user.clientId}`)
            .then((response) => {
              // Assuming notifications are returned as an array
              const notificationsFromDb = response.data.notifications;
  
              // Deduplicate: Check if notifications are already in the state before adding
              setNotifications((prevNotifications) => {
                const newNotifications = notificationsFromDb.filter((newNotification) =>
                  !prevNotifications.some((existingNotification) => existingNotification.message === newNotification.message)
                );
  
                return [...newNotifications, ...prevNotifications]; // Add new ones first
              });
            })
            .catch((error) => {
              console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
            });
  
          // Fetch bookings for the logged-in user using the clientId
          axios
            .get(`http://localhost:8080/api/bookings/client/${user.clientId}`)
            .then((response) => {
              const bookingsFromDb = response.data.bookings;
              setBookings(bookingsFromDb);
            })
            .catch((error) => {
              console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
            });
        })
        .catch((error) => {
          console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        });
    }
  
    // Cleanup socket connection on unmount
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
    // Clear token, user data, and specific email from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('email'); // Remove specific email
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate('/login'); // Redirect to login after logout
  };

  const handleClose = () => {
    setIsOpen(false); // Assuming isOpen is controlled by state
  };

  
  

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/Images/logo1.png" alt="Legal Justice Logo" />
      </div>
      <nav className={isOpen ? styles.navOpen : ''}>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/service" onClick={() => setIsOpen(false)}>
              Services
            </Link>
          </li>
          <li>
            <Link to="/practice-areas" onClick={() => setIsOpen(false)}>
              Practice Areas
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Blog
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
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
      <ul className={styles.notificationList}>
        {notifications.slice(0, 5).map((notification, index) => (
          <li key={index} className={styles.notificationItem}>
            <p className={styles.notificationMessage}>{notification.message}</p> 
            {notification.redirectUrl && ( 
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
            )}
          </li>
        ))}
      </ul>
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
      {/* Transparent Icon Bar */}
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
        </div>
      </div>

      {/* Sidebar Content */}
      <div className={styles.content}>

{/* Profile Tab (Includes Settings) */}
{activeTab === "profile" && (
        <ul className={styles.menu}>
          {/* Profile Section */}
          <li className={styles.profileSection}>
            <div className={styles.profileContent}>
              <Icon icon="mdi:account-circle-outline" className={styles.profileIcon} />
              <div className={styles.profileText}>
                <strong className={styles.profileName}>{userData.name}</strong>
                <p className={styles.profileEmail}>{userData.email}</p>
              </div>
            </div>
          </li>

          {/* Settings Section */}
          <li
            className={styles.settingsSection}
            onClick={() => setActiveSubTab(activeSubTab === "settings" ? null : "settings")} // Toggle logic
          >
            <div className={styles.settingsContent}>
              <div className={styles.settingsTitle}>
                <Icon icon="mdi:cog-outline" className={styles.settingsIcon} />
                <h2 className={styles.sectionTitle}>Settings</h2>
              </div>
            </div>
          </li>

          {/* Reset Password (Toggles when Settings is clicked) */}
          {activeSubTab === "settings" && (
            <li className={styles.settingsDetails}>
              <div className={styles.settingsText}>
                <label className={styles.inputLabel}>Reset Password:</label>
                <input type="password" placeholder="Enter new password" className={styles.inputField} />
                <button className={styles.saveBtn}>Change Password</button>
              </div>
            </li>
          )}

          {/* Logout Button */}
          <li onClick={handleLogout} className={styles.logout}>
            Logout
          </li>
        </ul>
      )}




        {/* Booking Tab */}
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

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Done</h2>
            <p className={styles.sectionText}>Here are your past transactions.</p>
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
