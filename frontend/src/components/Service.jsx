// src/components/Service.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Service.module.css";
import Header from "./Main/Header.jsx";
import PopupForm from "./PopupForm.jsx";

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
  });

  

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/services");
        setServices(response.data);
        setLoading(false);  
      } catch (err) {
        setError("Failed to load services.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const openModal = (serviceId, serviceTitle) => {
    setFormData((prevData) => ({ ...prevData, serviceId, service: serviceTitle }));
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
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/bookings", formData);
      if (response.status === 201) {
        alert("Booking created successfully!");
        closeModal();
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Failed to create booking. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.servicesContainer}>
      <Header />
      <h2>Our Services</h2>
      
      {services.length === 0 ? (
        <div>No services available at the moment.</div>
      ) : (
        services.map((service) => (
          <div className={styles.serviceCard} key={service._id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className={styles.priceDetail}>
              <div className={styles.price}>
                <p>Fixed Price</p>
                <p>Rs. {service.price}</p>
              </div>
              <button
                className={styles.bookNowBtn}
                onClick={() => openModal(service._id, service.title)}
              >
                BOOK NOW
              </button>

            </div>
          </div>
        ))
      )}

      <PopupForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Service;
