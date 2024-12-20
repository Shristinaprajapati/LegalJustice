import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowTemplatesDropdown((prev) => !prev);
  };

  return (
    <div className={styles.sidebar}>
      <h2>Legal Justice</h2>
      <ul>
        <li><Link to="/admin/AdminDashboard">Dashboard</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/booking">Bookings</Link></li>
        <li>
          <button
            className={styles.dropdownToggle}
            onClick={toggleDropdown}
          >
            Templates {showTemplatesDropdown ? '▲' : '▼'}
          </button>
          {showTemplatesDropdown && (
            <ul className={styles.dropdownMenu}>
              <li><Link to="/admin/templates/post">Post</Link></li>
              <li><Link to="/document">Documents</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/admin/payment-history">Payment History</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
