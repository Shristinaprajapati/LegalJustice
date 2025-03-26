import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./ServiceComponent.module.css";
import PopupForm from "./PopupForm.jsx";
import { FaGavel, FaFileContract, FaBalanceScale, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const serviceIcons = {
  consulting: <FaGavel className={styles.serviceIcon} />, 
  documentation: <FaFileContract className={styles.serviceIcon} />,
};

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const containerRef = useRef(null);
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
        // Check if we need to show arrows (more than 3 services)
        if (response.data.filter(s => s.category === "consulting").length > 3) {
          setShowArrows(true);
        }
      } catch (err) {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300; // Width of one card + gap
      containerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      <div className={styles.servicesContainer}>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div style={{
            fontSize: "14px",
            fontWeight: "500",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#333",
          }}>
            Service
          </div>
          <div style={{
            color: "#264262",
            fontSize: "38px",
            fontWeight: "700",
            marginTop: "5px",
            marginBottom: "50px",
          }}>
            Guiding You Through Legal Complexities
          </div>
        </div>
        
        {/* <h2 className={styles.sectionTitle}>Consulting Services</h2> */}
        
        <div className={styles.servicesWrapper}>
          {showArrows && (
            <button 
              className={styles.navArrow} 
              onClick={() => scroll('left')}
              style={{ left: "20px" }}
            >
              <FaChevronLeft />
            </button>
          )}
          
          <div 
            ref={containerRef}
            className={styles.servicesGrid}
          >
            {services.filter(service => service.category === "consulting").length === 0 ? (
              <div className={styles.noServiceMessage}>
                <p>No consulting services available at the moment.</p>
                <p>Check back later or explore our other services.</p>
              </div>
            ) : (
              services.filter(service => service.category === "consulting").map(service => (
                <div
                  key={service._id}
                  className={styles.serviceCard}
                >
                  <div className={styles.iconWrapper}>
                    {serviceIcons[service.category] || (
                      <FaBalanceScale className={styles.serviceIcon} />
                    )}
                  </div>

                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  
                  <p className={styles.serviceDescription}>
                    {service.description}
                  </p>
                  
                  <div className={styles.cardFooter}>
                    <p className={styles.price}>
                      Rs. {service.price.toLocaleString()}
                    </p>
                    
                    <button
                      className={styles.bookNowBtn}
                      onClick={() => openModal(service._id, service.title, service.category)}
                    >
                      Book Now
                    </button>
                  </div>
                  
                  {service.popular && (
                    <div className={styles.popularBadge}>
                      Popular
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {showArrows && (
            <button 
              className={styles.navArrow} 
              onClick={() => scroll('right')}
              style={{ right: "20px" }}
            >
              <FaChevronRight />
            </button>
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