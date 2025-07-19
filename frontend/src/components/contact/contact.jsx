import React, { useState } from "react";
import axios from "axios";
import styles from "./contact.module.css";
import Header from "../Main/Header.jsx";
import Footer from "../Footer.jsx";
import toast, { Toaster } from 'react-hot-toast';

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        style: {
          background: '#FF5252',
          color: '#fff',
          borderLeft: '4px solid #D32F2F',
          borderRadius: '4px',
          padding: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/contact`, {
        name,
        email,
        message,
      });

      toast.success("Message sent successfully!", {
        position: "top-right",
        style: {
          background: '#4CAF50',
          color: '#fff',
          borderLeft: '4px solid #2E7D32',
          borderRadius: '4px',
          padding: '16px',
          minWidth: '300px'
        }
      });
      
      // Clear form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("Error sending message. Please try again.", {
        position: "top-right",
        style: {
          background: '#FF5252',
          color: '#fff',
          borderLeft: '4px solid #D32F2F',
          borderRadius: '4px',
          padding: '16px',
          minWidth: '300px'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* Toaster positioned top-right with custom styling */}
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
      
      <Header />
      <main className={styles.contactContainer}>
        <section className={styles.contactInfo}>
          <div className={styles.contactHeader}>
            <span className={styles.sectionTag}>Contact</span>
            <h1
  className={styles.mainHeading}
  style={{
    color: "#0a3d62", // a nice dark bluish tone
    textShadow: "none",
  }}
>
  Let's Contact 
</h1>

            <p className={styles.introText}>
            Have questions or need assistance? Our team is here to help you with any inquiries. Fill out the form and we'll get back to you within 24 hours.
            </p>
          </div>
          <div className={styles.accentLine}></div>
        </section>

        <section className={styles.contactFormSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Get in Touch</h2>
            <p className={styles.formSubtitle}>
              Fill out the form below and we'll respond as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.inputLabel}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.inputLabel}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.inputLabel}>Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message here..."
                className={styles.formTextarea}
                rows="5"
                required
              />
            </div>

            <button 
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactForm;