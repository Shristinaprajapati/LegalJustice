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
        <h2 className={styles.sectionTitle}>Consulting Services</h2>
        <div className={styles.servicesGrid}>
          {services.filter(service => service.category === "consulting").length === 0 ? (
            <div className={styles.noServiceMessage}>No consulting services available.</div>
          ) : (
            services.filter(service => service.category === "consulting").map(service => (
              <div className={styles.serviceCard} key={service._id}>
                <div className={styles.iconWrapper}>
  {serviceIcons[service.category] || <FaBalanceScale className={styles.serviceIcon} />}
</div>

                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <p className={styles.price}>Rs. {service.price}</p>
                <button className={styles.bookNowBtn} onClick={() => openModal(service._id, service.title, service.category)}>BOOK NOW</button>
              </div>
            ))
          )}
        </div>
        
        <h2 className={styles.sectionTitle}>Documentation Services</h2>
        <div className={styles.servicesGrid}>
          {services.filter(service => service.category === "documentation").length === 0 ? (
            <div className={styles.noServiceMessage}>No documentation services available.</div>
          ) : (
            services.filter(service => service.category === "documentation").map(service => (
              <div className={styles.serviceCard} key={service._id}>
                {serviceIcons[service.category] || <FaBalanceScale className={styles.serviceIcon} />} {/* Default icon */}
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <p className={styles.price}>Rs. {service.price}</p>
                <button className={styles.getDocumentBtn} onClick={() => openModal(service._id, service.title, service.category)}>GET DOCUMENT</button>
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
