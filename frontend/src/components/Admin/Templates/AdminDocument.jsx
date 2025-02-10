import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import styles from "./AdminDocuments.module.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AdminDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const categories = [
    'All', 'Family Law', 'Real Estate Documents', 'Intellectual Property', 
    'Legal Letters', 'Litigation and Dispute Resolution'
  ];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/document/");
        setDocuments(response.data.agreements);
        setLoading(false);
      } catch (err) {
        setError("Failed to load documents.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleEditDocument = (doc) => {
    navigate('/editdocument', { state: { document: doc } }); // Pass document details
  };

  const filteredDocuments = selectedCategory === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      
      <div className={styles.content}>
        <h2>Admin Documents</h2>
        
        <div className={styles.categorySelector}>
          {categories.map(category => (
            <button 
              key={category}
              className={selectedCategory === category ? styles.active : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className={styles.documentGrid}>
          {loading && <p>Loading documents...</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {filteredDocuments.length === 0 && !loading && (
            <p>No documents available for this category.</p>
          )}
          {filteredDocuments.map((doc) => (
            <div key={doc._id} className={styles.documentCard}>
              <span className={styles.docName}>{doc.title}</span>
              <div className={styles.documentInfo}>
                <p><strong>Client ID:</strong> {doc.clientId}</p>
                <p><strong>Client Name:</strong> {doc.clientName}</p>
              </div>
              <button onClick={() => handleEditDocument(doc)}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDocument;
