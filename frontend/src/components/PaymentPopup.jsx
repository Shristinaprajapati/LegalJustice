import React from "react";
import styles from "./PopupForm.module.css";

const PaymentPopup = ({ clientDetails, onClose, onPayNow }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.closeIcon} onClick={onClose}>
            X
          </span>
        </div>
        <h3>Payment Details</h3>
        <div className={styles.clientDetails}>
          <p><strong>Name:</strong> {clientDetails.name}</p>
          <p><strong>Email:</strong> {clientDetails.email}</p>
          <p><strong>Phone:</strong> {clientDetails.phone}</p>
        </div>
        <div className={styles.paymentOptions}>
          <button onClick={onPayNow} className={styles.submitBtn}>
            Pay Now
          </button>
          <div className={styles.qrCode}>
            {/* Add your QR code image or component here */}
            <img src="path_to_your_qr_code_image.png" alt="QR Code" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;