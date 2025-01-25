import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import styles from "./AdminDocuments.module.css";

const AdminDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = [
    'All', 'Family Law', 'Real Estate Documents', 'Intellectual Property', 
    'Legal Letters', 'Litigation and Dispute Resolution'
  ];

  useEffect(() => {
    // Fetch saved documents from the server (for now we will use mock data)
    const fetchDocuments = async () => {
      const mockDocuments = [
        { name: 'Divorce Agreement', category: 'Family Law' },
        { name: 'Real Estate Contract', category: 'Real Estate Documents' },
        { name: 'Trademark Registration', category: 'Intellectual Property' },
        { name: 'Notice of Legal Action', category: 'Legal Letters' },
        { name: 'Litigation Settlement Agreement', category: 'Litigation and Dispute Resolution' },
        // More mock documents can be added here
      ];
      setDocuments(mockDocuments);
    };
    fetchDocuments();
  }, []);

  const handleEditDocument = (docName) => {
    // You can load and display the content of the document here and allow admin to edit
    alert(`Editing ${docName}`);
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
          {filteredDocuments.length === 0 ? (
            <p>No documents available for this category.</p>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc.name} className={styles.documentCard}>
                <span>{doc.name}</span>
                <button onClick={() => handleEditDocument(doc.name)}>Edit</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDocument;
