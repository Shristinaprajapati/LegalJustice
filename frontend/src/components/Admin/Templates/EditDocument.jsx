import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from "react-icons/ai";
import JoditEditor from "jodit-react";
import Sidebar from "../Sidebar";
import axios from "axios";
import { jsPDF } from "jspdf";
import styles from "./EditDocument.module.css";
import SendDocumentPopup from "./SendDocument"; 

const EditDocument = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const document = location.state?.document;
  const { email } = location.state || {};

  const [content, setContent] = useState(document?.agreementContent || "");
  const [clientEmail, setClientEmail] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [clientID, setClientID] = useState(null);

  if (!document) {
    return <p className={styles.noDocument}>No document data found.</p>;
  }

  // Function to save the document
  const handleSave = async () => {
    try {
      const updatedDocument = {
        title: document.title,
        clientId: document.clientId,
        clientName: document.clientName,
        agreementContent: content,
      };

      const response = await axios.post(
        "http://localhost:8080/api/document/save", 
        JSON.stringify(updatedDocument), 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Document saved successfully!");
      } else {
        alert("Failed to save the document.");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Error saving document.");
    }
  };

  const handleSendDocument = () => {
    // Use the document's clientId if available, otherwise use the state clientID
    const currentClientID = document?.clientId || clientID;
    const currentClientEmail = email || document?.clientEmail;
    
    if (currentClientEmail && currentClientID) {
      setClientEmail(currentClientEmail);
      setClientID(currentClientID); // Update state if using document's clientId
      setShowPopup(true);
    } else {
      alert("Client email or clientId not found.");
    }
  };
  
  


  const handleConvertToPDF = () => {
    try {
        const cleanContent = content
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // Remove <style> tags and their content
        .replace(/<\/?[^>]+(>|$)/g, ""); // Remove all other HTML tags but keep text
  
      // Create a new PDF document
      const doc = new jsPDF();
  
      // Set font to Arial with size 12 for the entire document
      doc.setFont("Arial", "normal");
      doc.setFontSize(12);
  
      // Define margin and line spacing
      const leftMargin = 20;
      const topMargin = 20;
      const rightMargin = 190; // Adjust based on page width (210 mm - leftMargin)
      const bottomMargin = 20;
      const lineSpacing = 5.5; // Set consistent line spacing
  
      // Extract client name for the document title
      const clientName = document.clientName || "Unknown_Client";
      
      // Add title and metadata on the first page
      doc.setFont("Arial", "bold");
      doc.text(`Agreement for ${clientName}`, leftMargin, topMargin);
  
      doc.setFont("Arial", "normal");
      doc.text(`Title: ${document.title}`, leftMargin, topMargin + 10);
      doc.text("Agreement Content:", leftMargin, topMargin + 20);
  
      // Add a new page for the agreement content to start from the second page
      doc.addPage();
  
      // Split content into multiple lines if it's too long
      const contentLines = doc.splitTextToSize(cleanContent, rightMargin - leftMargin);
      let yPosition = topMargin;
  
      // Write content and handle multiple pages
      for (let i = 0; i < contentLines.length; i++) {
        if (yPosition + lineSpacing > 270 - bottomMargin) {  // Check if the current position exceeds the page limit
          doc.addPage();  // Add a new page
          yPosition = topMargin;  // Reset the position to the top of the new page
        }
  
        // Align text to the left by setting the alignment to "left"
        doc.text(contentLines[i], leftMargin, yPosition, { align: "left" });
  
        yPosition += lineSpacing; // Move the Y position down by the line spacing
      }
  
      // Save the PDF with the client's name
      doc.save(`${clientName}_agreement.pdf`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Back Button with Icon */}
        <button className={styles.backButton} onClick={() => navigate("/document")}>
          <AiOutlineArrowLeft className={styles.backIcon} />
        </button>

        <div className={styles.titleSection}>
          <h2 className={styles.title}>Edit Document</h2>
        </div>

        <div className={styles.documentDetails}>
          <div className={styles.documentInfo}>
            <p className={styles.documentText}><strong>Title:</strong> {document.title}</p>
            <p className={styles.documentText}><strong>Client ID:</strong> {document.clientId}</p>
            <p className={styles.documentText}><strong>Client Name:</strong> {document.clientName}</p>
          </div>
          <button className={styles.sendButton} onClick={handleSendDocument}>
            Send Document
          </button>
        </div>

        <div className={styles.editorContainer}>
          {/* <p className={styles.editorLabel}><strong>Agreement Content:</strong></p> */}
          <JoditEditor
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        <div className={styles.buttonsWrapper}>
          <div className={styles.saveButtonContainer}>
            <button className={styles.saveButton} onClick={handleSave}>
              Save Document
            </button>
          </div>

          <div className={styles.convertButtonContainer}>
            <button className={styles.convertButton} onClick={handleConvertToPDF}>
              Convert to PDF
            </button>
          </div>
        </div>
      </div>

      {showPopup && clientEmail && clientID && (
        <SendDocumentPopup 
          email={clientEmail}
          clientId={clientID} // Pass the clientID to the popup
          onClose={() => setShowPopup(false)} 
        />
      )}
    </div>
  );
};

export default EditDocument;