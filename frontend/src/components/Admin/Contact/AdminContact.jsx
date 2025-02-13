import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Modal from "./Modal"; // Import Modal
import styles from "./AdminContact.module.css";

const Dashboard = () => {
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
    // Call the API to send the email using NodeMailer
    axios
      .post("/reply/send-reply", { email, subject, message })
      .then((response) => {
        console.log("Email sent successfully:", response);
        handleCloseModal(); // Close the modal after sending
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.content}>
        <h1>Contact Messages</h1>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.message}</td>
                    <td>
                      <button
                        onClick={() => handleReplyClick(contact)}
                        className={styles.replyButton}
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
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

export default Dashboard;
