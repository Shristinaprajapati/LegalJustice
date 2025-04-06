import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PopupForm.module.css";
import { QRCode } from "react-qr-code";
import MessagePopup from "./MessagePopup.jsx";
import toast, { Toaster } from 'react-hot-toast';

const PopupForm = ({ isOpen, onClose, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [returnUrl, setReturnUrl] = useState("");

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (isOpen && email) {
      const fetchClientDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8080/api/users?email=${email}`);
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

  // Call initiatePayment only after formData is populated
  useEffect(() => {
    if (formData.category === "documentation" && formData.clientId && formData.serviceId) {
      initiatePayment();
    }
  }, [formData]);

  const initiatePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Form Data being sent:", {
        return_url: `http://localhost:3000/successful/${formData.serviceId}/${formData.clientId}`,
        website_url: "http://localhost:8080/payment-callback",
        amount: 200 * 100,
        purchase_order_id: formData.serviceId,
        purchase_order_name: `Service for ${formData.clientId}`,
        customer_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        serviceId: formData.serviceId,
        clientId: formData.clientId,
        category: formData.category,
      });
  
      const response = await axios.post("http://localhost:8080/api/khalti-api", {
        return_url: `http://localhost:3000/successful/${formData.serviceId}/${formData.clientId}`,
        website_url: "http://localhost:8080/payment-callback",
        amount: 2000 * 100,
        purchase_order_id: formData.serviceId,
        purchase_order_name: `Service for ${formData.clientId}`,
        customer_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        serviceId: formData.serviceId,
        clientId: formData.clientId,
        category: formData.category,
      });
  
      if (response.data.success) {
        setPaymentUrl(response.data.data.payment_url);
        setReturnUrl(`http://localhost:3000/successful/${formData.serviceId}/${formData.clientId}`);
      } else {
        setError("Failed to get payment URL");
      }
    } catch (error) {
      console.error("Error during payment initiation:");
      console.error("Error Message:", error.message);
      console.error("Error Response Data:", error.response?.data);
      console.error("Error Status:", error.response?.status);
      console.error("Error Headers:", error.response?.headers);
  
      setError("Error initiating Khalti payment: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/payment-status/${formData.serviceId}/${formData.clientId}`
      );
      setIsPaid(response.data.paid);
      return response.data.paid; // Return the payment status
    } catch (error) {
      // setError("Error checking payment status: " + error.message);
      return false; // Return false in case of an error
    }
  };

  const handlePayNow = async () => {
    const paid = await checkPaymentStatus(); // Wait for the payment status check
    if (paid) {
      window.location.href = `http://localhost:3000/successful/${formData.serviceId}/${formData.clientId}`;
    } else if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect to the payment URL
    }
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

      const response = await axios.post("http://localhost:8080/api/bookings", bookingData);
      toast.success("Booking successful!", {
        position: "top-right",
        duration: 4000,
        style: {
          margin: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          background: '#4BB543', // Green background for success
          color: '#fff',
        },
      });
      setIsMessagePopupOpen(true);
      resetFormData();

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
      toast.error(err.response?.data?.message || "Failed to create booking", {
        position: "top-right",
        duration: 4000,
        style: {
          margin: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          background: '#FF3333', // Red background for error
          color: '#fff',
        },
      });
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

  const closeMessagePopup = () => {
    setIsMessagePopupOpen(false);
  };

  const resetFormData = () => {
    setFormData((prevData) => ({
      ...prevData,
      date: "",
      timeSlot: "",
    }));
  };

  if (!isOpen) return null;

  return (
    <>
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
                <button 
  type="submit" 
  className={styles.submitBtn}
  style={{
    backgroundColor: "#003d8f",
    color: "#fff",
  }}
>
  Submit
</button>
                </div>
              </form>
            </>
          ) : (
            <>
            <div className={styles.paynow}>
              <div className={styles.leftSection}>
                <h3>Complete Booking</h3>
                <div className={styles.clientDetails}>
                <p>Proceed with your document booking with a pre payment of Rs.2000.</p>
                  {/* <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p> */}
                </div>
                {loading && <p>Loading...</p>}
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.paymentOptions}>
                  <button onClick={handlePayNow} className={styles.submitBtn} disabled={loading}>
                    Pay Rs.2,000
                  </button>
                </div>
              </div>

              <div className={styles.rightSection}>
                {paymentUrl && (
                  <div className={styles.qrCode}>
                    <p>OR, Scan to Pay:</p>
                    <QRCode value={paymentUrl} size={200} />
                  </div>
                )}
                {returnUrl && (
                  <div className={styles.returnUrl}>
                    <p>Check the URL after QR payment:</p>
                    <a href={paymentUrl} target="_blank" rel="noopener noreferrer">{paymentUrl}</a>
                  </div>
                )}
              </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isMessagePopupOpen && (
        <MessagePopup message={successMessage} onClose={closeMessagePopup} />
      )}
    </>
  );
};

export default PopupForm;