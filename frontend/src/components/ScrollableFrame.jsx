import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For making HTTP requests
import styles from './ScrollableFrame.module.css'; 

const ScrollableFrame = () => {
  const [services, setServices] = useState([]); // State to store services
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to handle any errors

  // Fetch the services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/services'); 
        setServices(response.data); // Update state with the fetched services
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError('Failed to load services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.servicesContainer}>
      <h2>Our Services</h2>

      {services.map((service) => (
        <div className={styles.serviceCard} key={service._id}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <div className={styles.priceDetail}>
            <div className={styles.price}>
              <p>Fixed Price</p>
              <p>Rs. {service.price}</p>
            </div>
            <button className={styles.detailBtn}>VIEW DETAIL</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollableFrame;
