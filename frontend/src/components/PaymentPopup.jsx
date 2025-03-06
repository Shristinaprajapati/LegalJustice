import React, { useEffect, useState } from "react";
import { QRCode } from "react-qr-code"; // Using react-qr-code as an alternative
import axios from "axios";
import styles from "./PopupForm.module.css";

const PaymentPopup = ({ clientDetails, onClose, onPayNow }) => {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [returnUrl, setReturnUrl] = useState("");

  // Fetch the payment URL when the popup opens
  useEffect(() => {
    const initiatePayment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          "http://localhost:8080/api/khalti-api",
          {
            return_url: `http://localhost:3000/payments/khalti-callback`,
            website_url: "http://localhost:3000",
            amount: 3 * 100,
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
        setError("Error initiating Khalti payment: " + error.message);
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
    } catch (error) {
      setError("Error checking payment status: " + error.message);
    }
  };

  // Handle "Pay Now" button click
  const handlePayNow = async () => {
    await checkPaymentStatus();

    if (isPaid) {
      window.location.href = `http://localhost:3000/successful/${clientDetails.serviceId}/${clientDetails.clientId}`;
    } else if (paymentUrl) {
      onPayNow();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.closeIcon} onClick={onClose}>X</span>
        </div>
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
          {paymentUrl && (
            <div className={styles.qrCode}>
              <p>Scan to Pay:</p>
              <QRCode value={paymentUrl} size={200} />
            </div>
          )}
          {returnUrl && (
            <div className={styles.returnUrl}>
        <p>Check the URL:</p>
        <a href={returnUrl} target="_blank" rel="noopener noreferrer">{returnUrl}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
