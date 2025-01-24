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
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
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

  const openModal = (serviceId, serviceTitle, serviceCategory) => {
    setFormData((prevData) => ({
      ...prevData,
      serviceId,
      service: serviceTitle,
      category: serviceCategory,
    }));
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

  const handleGetDocumentClick = () => {
    // Simulate a request for document
    setIsMessagePopupOpen(true);
  };

  const closeMessagePopup = () => {
    setIsMessagePopupOpen(false);
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  const consultingServices = services.filter((service) => service.category === "consulting");
  const documentationServices = services.filter((service) => service.category === "documentation");

  return (
    <div className={styles.servicesContainer}>
      <Header />

      {/* Consulting Services */}
      <h2>Consulting Services</h2>
      {consultingServices.length === 0 ? (
        <div>No consulting services available at the moment.</div>
      ) : (
        consultingServices.map((service) => (
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
                onClick={() => openModal(service._id, service.title, service.category)}
              >
                BOOK NOW
              </button>
            </div>
          </div>
        ))
      )}

      {/* Documentation Services */}
      <h2>Documentation Services</h2>
      {documentationServices.length === 0 ? (
        <div>No documentation services available at the moment.</div>
      ) : (
        documentationServices.map((service) => (
          <div className={styles.serviceCard} key={service._id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className={styles.priceDetail}>
              <div className={styles.price}>
                <p>Fixed Price</p>
                <p>Rs. {service.price}</p>
              </div>
              <button
                className={styles.getDocumentBtn}
                // onClick={handleGetDocumentClick}
                onClick={() => openModal(service._id, service.title, service.category)}
                
              >
                GET DOCUMENT
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

      {/* <MessagePopup
        isOpen={isMessagePopupOpen}
        onClose={closeMessagePopup}
        message="Document request sent successfully!"
      /> */}
    </div>
  );
};

export default Service;
