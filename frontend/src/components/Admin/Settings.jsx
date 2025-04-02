import React, { useState } from 'react';
import Sidebar from './Sidebar';
import styles from './Settings.module.css';

const Settings = () => {
    const [settings, setSettings] = useState({
        companyName: 'Legal Justice Pvt. Ltd.',
        email: 'info@legaljustice.com',
        phone: '+9779849388233',
        address: 'Naxal, Kathmandu, Nepal',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2936324072097!2d85.3206670753238!3d27.7130',
        facebook: 'https://facebook.com/legaljustice',
        instagram: 'https://instagram.com/legaljustice',
        twitter: 'https://twitter.com/legaljustice',
        linkedin: 'https://linkedin.com/company/legaljustice',
        whatsapp: 'https://whatsapp.com/9779849388233',
        messenger: 'https://messenger.me/legaljustice',
      });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar />
      <div className={styles.settingsContent}>
        <h1 className={styles.title}>Settings</h1>
        
        <div className={styles.companyHeader}>
          <h2 className={styles.companyName}>AIDE ASCENT</h2>
          <div className={styles.divider}></div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Details Section */}
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Basic Details</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Google Maps Embed Link</label>
              <input
                type="url"
                name="mapEmbed"
                value={settings.mapEmbed}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Google Maps Preview Section */}
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Google Maps Preview</h3>
            <div className={styles.mapPreview}>
              <div className={styles.mapInfo}>
                <h4 className={styles.mapTitle}>AIDE ASCENT</h4>
                <p className={styles.mapText}>Kamal Pokhari, Kathmandu 44600</p>
                <div className={styles.rating}>
                  <span>5.0</span>
                  <span className={styles.stars}>★★★★★</span>
                  <span>135 reviews</span>
                </div>
                <p className={styles.mapLink}>View larger map</p>
                <p className={styles.updateTime}>Updated yesterday</p>
              </div>
              <div className={styles.mapAddress}>
                <p>Pakhiopati Road</p>
                <p>City Center</p>
                <p>Parking No.1</p>
                <p>Sri Yeybeni Province</p>
                <p>Map #site 20315 Google</p>
                <p className={styles.reportLink}>Report a new error</p>
              </div>
            </div>
          </div>

          {/* Online Presence Section */}
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Online Presence</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Facebook Page Link</label>
              <input
                type="url"
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Instagram Link</label>
              <input
                type="url"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Twitter Link</label>
              <input
                type="url"
                name="twitter"
                value={settings.twitter}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn Link</label>
              <input
                type="url"
                name="linkedin"
                value={settings.linkedin}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>WhatsApp Link</label>
              <input
                type="url"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Messenger Link</label>
              <input
                type="url"
                name="messenger"
                value={settings.messenger}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;