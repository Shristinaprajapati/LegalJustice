import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaServicestack, FaBook, FaFileAlt, FaMoneyBillAlt, FaSignOutAlt } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import DivorceAgreementTemplate from './htmlTemplates/ClientCards.jsx';
import RealEstateAgreementTemplate from './htmlTemplates/RealEstateAgreementTemplate.jsx';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const location = useLocation();

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

        console.log('Templates stored successfully!');
      } catch (error) {
        console.error('Error storing templates:', error);
      }
    }
  };

  const getLinkClass = (path) => {
    return location.pathname === path ? `${styles.link} ${styles.active}` : styles.link;
  };

  return (
    <div className={styles.sidebar}>
      <img 
  src="/Images/logo1.png" 
  alt="Legal Justice Logo" 
  style={{ 
    width: '200px', 
    height: 'auto', 
    borderRadius: '8px', 
    margin: '15px' 
  }} 
/>


      <ul>
        <li>
          <Link to="/admin/AdminDashboard" className={getLinkClass('/admin/AdminDashboard')}>
            <FaTachometerAlt className={styles.icon} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/services" className={getLinkClass('/services')}>
            <FaServicestack className={styles.icon} />
            Services
          </Link>
        </li>
        <li>
          <Link to="/booking" className={getLinkClass('/booking')}>
            <FaBook className={styles.icon} />
            Bookings
          </Link>
        </li>
        <li>
                <Link to="/document" className={getLinkClass('/document')}>
                <FaFileAlt className={styles.icon} />
                  Documents
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
              <li>
                <Link to="/divorsetemplate" className={getLinkClass('/divorsetemplate')}>
                  Divorce Agreements
                </Link>
              </li>
              <li>
                <Link to="/partnershiptemplate" className={getLinkClass('/divorsetemplate')}>
                  Partnership Template
                </Link>
              </li>
              {/* <li>
                <Link to="/document" className={getLinkClass('/document')}>
                  Documents
                </Link>
              </li> */}
            </ul>
          )}
        </li>
        <li>
          <Link to="/admin/payment-history" className={getLinkClass('/admin/payment-history')}>
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
