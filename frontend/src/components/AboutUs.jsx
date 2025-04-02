import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/settings');
        setSettings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load company information');
        setLoading(false);
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!settings) return <div className={styles.error}>No company information found</div>;

  return (
    <div className={styles.aboutUsContainer}>
      <div className={styles.heroSection}>
        <h1>About Legal Justice</h1>
        <p>Your trusted partner in legal services</p>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.companyInfo}>
          <h2>Our Company</h2>
          <p>{settings.companyName} is a premier legal service provider dedicated to delivering exceptional legal solutions to our clients.</p>
          
          <div className={styles.contactInfo}>
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> {settings.email}</p>
            <p><strong>Phone:</strong> {settings.phone}</p>
            <p><strong>Address:</strong> {settings.address}</p>
          </div>
        </div>

        <div className={styles.mapSection}>
          <h3>Our Location</h3>
          <div className={styles.mapContainer}>
            <iframe
              src={settings.mapEmbed}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Company Location"
            ></iframe>
          </div>
        </div>

        <div className={styles.socialMedia}>
          <h3>Connect With Us</h3>
          <div className={styles.socialLinks}>
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={settings.twitter} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>

        <div className={styles.missionSection}>
          <h3>Our Mission</h3>
          <p>
            At Legal Justice, we are committed to providing accessible, high-quality legal services to individuals and businesses alike. 
            Our team of experienced professionals works tirelessly to ensure justice and fairness for all our clients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;