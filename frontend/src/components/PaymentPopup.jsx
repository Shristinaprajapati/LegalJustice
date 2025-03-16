import React, { useEffect, useState } from "react";
import { QRCode } from "react-qr-code"; // Using react-qr-code as an alternative
import axios from "axios";
import styles from "./PaymentPopup.module.css";

const PaymentPopup = ({ clientDetails, onClose, onPayNow }) => {
  // Log all the data that the component receives
  console.log("Received Props:", { clientDetails, onClose, onPayNow });

  const [paymentUrl, setPaymentUrl] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [returnUrl, setReturnUrl] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  // Fetch the payment URL when the popup opens
  useEffect(() => {
    const initiatePayment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          "http://localhost:8080/api/khalti-api",
          {
            return_url: `http://localhost:3000/successful/${clientDetails.serviceId}/${clientDetails.clientId}`,
            website_url: "http://localhost:8080/payment-callback",
            amount: 40 * 100, // Ensure this is in the correct unit (paisa or NPR)
            purchase_order_id: clientDetails.serviceId,
            purchase_order_name: `Service for ${clientDetails.clientId}`,
            customer_info: {
              name: clientDetails.name,
              email: clientDetails.email,
              phone: clientDetails.phone,
            },
            serviceId: clientDetails.serviceId,
            clientId: clientDetails.clientId,
            category: clientDetails.category,
          }
        );
        console.log("Response data:", response.data);
        console.log("Payment URL:", response.data.data.payment_url);

        if (response.data.success) {
          setPaymentUrl(response.data.data.payment_url);
          setReturnUrl(`http://localhost:3000/successful/${clientDetails.serviceId}/${clientDetails.clientId}`);
        } else {
          setError("Failed to get payment URL");
        }
      } catch (error) {
        console.error("Full error response:", error.response?.data); // Log the full error response
        setError("Error initiating Khalti payment: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };

    initiatePayment();
  }, [clientDetails]);

  // Function to check payment status
  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/payment-status/${clientDetails.serviceId}/${clientDetails.clientId}`
      );
      setIsPaid(response.data.paid);
      return response.data.paid; // Return the payment status
    } catch (error) {
      setError("Error checking payment status: " + error.message);
      return false; // Return false in case of an error
    }
  };

  // Handle "Pay Now" button click
  const handlePayNow = async () => {
    const paid = await checkPaymentStatus(); // Wait for the payment status check
    if (paid) {
      window.location.href = `http://localhost:3000/successful/${clientDetails.serviceId}/${clientDetails.clientId}`;
    } else if (paymentUrl) {
      onPayNow();
    }
  };

  // Function to close the popup
  const handleClose = () => {
    setIsVisible(false); // Close the popup
    onClose(); // Call the parent onClose function if needed
  };

  return isVisible ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <h3>Payment Details</h3>
          <div className={styles.clientDetails}>
            <p><strong>Name:</strong> {clientDetails.name}</p>
            <p><strong>Email:</strong> {clientDetails.email}</p>
            <p><strong>Phone:</strong> {clientDetails.phone}</p>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.paymentOptions}>
            <button onClick={handlePayNow} className={styles.submitBtn} disabled={isLoading}>
              Pay Now
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.modalHeader}>
            <span className={styles.closeIcon} onClick={handleClose}>X</span>
          </div>
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
    </div>
  ) : null;
};

export default PaymentPopup;