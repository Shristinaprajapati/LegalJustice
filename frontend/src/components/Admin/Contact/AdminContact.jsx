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
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedMessages([]);
    }
  };

  const toggleSelectMessage = (id) => {
    setSelectedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(messageId => messageId !== id) 
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return;
    
    setDeleteLoading(true);
    try {
      await Promise.all(
        selectedMessages.map(id => 
          axios.delete(`/api/contact/${id}`)
        )
      );
      
      // Refresh the contact list after deletion
      const response = await axios.get("/api/contact");
      setContacts(response.data);
      setSelectedMessages([]);
      setSelectMode(false);
    } catch (error) {
      console.error("Error deleting messages:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSingleDelete = async (id) => {
    try {
      await axios.delete(`/api/contact/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Contact Messages</h2>
          <div className={styles.actionButtons}>
            {selectMode ? (
              <>
                <button 
                  onClick={handleBulkDelete} 
                  className={styles.deleteSelectedButton}
                  disabled={selectedMessages.length === 0 || deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : `Delete Selected (${selectedMessages.length})`}
                </button>
                <button 
                  onClick={toggleSelectMode} 
                  className={styles.cancelSelectButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={toggleSelectMode} 
                className={styles.selectButton}
              >
                <Icon icon="mdi:checkbox-marked-outline" /> Select Messages
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.contactTable}>
              <thead>
                <tr>
                  {selectMode && <th className={styles.checkboxHeader}></th>}
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={selectMode ? "5" : "4"} className={styles.noData}>
                      No contact messages found
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id} className={selectedMessages.includes(contact._id) ? styles.selectedRow : ''}>
                      {selectMode && (
                        <td className={styles.checkboxCell}>
                          <input
                            type="checkbox"
                            checked={selectedMessages.includes(contact._id)}
                            onChange={() => toggleSelectMessage(contact._id)}
                            className={styles.checkboxInput}
                          />
                        </td>
                      )}
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td className={styles.messageCell}>{contact.message}</td>
                      <td className={styles.actionsCell}>
                        {!selectMode && (
                          <>
                            <button
                              onClick={() => handleReplyClick(contact)}
                              className={styles.replyButton}
                            >
                              <Icon icon="mdi:email-outline" /> Reply
                            </button>
                            <button
                              onClick={() => handleSingleDelete(contact._id)}
                              className={styles.deleteButton}
                            >
                              <Icon icon="mdi:trash-can-outline" /> Delete
                            </button>
                          </>
                        )}
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