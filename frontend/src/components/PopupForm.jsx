import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PopupForm.module.css";

const PopupForm = ({ isOpen, onClose, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success feedback

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setSuccessMessage(""); // Clear success message when user changes input
    setError(""); // Clear error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(""); // Clear previous success message

    try {
      const bookingData = {
        serviceId: formData.serviceId,
        clientId: formData.clientId,
        date: formData.date,
        timeSlot: formData.timeSlot,
      };

      const response = await axios.post(
        "http://localhost:8080/api/bookings",
        bookingData
      );

      setSuccessMessage(response.data.message || "Booking created successfully!");
      resetFormData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
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

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.closeIcon} onClick={onClose}>
            X
          </span>
        </div>
        <h3>Book Service</h3>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Service:
            <input
              type="text"
              name="service"
              value={formData.service}
              readOnly
              required
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              readOnly
              required
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Time Slot:
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a time slot</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
            </select>
          </label>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
