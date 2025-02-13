import React, { useEffect, useState } from "react";
import axios from "axios";
import PartnershipTemplate from "./PartnershipTemplate"; 
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css';

const PartnershipCard = () => {
  const [clients, setClients] = useState([]); // Always initialize as an empty array
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all clients (agreements) from the backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/partnership-agreement/");
        
        // Ensure the response contains an array of agreements
        if (Array.isArray(response.data)) {
          setClients(response.data); // Set clients if the response is an array
        } else {
          setError("Invalid response structure.");
        }
      } catch (err) {
        setError("Failed to load clients.");
      }
    };
  
    fetchClients();
  }, []);

  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    // Log clientId when the button is clicked
    console.log("Selected Client ID:", clientId);

    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/partnership-agreement/${clientId}`);

        // Log the fetched data
        console.log("Fetched Agreement Data:", response.data);

        // Check if there's any data and set the first item of the array
        if (response.data && response.data.length > 0) {
          setSelectedClient(response.data[0]); // Access the first client data in the array
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.maindiv}>
      <Sidebar />
      <h1 className={styles.divorceheading}>Partnership Agreements</h1>
      
      {/* Search Bar in the Right Section */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search by Name or ID"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className={styles.clientCardsContainer}>
        {filteredClients.map((client) => (
          <div key={client._id} className={styles.clientCard}>
            <h3>{client.clientName}</h3>
            <p className={styles.clientIdStyle}>Client ID: {client.clientId}</p>
            <button
              onClick={() => handleCreateDocument(client.clientId)} // Pass the client ID to fetch agreement data
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

      {/* Pass selected client data as props to PartnershipTemplate */}
      {selectedClient && (
  <>
    {console.log("Selected Client Data Passed to PartnershipTemplate:", selectedClient)}
    <PartnershipTemplate
      clientName={selectedClient.clientName}
      clientId={selectedClient.clientId}
      partner1Name={selectedClient.partner1Name}
      partner2Name={selectedClient.partner2Name}
      businessName={selectedClient.businessName}
      businessPurpose={selectedClient.businessPurpose}
      businessAddress={selectedClient.businessAddress}
      capitalContribution1={selectedClient.capitalContribution1}
      capitalContribution2={selectedClient.capitalContribution2}
      profitSharingRatio={selectedClient.profitShare}
      decisionMaking={selectedClient.decisionMaking}
      disputeResolution={selectedClient.disputeResolution}
      agreementStartDate={selectedClient.partnershipStartDate}
      agreementEndDate={selectedClient.partnershipEndDate}
      jurisdiction={selectedClient.jurisdiction}
      partner1SignatureDate={selectedClient.partner1SignatureDate}
      partner2SignatureDate={selectedClient.partner2SignatureDate}
      witnessSignatureDate={selectedClient.witnessSignatureDate}
      notarySignatureDate={selectedClient.notarySignatureDate}
    />
  </>
)}


    </div>
  );
};

export default PartnershipCard;
