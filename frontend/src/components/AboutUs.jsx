import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AboutUs.module.css';
import Header from "./Main/Header.jsx";
import Loader from "./Loader.jsx";

const AboutUs = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/settings');
        setSettings(response.data);
      } catch (err) {
        setError('Failed to load company information');
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!settings) return <div className={styles.error}>No company information found</div>;

  return (
    <div className={styles.aboutUsPage}>
      <Header />
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>About {settings.companyName}</h1>
        </div>
      </div>

      {/* About Content */}
      <section className={styles.aboutContent}>
        <div className={styles.container}>
          <div className={styles.aboutText}>
            <h2>Our Story</h2>
            <p>
              Founded with a vision to provide exceptional legal services, {settings.companyName} 
              has grown to become a trusted name in the legal community. Our journey began with 
              a simple principle: to deliver justice with compassion and excellence.
            </p>
            <p>
              Today, we continue to uphold these values while adapting to the evolving legal 
              landscape, ensuring our clients receive the highest standard of representation.
            </p>
          </div>
          <div className={styles.aboutImage}>
          <img src="/Images/hero3.png" alt="office2" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>⚖️</div>
              <h3>Integrity</h3>
              <p>We uphold the highest ethical standards in all our dealings.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎯</div>
              <h3>Excellence</h3>
              <p>We strive for the highest quality in legal representation.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3>Client Focus</h3>
              <p>Your needs and objectives are at the center of our practice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (Static Content) */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2>Our Legal Team</h2>
          <p className={styles.sectionSubtitle}>
            Meet the dedicated professionals who make our firm exceptional
          </p>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberImage}></div>
              <h3>Senior Partner</h3>
              <p>Specializing in Corporate Law</p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.memberImage}></div>
              <h3>Associate Attorney</h3>
              <p>Specializing in Family Law</p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.memberImage}></div>
              <h3>Legal Consultant</h3>
              <p>Specializing in Intellectual Property</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <secti  on className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactInfo}>
            <h2>Contact Us</h2>
            <p><strong>Address:</strong> {settings.address}</p>
            <p><strong>Phone:</strong> {settings.phone}</p>
            <p><strong>Email:</strong> {settings.email}</p>
            
            <div className={styles.socialLinks}>
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
              {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {settings.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
            </div>
          </div>
          <div className={styles.mapContainer}>
            {settings.mapEmbed ? (
              <iframe
                src={settings.mapEmbed}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Company Location"
              />
            ) : (
              <div className={styles.mapPlaceholder}>
                <p>Location map not available</p>
              </div>
            )}
          </div>
        </div>
      </secti>
    </div>
  );
};

export default AboutUs;