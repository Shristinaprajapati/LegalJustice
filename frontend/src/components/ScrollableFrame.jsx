import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ScrollableFrame.module.css'; // Use the specific CSS module for this component
import ServiceComponent from './ServiceComponent.jsx';

const ScrollableFrame = () => {
  const [services, setServices] = useState([]); // State to store services
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to handle any errors

  // Fetch the services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/services');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading services...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div>
      {/* Services Section */}
      <div className={styles.servicesContainer}>
        <ServiceComponent />
      </div>

      {/* Manage Cases Section */}
      <div className={styles.manageCasesSection}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Manage Cases with Legal Justice</h1>
          <p className={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed nibh et nibh iaculis venenatis.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed nibh et nibh iaculis venenatis.Lorem 
            ipsum dolor sit amet, consectetur adipiscing elit. Ut sed nibh et nibh iaculis venenatis.Lorem ipsum dolor
             sit amet, consectetur adipiscing elit.
          </p>
          <button className={styles.talkToUsBtn}>Talk to Us</button>
        </div>
        <div className={styles.image}>
          <img src="/Images/office2.jpg" alt="office2" />
        </div>
      </div>

      {/* Partner Section */}
      <div className={styles.partnerSection}>
        <div className={styles.partnerContent}>
          <div className={styles.partnerImage}>
            <h2 className={styles.subheading}>
              Your partner in digital growth, from strategy to work and execution
            </h2>
            <img src="/Images/office2.jpg" alt="office2" />
          </div>
          <div className={styles.partnerText}>
            <p className={styles.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta
              dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta
              dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollableFrame;
