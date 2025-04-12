import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Service.module.css";
import Header from "./Main/Header.jsx";
import PopupForm from "./PopupForm.jsx";
import { FaGavel, FaFileContract, FaBalanceScale, FaBriefcase, FaFileAlt } from "react-icons/fa";
import dividerImage2 from "./assets/profile1.jpg";
import Loader from "./Loader";
import Footer from "./Footer.jsx"
import toast, { Toaster } from 'react-hot-toast';

const serviceIcons = {
  consulting: <FaGavel className={styles.serviceIcon} />, 
  documentation: <FaFileContract className={styles.serviceIcon} />,
};

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    timeSlot: "",
    serviceId: "",
    service: "",
    category: "",
    clientId: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/services");
        setServices(response.data);
      } catch (err) {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <Loader />;


  const openModal = (serviceId, serviceTitle, serviceCategory) => {
    setFormData({
      ...formData,
      serviceId,
      service: serviceTitle,
      category: serviceCategory,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      timeSlot: "",
      serviceId: "",
      service: "",
      category: "",
    });
  };

  if (loading) return <div className={styles.loading}>Loading services...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <>
      <Header />

      <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          margin: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
      }}
    />
      <div className={styles.servicesContainer}>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
  <div
    style={{
      fontSize: "14px",
      fontWeight: "500",
      letterSpacing: "1px",
      textTransform: "uppercase",
      color: "#333",
    }}
  >
    Service
  </div>
  <div
    style={{
      color: "#00000" ,
      fontSize: "38px",
      fontWeight: "700",
      marginTop: "5px",
      marginBottom: "50px",
    }}
  >
    Guiding You Through Legal Complexities
  </div>
  <div className="divider-container">
            <img src={dividerImage2} alt="Divider line" className="divider-image" />
          </div>
</div>

     
        <h2 className={styles.sectionTitle}>Consulting Services</h2>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1500px",
    margin: "40px auto",
    padding: "0 20px"
  }}
>
  {services.filter(service => service.category === "consulting").length === 0 ? (
    <div
      style={{
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
      }}
    >
      <p style={{
        fontSize: "18px",
        color: "#555",
        margin: "0",
        fontWeight: "500"
      }}>
        No consulting services available at the moment.
      </p>
      <p style={{
        fontSize: "14px",
        color: "#777",
        marginTop: "10px"
      }}>
        Check back later or explore our other services.
      </p>
    </div>
  ) : (
    services.filter(service => service.category === "consulting").map(service => (
      <div
        key={service._id}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          padding: "25px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          ":hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 15px 35px rgba(0, 74, 173, 0.12)"
          }
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 74, 173, 0.08)",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "80px",
            height: "80px",
            marginBottom: "20px"
          }}
        >
          {serviceIcons[service.category] || (
            <FaBalanceScale style={{ fontSize: "32px", color: "#004aad" }} />
          )}
        </div>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#111",
            margin: "0 0 15px 0",
            lineHeight: "1.4"
          }}
        >
          {service.title}
        </h3>
        
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            margin: "0 0 20px 0",
            lineHeight: "1.6",
            flexGrow: "1"
          }}
        >
          {service.description}
        </p>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#004aad",
              margin: "0"
            }}
          >
            Rs. {service.price.toLocaleString()}
          </p>
          
          <button
  style={{
    backgroundColor: "#004aad",
    color: "#fff",
    fontSize: "15px",
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#003d8f",
      transform: "translateY(-2px)"
    }
  }}
  onClick={() => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Please login first to book services", {
        position: "top-right",
        duration: 4000,
        style: {
          margin: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          background: '#FF3333',
          color: '#fff',
        },
      });
      return;
    }
    openModal(service._id, service.title, service.category);
  }}
>
  Book Now
</button>
        </div>
        
        {service.popular && (
          <div style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            backgroundColor: "#ff6b6b",
            color: "white",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            Popular
          </div>
        )}
      </div>
    ))
  )}
</div>

        
        <h2 className={styles.sectionTitle}>Documentation Services</h2>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1500px",
    margin: "40px auto",
    padding: "0 20px"
  }}
>
  {services.filter(service => service.category === "documentation").length === 0 ? (
    <div
      style={{
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
      }}
    >
      <p style={{
        fontSize: "18px",
        color: "#555",
        margin: "0",
        fontWeight: "500"
      }}>
        No documentation services available at the moment.
      </p>
      <p style={{
        fontSize: "14px",
        color: "#777",
        marginTop: "10px"
      }}>
        Check back later or explore our other services.
      </p>
    </div>
  ) : (
    services.filter(service => service.category === "documentation").map(service => (
      <div
        key={service._id}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          padding: "25px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          ":hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 15px 35px rgba(0, 74, 173, 0.12)"
          }
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 74, 173, 0.08)",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "80px",
            height: "80px",
            marginBottom: "20px"
          }}
        >
          {serviceIcons[service.category] || (
            <FaFileAlt style={{ fontSize: "32px", color: "#004aad" }} />
          )}
        </div>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#111",
            margin: "0 0 15px 0",
            lineHeight: "1.4"
          }}
        >
          {service.title}
        </h3>
        
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            margin: "0 0 20px 0",
            lineHeight: "1.6",
            flexGrow: "1"
          }}
        >
          {service.description}
        </p>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto"
        }}>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#004aad",
              margin: "0"
            }}
          >
            Rs. {service.price.toLocaleString()}
          </p>
          
          <button
  style={{
    backgroundColor: "#004aad",
    color: "#fff",
    fontSize: "15px",
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#003d8f",
      transform: "translateY(-2px)"
    }
  }}
  onClick={() => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Please login first to get documents", {
        position: "top-right",
        duration: 4000,
        style: {
          margin: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          background: '#FF3333',
          color: '#fff',
        },
      });
      return;
    }
    openModal(service._id, service.title, service.category);
  }}
>
  Get Document
</button>
        </div>
        
        {service.popular && (
          <div style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            backgroundColor: "#ff6b6b",
            color: "white",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            Popular
          </div>
        )}


      </div>
    ))
  )}

</div>

        
        <PopupForm
  isOpen={isModalOpen}
  onClose={closeModal}
  formData={formData}
  setFormData={setFormData}
  name={formData.name}
  email={formData.email}
  phone={formData.phone}
  clientId={formData.clientId}
/>
      </div>
      
      <Footer/>
    </>
    
  );
};

export default Service;
