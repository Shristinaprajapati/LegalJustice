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
    <>
      <div className={styles.servicesContainer}>
        <h2>Our Services</h2>
        {loading && <div>Loading services...</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {!loading && !error && services.map((service) => (
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

      {/* Manage Cases Section */}
      <div className={styles.manageCasesSection}>
        <div className={styles.content}>
          <h1>Manage Cases with Legal Justice</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed nibh et nibh iaculis venenatis.</p>
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
    <h2 style={{ marginLeft: 0, marginBottom: '50px' }}>Your partner in digital growth, from strategy to work and execution</h2>

    <img src="/Images/office2.jpg" alt="office2" />
    </div>
    <div className={styles.partnerText}>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus. 
        Etiam eget gravida tellus, at aliquam libero. Nunc nec purus non orci mollis auctor quis non sem. Nulla fermentum 
        dapibus est vel egestas. Etiam egestas elit nunc, ut sodales mi euismod in. Pellentesque quam turpis, lobortis eu 
        neque ut, iaculis commodo nibh.</p>
      
      <p>Vestibulum molestie nibh ut metus condimentum, quis dapibus dui semper. Integer eget turpis cursus, sagittis elit a, varius dolor. Aliquam erat volutpat.
      Duis viverra nunc vitae rutrum finibus. Aliquam rhoncus nibh in auctor porttitor. Nulla tincidunt viverra porta. Donec 
      ultricies mauris eleifend neque efficitur ornare. Vestibulum sit amet rhoncus metus. Suspendisse et pretium magna. Nam 
      maximus risus non velit porta hendrerit. Aenean pulvinar eget metus vel porttitor. Cras maximus euismod sem quis aliquet. 
      Proin rutrum porta arcu nec hendrerit. Curabitur sit amet libero ac enim dignissim sagittis. Donec vel sagittis est. Phasellus 
      tincidunt arcu ac mollis posuere. libero ac enim dignissim sagittis. Donec vel sagittis est. Phasellus tincidunt arcu ac mollis posuere.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus. Etiam eget gravida tellus, at aliquam libero
      Curabitur sit amet libero ac . Phasellus tincidunt arcu ac mollis posuere.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus. Etiam eget gravida</p>
    </div>
  </div>
</div>


 {/* Manage Cases Section */}
 <div className={styles.manageCasesSection}>
        <div className={styles.content}>
          <h1>Manage Cases with Legal Justice</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed nibh et nibh iaculis venenatis.
          .Aenean pulvinar eget metus vel porttitor. Cras maximus euismod sem quis aliquet. 
          Proin rutrum porta arcu nec hendrerit. Curabitur sit amet libero
          </p>
          <button className={styles.talkToUsBtn}>Talk to Us</button>
        </div>
        <div className={styles.image}>
        <img src="/Images/office2.jpg" alt="office2" />
        </div>
      </div>



    </>
  );
};

export default ScrollableFrame;