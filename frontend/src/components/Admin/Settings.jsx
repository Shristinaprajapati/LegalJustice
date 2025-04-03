import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import styles from './Settings.module.css';
import axios from 'axios'; // Make sure to install axios: npm install axios

const Settings = () => {
    const [settings, setSettings] = useState({
        companyName: 'Legal Justice Pvt. Ltd.',
        email: 'info@legaljustice.com',
        phone: '+9779849388233',
        address: 'Naxal, Kathmandu, Nepal',
        mapEmbed: '',
        facebook: 'https://facebook.com/legaljustice',
        instagram: 'https://instagram.com/legaljustice',
        twitter: 'https://twitter.com/legaljustice',
        linkedin: 'https://linkedin.com/company/legaljustice',
        whatsapp: 'https://whatsapp.com/9779849388233',
        messenger: 'https://messenger.me/legaljustice',
    });

    // Fetch settings from backend when component mounts
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/settings'); // Adjust API endpoint as needed
                setSettings(response.data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/settings', settings); // Adjust API endpoint as needed
            console.log('Settings saved:', settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        }
    };

    return (
        <div className={styles.adminContainer}>
            <Sidebar />
            <div className={styles.settingsContent}>
                <h1 className={styles.title}>Settings</h1>
                
                <div className={styles.companyHeader}>
                    <h2 className={styles.companyName}>Legal Justice</h2>
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
                                placeholder="Paste Google Maps embed URL"
                            />
                        </div>
                    </div>

                    {/* Google Maps Preview Section */}
                    <div className={styles.settingsSection}>
                        <h3 className={styles.sectionTitle}>Google Maps Preview</h3>
                        <div className={styles.mapPreview}>
                            {settings.mapEmbed ? (
                                <iframe 
                                    src={settings.mapEmbed}
                                    width="100%"
                                    height="450"
                                    style={{ border: "0" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Maps Embed"
                                />
                            ) : (
                                <p>No map embed URL provided</p>
                            )}
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