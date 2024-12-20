// src/components/ParallaxSection.jsx

import React from 'react';
import styles from './ParallaxSection.module.css'; 

const ParallaxSection = () => {
  return (
    <div className={styles.parallax}>
      <div className={styles.parallaxContent}>
        <h1>
          Dedicated Legal Support for Every Step of Your Journey
        </h1>
        <p style={{ fontSize: '16px' }}>
          At Legal Justice, we offer friendly and helpful legal support for all your needs. Our team is here to guide you through every step, making sure your rights are protected and your goals are met.
        </p>
        <button className={styles.contactButton}>Contact Us</button>
      </div>

      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          <img src="/Images/scroll1.png" alt="Logo 1" />
          <img src="/Images/scroll2.png" alt="Logo 2" />
          {/* Add more logos as needed */}
        </div>
      </div>
    </div>
  );
};

export default ParallaxSection;
