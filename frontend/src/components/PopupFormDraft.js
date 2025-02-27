import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PopupForm.module.css";
import MessagePopup from "./MessagePopup.jsx";
import { useSearchParams } from "react-router-dom";

const PopupForm = ({ isOpen, onClose, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (isOpen && email) {
      const fetchClientDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/users?email=${email}`
          );
          const data = response.data;

          setFormData((prevData) => ({
            ...prevData,
            clientId: data._id || "",
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          }));
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch client details");
        } finally {
          setLoading(false);
        }
      };
      fetchClientDetails();
    }
  }, [isOpen, email, setFormData]);

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get("pidx");
      const status = searchParams.get("status");
      const transaction_id = searchParams.get("transaction_id");
      const amount = searchParams.get("amount");
      const total_amount = searchParams.get("total_amount");
      const mobile = searchParams.get("mobile");
      const serviceId = searchParams.get("purchase_order_id");
      const purchase_order_name = searchParams.get("purchase_order_name");
      const clientId = searchParams.get("client_id");
      const category = searchParams.get("category");
  
      const customer_info = {
        name: searchParams.get("name"),
        email: searchParams.get("email"),
        phone: searchParams.get("phone"),
      };
  
      console.log("Payment Params Detected:", { pidx, status, serviceId, clientId, category, customer_info });
  
      if (pidx && status) {
        setShowPopup(true);
  
        if (status === "Completed") {
          try {
            const response = await axios.get(`http://localhost:8080/api/khalti-callback`, {
              params: {
                pidx,
                status,
                transaction_id,
                amount,
                total_amount,
                mobile,
                serviceId,
                purchase_order_name,
                clientId,
                category,
                customer_info: JSON.stringify(customer_info), // Send as JSON string
              },
            });
  
            console.log("Khalti Verification Response:", response.data);
  
            if (status === "Completed") {
              setPaymentStatus("Payment Successful! ✅");
  
              // Call createBooking() with extracted clientId, category, and serviceId
              await createBooking(serviceId, clientId, category);
            } else {
              setPaymentStatus("Payment Verification Failed. ❌");
            }
          } catch (error) {
            setPaymentStatus("Error verifying payment: " + error.message);
          }
        } else {
          setPaymentStatus("Payment failed or canceled.");
        }
      }
    };
  
    verifyPayment();
  }, [searchParams]);
  
  
  

  const createBooking = async (serviceId, clientId, category) => {
    console.log(serviceId, clientId, category);
    setLoading(true);
    setError(null);
    setSuccessMessage("");
  
    try {
      const bookingData = {
        serviceId,
        clientId,
        category,
      };
  
      console.log("Creating Booking with Data:", bookingData); // Debugging log
  
      const response = await axios.post("http://localhost:8080/api/bookings", bookingData);
      console.log("Booking Created Successfully:", response.data); // Debugging log
  
      setSuccessMessage("Booking successful!");
      setIsMessagePopupOpen(true);
      resetFormData();
    } catch (err) {
      console.error("Booking Creation Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setSuccessMessage("");
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      let bookingData;
      if (formData.category === "consulting") {
        bookingData = {
          serviceId: formData.serviceId,
          clientId: formData.clientId,
          date: formData.date,
          timeSlot: formData.timeSlot,
          category: formData.category,
        };
      } else {
        bookingData = {
          serviceId: formData.serviceId,
          clientId: formData.clientId,
          category: formData.category,
        };
      }

      console.log("Sending booking data:", bookingData); // Debugging log
      const response = await axios.post(
        "http://localhost:8080/api/bookings",
        bookingData
      );

      setSuccessMessage("Booking successful!");
      setIsMessagePopupOpen(true);

      resetFormData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleKhaltiPayment = async (serviceId, clientId, category) => {
    console.log(serviceId, clientId, category);
    setLoading(true);
    setError(null);
  
    try {
      const paymentPayload = {
        return_url: "http://localhost:3000/service",
        website_url: "http://localhost:3000",
        amount: 20 * 100, // Amount in paisa
        purchase_order_id: serviceId, 
        purchase_order_name: `Legal Document Purchase - ${category} - ${clientId}`, // Embed metadata
        customer_info: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
        }
    };
  
      const khaltiResponse = await axios.post(
        "http://localhost:8080/api/khalti-api",
        paymentPayload
      );
      console.log("Khalti API Response:", khaltiResponse.data);
  
      if (khaltiResponse.data.success) {
        window.location.href = khaltiResponse.data.data.payment_url; // Redirect to Khalti
      } else {
        setError("Failed to initiate Khalti payment.");
      }
    } catch (err) {
      setError("Error processing payment: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const resetFormData = () => {
    setFormData((prevData) => ({
      ...prevData,
      date: "",
      timeSlot: "",
    }));
  };

  const closeMessagePopup = () => {
    setIsMessagePopupOpen(false);
  };


  // Simple popup styling
const popupStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "white",
  padding: "20px",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  textAlign: "center",
};
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <span className={styles.closeIcon} onClick={onClose}>
              X
            </span>
          </div>
          {formData.category === "consulting" ? (
            <>
              <h3>Book Service</h3>
              {loading && <p>Loading...</p>}
              {error && <p className={styles.errorMessage}>{error}</p>}
              {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <label>
                  Service:
                  <input type="text" name="service" value={formData.service} readOnly required />
                </label>
                <label>
                  Date:
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </label>
                <label>
                  Time Slot:
                  <select name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} required>
                    <option value="">Select a time slot</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                  </select>
                </label>
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.submitBtn}>Submit</button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3>Get Document</h3>
              <p>Are you sure you want to get the document?</p>
              {/* <p>Service ID: {formData.serviceId}</p>
              <p>ClinetId: {formData.clientId}</p>
              <p>Category: {formData.category}</p> */}

              {loading && <p>Loading...</p>}
              {/* {error && <p className={styles.errorMessage}>{error}</p>}
              {successMessage && <p className={styles.successMessage}>{successMessage}</p>} */}

              <button 
  onClick={() => handleKhaltiPayment(formData.serviceId, formData.clientId, formData.category)} 
  className={styles.submitBtn}>
  Yes, Pay Rs. 2000
</button>

            </>
          )}
        </div>
      </div>

      <MessagePopup isOpen={isMessagePopupOpen} onClose={closeMessagePopup} message="Document request sent successfully!" />

      {showPopup && (
        <div style={popupStyle}>
          <h3>{paymentStatus}</h3>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </>
  );
  
};

export default PopupForm;
