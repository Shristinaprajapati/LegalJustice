import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Service.module.css";
import Header from "./Main/Header.jsx";
import PopupForm from "./PopupForm.jsx";
import { FaGavel, FaFileContract, FaBalanceScale, FaBriefcase } from "react-icons/fa";

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
      color: "#264262" ,
      fontSize: "38px",
      fontWeight: "700",
      marginTop: "5px",
      marginBottom: "50px",
    }}
  >
    Guiding You Through Legal Complexities
  </div>
</div>

     
        <h2 className={styles.sectionTitle}>Consulting Services</h2>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    maxWidth: "1500px",
    margin: "auto",
  }}
>
  {services.filter(service => service.category === "consulting").length === 0 ? (
    <div
      style={{
        textAlign: "center",
        fontSize: "16px",
        color: "#666",
        margin: "20px auto",
        fontWeight: "bold",
      }}
    >
      No consulting services available.
    </div>
  ) : (
    services.filter(service => service.category === "consulting").map(service => (
      <div
        key={service._id}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            backgroundColor: "#e3f2fd",
            padding: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "100%",
            height: "100px",
            marginBottom: "-35px",
          }}
        >
          {serviceIcons[service.category] || (
            <FaBalanceScale style={{ fontSize: "28px", color: "#004aad" }} />
          )}
        </div>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0a0a0a",
            marginBottom: "-40px",
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#444",
            marginBottom: "-15px",
          }}
        >
          {service.description}
        </p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#0a0a0a",
            marginBottom: "15px",
          }}
        >
          Rs. {service.price}
        </p>
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
          onClick={() => openModal(service._id, service.title, service.category)}
        >
          BOOK NOW
        </button>
      </div>
    ))
  )}
</div>

        
        <h2 className={styles.sectionTitle}>Documentation Services</h2>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    maxWidth: "1500px",
    margin: "auto",
  }}
>
  {services.filter(service => service.category === "documentation").length === 0 ? (
    <div
      style={{
        textAlign: "center",
        fontSize: "16px",
        color: "#666",
        margin: "20px auto",
        fontWeight: "bold",
      }}
    >
      No documentation services available.
    </div>
  ) : (
    services.filter(service => service.category === "documentation").map(service => (
      <div
        key={service._id}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            backgroundColor: "#EDF2FB",
            padding: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "100%",
            height: "100px",
            marginBottom: "15px",
          }}
        >
          {serviceIcons[service.category] || (
            <FaBalanceScale style={{ fontSize: "28px", color: "#004aad" }} />
          )}
        </div>

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0a0a0a",
            marginBottom: "-40px",
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#444",
            marginBottom: "-15px",
          }}
        >
          {service.description}
        </p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#0a0a0a",
            marginBottom: "15px",
          }}
        >
          Rs. {service.price}
        </p>
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
          onClick={() => openModal(service._id, service.title, service.category)}
        >
          GET DOCUMENT
        </button>
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
    </>
  );
};

export default Service;
