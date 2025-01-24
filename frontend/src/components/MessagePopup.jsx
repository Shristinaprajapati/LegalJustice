import React from "react";
import styles from "./MessagePopup.module.css";

const MessagePopup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.closeIcon} onClick={onClose}>
            X
          </span>
        </div>
        <div className={styles.messageContent}>
          <i className={`fas fa-check-circle ${styles.popupIcon}`} /> {/* Updated class */}
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;
