import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import axios from 'axios';
import io from 'socket.io-client'; // Import Socket.IO
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', clientId: '' });
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const [showNotifications, setShowNotifications] = useState(false); // State to control dropdown visibility
  const navigate = useNavigate();
  const socket = useRef(null); // Create a ref to hold the socket connection

  useEffect(() => {

    // Connect to the socket server
    socket.current = io('ws://localhost:8080');

    console.log(socket.current);
  
    // Listen for 'receiveNotification' event from the backend
    socket.current.on('receiveNotification', (notificationData) => {
      console.log('Received notification:', notificationData);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notificationData.message,
      ]);
      setShowNotifications(true); // Automatically open dropdown on receiving new notification
    });
  
    // Retrieve the email from local storage
    const email = localStorage.getItem('email');
    
    if (email) {
      setIsLoggedIn(true);
  
      // Fetch user details from backend
      axios
        .get(`http://localhost:8080/api/users?email=${email}`) 
        .then((response) => {
          const user = response.data;
          setUserData({ name: user.name, email: user.email, clientId: user._id });
  
          // Register clientId with socket on login
          socket.current.emit('register', user._id); 
        })
        .catch((error) => {
          console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        });
    }
  
    // Cleanup socket connection on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [setShowNotifications,setNotifications]);
  

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
            <ul>
              {notifications.slice(0, 5).map((notification, index) => (
                <li key={index}>{notification}</li>
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
            <div className={styles.profileDropdown}>
              <ul>
                <li>
                  <strong>{userData.name}</strong>
                </li>
                <li>{userData.email}</li>
                <li onClick={handleLogout} className={styles.logout}>
                  Logout
                </li>
              </ul>
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
