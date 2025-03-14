import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyTransferTemplate from "./PropertytransferTemplate"; 
import Sidebar from "../Sidebar";
import styles from "./ClientCards.module.css"; // Reuse the same styles or create a new CSS file

const PropertyCards = () => {
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all property transfer agreements from the backend
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/propertytransfer/property-transfer-agreement");
        setAgreements(response.data); // Assuming the response returns an array of agreements
      } catch (err) {
        setError("Failed to load agreements.");
      }
    };

    fetchAgreements();
  }, []);

  // Handle creating/selecting a document
  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    // Log clientId when the button is clicked
    console.log("Selected Client ID:", clientId);

    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/propertytransfer/property-transfer-agreement/${clientId}`
        );

        // Log the fetched data
        console.log("Fetched Agreement Data:", response.data);

        // Check if there's any data and set the first item of the array
        if (response.data && response.data.length > 0) {
          setSelectedAgreement(response.data[0]); // Access the first agreement data in the array
        } else {
          setError("No agreement data found.");
        }
      } catch (err) {
        setError("Failed to fetch agreement data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgreementData();
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter agreements based on search query
  const filteredAgreements = agreements.filter(
    (agreement) =>
      agreement.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.maindiv}>
      <Sidebar />
      <h1 className={styles.divorceheading}>Property Transfer Agreements</h1>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search by Name or ID"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Display Property Transfer Agreement Cards */}
      <div className={styles.clientCardsContainer}>
        {filteredAgreements.map((agreement) => (
          <div key={agreement._id} className={styles.clientCard}>
            <h3>{agreement.clientName}</h3>
            <p className={styles.clientIdStyle}>Client ID: {agreement.clientId}</p>
            <button
              onClick={() => handleCreateDocument(agreement.clientId)} // Pass the client ID to fetch agreement data
              className={styles.createDocumentButton}
            >
              See Document
            </button>
          </div>
        ))}
      </div>

      {/* Show loading spinner while fetching agreement data */}
      {loading && <p className={styles.loadingMessage}>Loading agreement data...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Pass selected agreement data as props to PropertyTransferTemplate */}
      {selectedAgreement && (
        <>
          {/* Render PropertyTransferTemplate with the props */}
          <PropertyTransferTemplate
            clientName={selectedAgreement.clientName}
            clientId={selectedAgreement.clientId}
            transferorName={selectedAgreement.transferorName}
            transfereeName={selectedAgreement.transfereeName}
            propertyAddress={selectedAgreement.propertyAddress}
            propertyDescription={selectedAgreement.propertyDescription}
            transferDate={selectedAgreement.transferDate}
            considerationAmount={selectedAgreement.considerationAmount}
            paymentTerms={selectedAgreement.paymentTerms}
            transferorSignatureDate={selectedAgreement.transferorSignatureDate}
            transfereeSignatureDate={selectedAgreement.transfereeSignatureDate}
            witnessSignatureDate={selectedAgreement.witnessSignatureDate}
            notarySignatureDate={selectedAgreement.notarySignatureDate}
            jurisdiction={selectedAgreement.jurisdiction}
            additionalTerms={selectedAgreement.additionalTerms}
          />
        </>
      )}
    </div>
  );
};

export default PropertyCards;