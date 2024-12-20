import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import axios from 'axios';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the email from local storage
    const email = localStorage.getItem('email');
    
    if (email) {
      setIsLoggedIn(true);

      // Make an API call to fetch user details based on the email
      axios
        .get(`http://localhost:8080/api/check-email?email=${email}`)
        .then((response) => {
          // On success, update the user data
          setUserData({ name: response.data.name, email: response.data.email });
        })
        .catch((error) => {
          // Handle errors (e.g., 500 server error)
          console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        });
    }
  }, []);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
