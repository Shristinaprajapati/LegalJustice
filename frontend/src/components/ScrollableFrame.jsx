import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ScrollableFrame.module.css'; // Use the specific CSS module for this component
import ServiceComponent from './ServiceComponent.jsx';
import Practicearea from './about.jsx';
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
  From tracking case progress and managing client details 
  to organizing legal documents — our platform provides everything you need to handle cases efficiently and securely. 

</p>

          <button className={styles.secondaryButton}>Talk to Us</button>
        </div>
        <div className={styles.image}>
          <img src="/Images/hero3.png" alt="office2" />
        </div>
      </div>

      <Practicearea/>



  {/* Partner Section */}
<div className={styles.partnerSection}>
  <div className={styles.partnerContent}>
    <div className={styles.partnerImage}>
      <h2 className={styles.subheading}>
        Advocating for Your Rights, Empowering Your Future
      </h2>
      <img
        className={styles.partnerimg}
        src="/Images/office.jpg"
        alt="Legal consultation"
      />
    </div>
    <div className={styles.partnerText}>
      <p className={styles.paragraph}>
        At this law firm, we believe that every individual deserves access to justice and protection under the law. 
        Our commitment goes beyond courtroom representation — we educate, empower, and guide you through every legal step. 
        Whether it’s defending your rights in civil matters, navigating business regulations, or resolving family disputes, 
        we stand by your side with clarity and confidence.
      </p>
      <p className={styles.paragraph}>
        With a client-first approach and a dedication to legal excellence, we work to create lasting partnerships that 
        ensure your voice is heard and your future is secure. Your rights are not just protected — they are prioritized.
      </p>
    </div>
  </div>
</div>


<section
  style={{
    width: "100%",
    padding: "80px 20px",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}
  >
    {/* Header Section */}
    <div style={{ textAlign: "center", marginBottom: "60px" }}>
      <span
        style={{
          display: "inline-block",
          // backgroundColor: "#f0f7ff",
          // color: "#2563eb",
          // padding: "8px 16px",
          // borderRadius: "50px",
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "20px",
          color: "##4b5563",
          letterSpacing: "0.5px", 
        }}
      >
        OUR EXPERTISE
      </span>
      <h2
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#1e293b",
          margin: "0 0 15px 0",
          lineHeight: "1.2",
          textAlign: "center",
        }}
      >
        Comprehensive Legal Solutions
      </h2>

    </div>

    {/* Mission/Vision Section */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "40px",
        marginBottom: "40px"
      }}
    >
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#2563eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "15px"
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}
          >
            Our Mission
          </h3>
        </div>
        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.7",
            margin: "0"
          }}
        >
          To provide exceptional legal services through innovative solutions, unwavering integrity, and a deep commitment to our clients' success. We strive to make the law accessible and understandable while achieving outstanding results.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#2563eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "15px"
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
          </div>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}
          >
            Our Vision
          </h3>
        </div>
        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.7",
            margin: "0"
          }}
        >
          To be recognized as the premier law firm that transforms the practice of law through excellence, creativity, and a forward-thinking approach. We envision a legal landscape where justice is accessible and the law serves as a tool for positive change.
        </p>
      </div>
    </div>

    {/* CTA Section */}
    <div
      style={{
        backgroundColor: "#2563eb",
        borderRadius: "12px",
        padding: "60px",
        marginTop: "80px",
        width: "100%",
        textAlign: "center",
        background: "linear-gradient(135deg, #002b66 0%, #003d8f 100%)",
      }}
    >
      <h3
        style={{
          fontSize: "28px",
          fontWeight: "600",
          color: "#ffffff",
          margin: "0 0 15px 0"
        }}
      >
        Ready to discuss your legal needs?
      </h3>
      <p
        style={{
          fontSize: "18px",
          color: "#e0e7ff",
          maxWidth: "600px",
          margin: "0 auto 30px",
          lineHeight: "1.6",
          textAlign: "center",
        }}
      >
        Our team of experienced attorneys is here to provide personalized legal solutions tailored to your specific situation.
      </p>
      <button
        style={{
          backgroundColor: "#ffffff",
          color:"linear-gradient(135deg, #002b66 0%, #003d8f 100%)",
          fontSize: "16px",
          fontWeight: "600",
          padding: "14px 28px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 7px 20px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
        }}
      >
        Schedule a Consultation
      </button>
    </div>
  </div>
</section>




      <section
  style={{
    backgroundColor: "#ffffff",
    padding: "80px 20px",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "38px",
      fontWeight: "600",
      textAlign: "center",
      color: "#000011",
      marginBottom: "20px",
    }}
  >
    Why Clients Trust Legal Justice
  </h2>

  <p
    style={{
      fontSize: "18px",
      color: "#555",
      maxWidth: "800px",
      margin: "0 auto 50px",
      textAlign: "center",
      lineHeight: "1.6",
    }}
  >
    We focus on transparency, commitment, and delivering outcomes that exceed expectations. 
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto 80px",
    }}
  >
    {[
      {
        title: "Experienced Lawyers",
        desc: "Our team consists of skilled professionals with years of experience in multiple legal domains.",
      },
      {
        title: "Client-Centered Approach",
        desc: "Every case is handled with empathy, care, and full dedication to our clients' best interests.",
      },
      {
        title: "Proven Track Record",
        desc: "We’ve successfully represented hundreds of cases with a strong history of positive results.",
      },
    ].map((item, idx) => (
      <div
        key={idx}
        style={{
          backgroundColor: "#fcfcfc",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.05)",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "#004aad",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          {idx + 1}
        </div>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#002b5b",
            marginBottom: "10px",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "#444",
            lineHeight: "1.5",
          }}
        >
          {item.desc}
        </p>
      </div>
    ))}
  </div>

  <button
    style={{
      backgroundColor: "#004aad",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      padding: "14px 28px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    }}
  >
    Contact Us
  </button>
</section>




     
   
      
      {/* Elevating Experience Section */}
      {/* <section className={styles.elevatingExperience}>
        <div className={styles.textContainer}>
          <h2 className={styles.subheading}>Elevating Your Legal Experience</h2>
          <p className={styles.paragraph}>
            We believe strong legal support makes all the difference.
          </p>
          <button className={styles.secondaryButton}>Contact Us</button>
        </div>
        <img src='/Images/office.jpg' alt='Office' className={styles.image} />
      </section> */}
      
      <Footer />
    </div>
  );
};

export default ScrollableFrame;
