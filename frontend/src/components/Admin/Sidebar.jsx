import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaServicestack, FaBook, FaFileAlt, FaMoneyBillAlt, FaSignOutAlt } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowTemplatesDropdown(prev => !prev);
  };

  return (
    <div className={styles.sidebar}>
      <h2>Legal Justice</h2>
      <ul>
        <li>
          <Link to="/admin/AdminDashboard" className={styles.link}>
            <FaTachometerAlt className={styles.icon} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/services" className={styles.link}>
            <FaServicestack className={styles.icon} />
            Services
          </Link>
        </li>
        <li>
          <Link to="/booking" className={styles.link}>
            <FaBook className={styles.icon} />
            Bookings
          </Link>
        </li>
        <li>
          <button
            className={`${styles.dropdownToggle} ${showTemplatesDropdown ? styles.active : ''}`}
            onClick={toggleDropdown}
          >
            <FaFileAlt className={styles.icon} />
            Templates <span>{showTemplatesDropdown ? '▲' : '▼'}</span>
          </button>
          {showTemplatesDropdown && (
            <ul className={styles.dropdownMenu}>
              <li><Link to="/admin/templates/post" className={styles.link}>Post</Link></li>
              <li><Link to="/document" className={styles.link}>Documents</Link></li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/admin/payment-history" className={styles.link}>
            <FaMoneyBillAlt className={styles.icon} />
            Payment History
          </Link>
        </li>
        <li>
          <Link to="/login" className={`${styles.link} ${styles.logout}`}>
            <FaSignOutAlt className={styles.icon} />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
