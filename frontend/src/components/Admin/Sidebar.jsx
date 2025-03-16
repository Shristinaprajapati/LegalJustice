import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Icon } from '@iconify/react';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import DivorceAgreementTemplate from './htmlTemplates/ClientCards.jsx';
import RealEstateAgreementTemplate from './htmlTemplates/RealEstateAgreementTemplate.jsx';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleLogout = () => {
    // Remove admin_token and admin_email from localStorage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');

    // Redirect to the login page
    navigate('/login');
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
            <Icon icon="ic:outline-dashboard" className={styles.icon} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/services" className={getLinkClass('/services')}>
            <Icon icon="bx:bxs-server" className={styles.icon} />
            Services
          </Link>
        </li>
        <li>
          <Link to="/booking" className={getLinkClass('/booking')}>
            <Icon icon="fa-solid:book" className={styles.icon} />
            Bookings
          </Link>
        </li>
        <li>
          <Link to="/document" className={getLinkClass('/document')}>
            <Icon icon="fa-regular:file-alt" className={styles.icon} />
            Documents
          </Link>
        </li>
        <li>
          <button
            className={`${styles.dropdownToggle} ${showTemplatesDropdown ? styles.active : ''}`}
            onClick={toggleDropdown}
          >
            <Icon icon="ic:outline-description" className={styles.icon} />
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
                <Link to="/partnershiptemplate" className={getLinkClass('/partnershiptemplate')}>
                  Partnership Template
                </Link>
              </li>
              <li>
                <Link to="/rentaltemplate" className={getLinkClass('/rentaltemplate')}>
                  Rental Agreement Template
                </Link>
              </li>
              <li>
                <Link to="/marriageprooftemplate" className={getLinkClass('/marriageprooftemplate')}>
                  Marriage Proof Agreement Template
                </Link>
              </li>
              <li>
                <Link to="/propertytransfer" className={getLinkClass('/propertytransfer')}>
                  Property Transfer Agreement Template
                </Link>
              </li>
              <li>
                <Link to="/employmenttemplate" className={getLinkClass('/employmenttemplate')}>
                  Employment Contract
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/admin/blogs" className={`${styles.link} ${getLinkClass('/admin/blogs')}`}>
            <Icon icon="fa-solid:address-book" className={styles.icon} />
            Blog Post
          </Link>
        </li>

        <li>
          <Link to="/admin/payment-history" className={getLinkClass('/admin/payment-history')}>
            <Icon icon="mdi:cash-multiple" className={styles.icon} />
            Payment History
          </Link>
        </li>
        <li>
          <Link to="/contactform" className={`${styles.link} ${getLinkClass('/contactform')}`}>
            <Icon icon="fa-solid:address-book" className={styles.icon} />
            Contact Messages
          </Link>
        </li>
        <li>
          <Link 
            to="/login" 
            className={`${styles.link} ${styles.logout}`}
            onClick={handleLogout} // Add onClick handler for logout
          >
            <Icon icon="fa-solid:sign-out-alt" className={styles.icon} />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;