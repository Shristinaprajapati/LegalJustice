import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TemplatePost.module.css"; // Importing the CSS module
import Sidebar from "../Sidebar"; 

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);

  // useEffect to fetch documents (uncomment when needed)
  // useEffect(() => {
  //   const fetchDocuments = async () => {
  //     const response = await axios.get("http://localhost:8080/api/documents");
  //     setDocuments(response.data);
  //   };
  //   fetchDocuments();
  // }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar /> {/* Sidebar component */}
      <div className={styles.content}>
        <h1>Documents Submitted by Clients</h1>
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <div key={index} className={styles.documentCard}>
              <div dangerouslySetInnerHTML={{ __html: doc }} />
            </div>
          ))
        ) : (
          <p>No documents to display.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;
