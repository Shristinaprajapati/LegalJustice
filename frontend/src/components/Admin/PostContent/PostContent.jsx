import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import EditContent from "./EditContent";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [activeTab, setActiveTab] = useState("privacy");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const type = activeTab === "privacy" ? "privacyPolicy" : "termsAndConditions";
        const response = await axios.get(`/api/post/content/${type}`);
        if (activeTab === "privacy") {
          setPrivacyPolicy(response.data.content);
        } else {
          setTermsAndConditions(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [activeTab]);

  const handleSave = async (newContent, type) => {
    try {
      await axios.post("/api/post/content", {
        type: type === "privacy" ? "privacyPolicy" : "termsAndConditions",
        content: newContent,
      });
      alert("Content saved successfully!");

      // Update the state with the new content
      if (type === "privacy") {
        setPrivacyPolicy(newContent); // Update privacy policy content
        setIsEditingPrivacy(false); // Exit edit mode
      } else {
        setTermsAndConditions(newContent); // Update terms and conditions content
        setIsEditingTerms(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content.");
    }
  };

  const handleDelete = async (type) => {
    try {
      await axios.post("/api/post/content", {
        type: type === "privacy" ? "privacyPolicy" : "termsAndConditions",
        content: "",
      });
      if (type === "privacy") {
        setPrivacyPolicy(""); // Clear privacy policy content
      } else {
        setTermsAndConditions(""); // Clear terms and conditions content
      }
      alert(`${type === "privacy" ? "Privacy Policy" : "Terms & Conditions"} deleted!`);
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content.");
    }
  };

  return (
    <div className={styles.adminPanel}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Post Contents</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "privacy" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy Policy
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "terms" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("terms")}
          >
            Terms & Conditions
          </button>
        </div>

        <div className={styles.container}>
          {activeTab === "privacy" && (
            <div className={styles.section}>
              <div className={styles.header}>
                {!isEditingPrivacy && (
                  <div className={styles.actions}>
                    <button
                      className={`${styles.button} ${styles.editButton}`}
                      onClick={() => setIsEditingPrivacy(true)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className={`${styles.button} ${styles.deleteButton}`}
                      onClick={() => handleDelete("privacy")}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
              {isEditingPrivacy ? (
                <EditContent
                  content={privacyPolicy}
                  onSave={(newContent) => handleSave(newContent, "privacy")}
                  onCancel={() => setIsEditingPrivacy(false)}
                  type="privacy"
                />
              ) : (
                <div
                  className={styles.contentText}
                  dangerouslySetInnerHTML={{ __html: privacyPolicy || "No privacy policy content available." }}
                />
              )}
            </div>
          )}

          {activeTab === "terms" && (
            <div className={styles.section}>
              <div className={styles.header}>
                {!isEditingTerms && (
                  <div className={styles.actions}>
                    <button
                      className={`${styles.button} ${styles.editButton}`}
                      onClick={() => setIsEditingTerms(true)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className={`${styles.button} ${styles.deleteButton}`}
                      onClick={() => handleDelete("terms")}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
              {isEditingTerms ? (
                <EditContent
                  content={termsAndConditions}
                  onSave={(newContent) => handleSave(newContent, "terms")}
                  onCancel={() => setIsEditingTerms(false)}
                  type="terms"
                />
              ) : (
                <div
                  className={styles.contentText}
                  dangerouslySetInnerHTML={{ __html: termsAndConditions || "No terms and conditions content available." }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;