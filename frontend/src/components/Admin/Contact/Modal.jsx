import { useState } from "react";
import styles from './Modal.module.css'; 

const Modal = ({ contact, onClose, onSendReply }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // // Log email, subject, and message for verification
    // console.log("Email:", contact.email);
    // console.log("Subject:", subject);
    // console.log("Message:", message);

    // Send email via NodeMailer
    onSendReply(contact.email, subject, message);  // Use contact's email, and the admin's subject and message
    onClose();  // Close modal after sending the reply
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Cross sign to close modal */}
        <span className={styles.closeIcon} onClick={onClose}>×</span>

        <h2>Reply to {contact.name}</h2>

        <form onSubmit={handleSubmit}>
          {/* Display email in a non-editable manner */}
          <div className={styles.formGroup}>
            <label>Email:</label>
            <p className={styles.emailDisplay}>{contact.email}</p> {/* Display email */}
          </div>

          <div className={styles.formGroup}>
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button type="submit" className={styles.sendButton}>Send Reply</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
