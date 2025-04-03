import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import styles from "./AdminDocuments.module.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';

const AdminDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Define categories and their associated document titles
  const categories = {
    'All': 'All',
    'Legal Agreements': ['Divorce Agreement', 'Property Transfer Agreement'],
    'Business & Employment Agreements': ['Partnership Agreement', 'Employment Contract'],
    'Personal & Family Agreements': ['Marriage Proof Document'],
    'Real Estate Agreements': ['Rental Agreement']
  };

  // Function to determine category based on title
  const getCategoryFromTitle = (title) => {
    for (const [category, titles] of Object.entries(categories)) {
      if (category === 'All') continue;
      if (titles.includes(title)) {
        return category;
      }
    }
    return 'Uncategorized';
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/document/");
        // Add category to each document based on title
        const categorizedDocuments = response.data.agreements.map(doc => ({
          ...doc,
          category: getCategoryFromTitle(doc.title)
        }));
        setDocuments(categorizedDocuments);
        setFilteredDocuments(categorizedDocuments);
        setLoading(false);
      } catch (err) {
        setError("Failed to load documents.");
        setLoading(false);
        console.error("Error fetching documents:", err);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    // Apply both category filter and search filter
    let result = documents;
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(doc => categories[selectedCategory].includes(doc.title));
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doc => 
        doc.clientId.toLowerCase().includes(term) ||
        (doc.clientName && doc.clientName.toLowerCase().includes(term)) ||
        doc.title.toLowerCase().includes(term)
      );
    }
    
    setFilteredDocuments(result);
  }, [selectedCategory, searchTerm, documents]);

  const handleEditDocument = async (doc) => {
    console.log("Client ID:", doc.clientId);
    
    try {
      const response = await axios.get(`http://localhost:8080/api/users/client?clientId=${doc.clientId}`);
      
      if (response.status === 200 && response.data.email) {
        const email = response.data.email;
        console.log("Client Email:", email);
  
        navigate('/editdocument', { state: { document: doc, email: email } });
      } else {
        console.error("Email not found for this client.");
        alert("Email not found for this client.");
      }
    } catch (error) {
      console.error("Error fetching client email:", error);
      alert("Failed to fetch client details.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      
      <div className={styles.content}>
        <h2>Admin Documents</h2>
        
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by Client ID or Document Title"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.categorySelector}>
          {Object.keys(categories).map(category => (
            <button 
              key={category}
              className={selectedCategory === category ? styles.active : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className={styles.documentsGrid}>
          {loading && <p>Loading documents...</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          {!loading && filteredDocuments.length === 0 && (
            <div className={styles.emptyState}>No documents found matching your criteria.</div>
          )}
          
          {filteredDocuments.map((doc) => (
            <div key={doc._id} className={styles.documentCard}>
              <div className={styles.cardIcon}>
              <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path
      fill="#4A90E2"
      d="M6 2C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6z"
    />
    <path fill="#FFF" d="M14 3.5V9h5.5L14 3.5z" />
    <rect x="7" y="12" width="10" height="2" rx="1" fill="#FFF" />
    <rect x="7" y="16" width="7" height="2" rx="1" fill="#FFF" />
  </svg>
                <span className={styles.fileTypeBadge}>{doc.title.split(' ')[0]}</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{doc.title}</div>
                <div className={styles.cardMeta}>
                  <span>Client: {doc.clientName || 'N/A'}</span>
                  <span>ID: {doc.clientId}</span>
                </div>
              </div>
              <button 
                onClick={() => handleEditDocument(doc)}
                className={styles.editIconButton} 
                aria-label="Edit document"
              >
                <FiEdit2 className={styles.editIcon} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDocument;