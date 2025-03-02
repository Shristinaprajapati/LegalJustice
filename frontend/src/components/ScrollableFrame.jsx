import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ScrollableFrame.module.css'; // Use the specific CSS module for this component
import ServiceComponent from './ServiceComponent.jsx';
import Footer from './Footer.jsx'
import { Icon } from "@iconify/react";

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

  const practices = [
    {
      title: "Criminal Law",
      description: "Expert defense for criminal charges and legal representation.",
      icon: "mdi:scale-balance",
      bgColor: "bg-red-100",
    },
    {
      title: "Family Law",
      description: "Legal support for divorce, custody, and family disputes.",
      icon: "mdi:account-group",
      bgColor: "bg-pink-100",
    },
    {
      title: "Criminal Law",
      description: "Expert defense for criminal charges and legal representation.",
      icon: "mdi:scale-balance",
      bgColor: "bg-red-100",
    },
    {
      title: "Corporate Law",
      description: "Guidance for businesses on compliance, contracts, and disputes.",
      icon: "mdi:briefcase",
      bgColor: "bg-blue-100",
    },
  ];

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          </p>
          <button className={styles.secondaryButton}>Talk to Us</button>
        </div>
        <div className={styles.image}>
          <img src="/Images/office2.jpg" alt="office2" />
        </div>
      </div>

      <section
  style={{
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#f9f9f9",
  }}
>
  <button
    style={{
      backgroundColor: "#004aad",
      color: "#fff",
      fontSize: "16px",
      padding: "12px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    }}
    className="practice-btn"
  >
    + PRACTICE AREAS
  </button>
  <h2
    style={{
      fontSize: "36px",
      color: "#0a0a0a",
      fontWeight: "800",
      marginTop: "20px",
      textAlign: "center", // Centering the heading
    }}
  >
    Our Legal Expertise
  </h2>
  <p
    style={{
      fontSize: "16px",
      color: "#666",
      maxWidth: "600px",
      margin: "10px auto 30px",
    }}
  >
    We specialize in various areas of law to provide the best legal
    representation.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)", // 4 columns in one row
      gap: "30px",
      maxWidth: "1250px",
      margin: "auto",
    }}
    className="practice-cards"
  >
    {practices.map((practice, index) => (
      <div
        key={index}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        className="practice-card"
      >
        <div
          style={{
            backgroundColor: index === 1 ? "#f3e5f5" : index === 2 ? "#e3f2fd" : "#fce4ec",
            padding: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "100%",
            height: "100px",
            marginBottom: "15px",
          }}
          className="icon-container"
        >
          <Icon icon={practice.icon} style={{ fontSize: "28px", color: "#004aad" }} className="practice-icon" />
        </div>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0a0a0a",
            marginBottom: "10px",
          }}
        >
          {practice.title}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#444",
            marginBottom: "15px",
          }}
        >
          {practice.description}
        </p>
        <button
          style={{
            backgroundColor: "transparent",
            color: "#0a0a0a",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 15px",
            border: "2px solid #0a0a0a",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
          className="learn-more-btn"
        >
          Learn More
        </button>
      </div>
    ))}
  </div>
</section>



      {/* Partner Section */}
      <div className={styles.partnerSection}>
        <div className={styles.partnerContent}>
          <div className={styles.partnerImage}>
            <h2 className={styles.subheading}>
              Your partner in digital growth, from strategy to work
            </h2>
            <img  className={styles.partnerimg} src="/Images/office2.jpg" alt="office2" />
          </div>
          <div className={styles.partnerText}>
            <p className={styles.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta
              dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Duis non arcu a urna porta dapibus.Lorem ipsum dolor sit .
            </p>
          </div>
        </div>
      </div>



  {/* Trusted Partner Section */}
  <section className={styles.trustedPartner}>
        <h2 className={styles.subheading}>Your Trusted Legal Partner</h2>
        <ul className={styles.list}>
          <li>Comprehensive Legal Services</li>
          <li>Tailored to Your Needs</li>
          <li>Protecting Your Interests</li>
        </ul>
      </section>
      
      {/* Elevating Experience Section */}
      <section className={styles.elevatingExperience}>
        <div className={styles.textContainer}>
          <h2 className={styles.subheading}>Elevating Your Legal Experience</h2>
          <p className={styles.paragraph}>
            We believe strong legal support makes all the difference.
          </p>
          <button className={styles.secondaryButton}>Contact Us</button>
        </div>
        <img src='/Images/office.jpg' alt='Office' className={styles.image} />
      </section>
      <Footer />
    </div>
  );
};

export default ScrollableFrame;
