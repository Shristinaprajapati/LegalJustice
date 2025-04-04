import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Modal from "./Modal";
import { Icon } from '@iconify/react';
import styles from "./AdminContact.module.css";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/contact");
        setContacts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleReplyClick = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedContact(null);
  };

  const handleSendReply = (email, subject, message) => {
    axios
      .post("/reply/send-reply", { email, subject, message })
      .then((response) => {
        console.log("Email sent successfully:", response);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Contact Messages</h2>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.contactTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.noData}>No contact messages found</td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td className={styles.messageCell}>{contact.message}</td>
                      <td className={styles.actionsCell}>
                        <button
                          onClick={() => handleReplyClick(contact)}
                          className={styles.replyButton}
                        >
                          <Icon icon="mdi:email-outline" /> Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && selectedContact && (
        <Modal
          contact={selectedContact}
          onClose={handleCloseModal}
          onSendReply={handleSendReply}
        />
      )}
    </div>
  );
};

export default AdminContact;