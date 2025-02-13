import { useState } from "react";
import axios from "axios";
import Header from "../Main/Header.jsx";
import styles from "./contact.module.css"; // Import the CSS file

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await axios.post("http://localhost:8080/api/contact", {
        name,
        email,
        message,
      });

      setStatus("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <div className={styles.contactFormContainer}>
        <h2 className={styles.title}>Contact Us</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <textarea
              name="message"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className={styles.textarea}
            ></textarea>
          </div>

          <div className={styles.submitGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>

          {status && <p className={styles.status}>{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
