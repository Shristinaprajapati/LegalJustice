import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaServicestack, FaBook, FaFileAlt, FaMoneyBillAlt, FaSignOutAlt } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import DivorceAgreementTemplate from './htmlTemplates/ClientCards.jsx';
import RealEstateAgreementTemplate from './htmlTemplates/RealEstateAgreementTemplate.jsx';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);

  const toggleDropdown = async () => {
    // Toggle the dropdown visibility
    setShowTemplatesDropdown(prev => !prev);

    // Call the API to store templates only if the dropdown is being opened
    if (!showTemplatesDropdown) {
      try {
        console.log('Storing templates...');

        // Render templates to static HTML
        const divorceTemplateHtml = ReactDOMServer.renderToStaticMarkup(<DivorceAgreementTemplate />);
        const realEstateTemplateHtml = ReactDOMServer.renderToStaticMarkup(<RealEstateAgreementTemplate />);

        // API call to store Divorce Agreement Template
        await axios.post('http://localhost:8080/api/store-template', {
          name: 'Divorce Agreement Template',
          content: divorceTemplateHtml,
          category: 'Family Law',
        });

        // API call to store Real Estate Agreement Template
        await axios.post('http://localhost:8080/api/store-template', {
          name: 'Real Estate Agreement Template',
          content: realEstateTemplateHtml,
          category: 'Real Estate Documents',
        });

        console.log('Templates stored successfully!');
      } catch (error) {
        console.error('Error storing templates:', error);
      }
    }
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
