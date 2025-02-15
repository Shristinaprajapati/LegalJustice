import React, { useState } from "react";
import axios from "axios";
import styles from "./SendDocument.module.css";

const SendDocumentPopup = ({ email, onClose }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSendEmail = async () => {
    if (!email || !subject || !message) {
      alert("Please fill in all fields before sending.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);
    if (file) {
      formData.append("file", file);
    }

    setLoading(true);
    try {
      // Updated URL to match the backend route
      const response = await axios.post("http://localhost:8080/sendemail/mail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Email sent successfully!");
        onClose();
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <span className={styles.closeIcon} onClick={onClose}>×</span>
        <h3 className={styles.title}>Send Document</h3>
        <p className={styles.email}>
          <strong>Email:</strong> {email}
        </p>

        <label className={styles.label}>Subject:</label>
        <input
          type="text"
          className={styles.input}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
        />

        <label className={styles.label}>Message:</label>
        <textarea
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        ></textarea>

        <label className={styles.label}>Attach File:</label>
        <input
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
        />

        <div className={styles.buttonContainer}>
          <button
            className={styles.sendButton}
            onClick={handleSendEmail}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendDocumentPopup;
