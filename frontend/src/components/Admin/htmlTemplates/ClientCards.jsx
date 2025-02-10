import React, { useEffect, useState } from "react";
import axios from "axios";
import DivorceTemplate from "./DivorceTemplate"; 
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css'

const ClientCards = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all clients from the backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/divorse-agreement/");
        setClients(response.data.data); // Assuming the response returns data in `data` property
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
        const response = await axios.get(`http://localhost:8080/api/divorse-agreement/${clientId}`);
        
        // Log the fetched data
        console.log("Fetched Agreement Data:", response.data.data);
    
        // Check if there's any data and set the first item of the array
        if (response.data.data && response.data.data.length > 0) {
          setSelectedClient(response.data.data[0]); // Access the first client data in the array
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

  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className={styles.maindiv}>
      <Sidebar />
      <h1 className={styles.divorceheading}>Divorce Agreements</h1>
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
        {clients.map((client) => (
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

      {/* Pass selected client data as props to DivorceTemplate */}
      {selectedClient && (
  <>


    {/* Render DivorceTemplate with the props */}
    <DivorceTemplate
      clientName={selectedClient.clientName}
      clientId={selectedClient.clientId}
      spouse1={selectedClient.spouse1}
      spouse2={selectedClient.spouse2}
      children={selectedClient.children}
      propertyDivision={selectedClient.propertyDivision}
      alimony={selectedClient.alimony}
      spouse1Address={selectedClient.spouse1Address}
      spouse2Address={selectedClient.spouse2Address}
      marriageDate={selectedClient.marriageDate}
      marriageLocation={selectedClient.marriageLocation}
      child1Name={selectedClient.child1Name}
      child1DOB={selectedClient.child1DOB}
      child2Name={selectedClient.child2Name}
      child2DOB={selectedClient.child2DOB}
      custodyArrangement={selectedClient.custodyArrangement}
      visitationSchedule={selectedClient.visitationSchedule}
      childSupport={selectedClient.childSupport}
      realPropertyDivision={selectedClient.realPropertyDivision}
      vehicleDivision={selectedClient.vehicleDivision}
      bankAccountDivision={selectedClient.bankAccountDivision}
      retirementAccountDivision={selectedClient.retirementAccountDivision}
      personalPropertyDivision={selectedClient.personalPropertyDivision}
      alimonyAmount={selectedClient.alimonyAmount}
      alimonyDuration={selectedClient.alimonyDuration}
      alimonyStartDate={selectedClient.alimonyStartDate}
      spouse1Name={selectedClient.spouse1Name}
      spouse1Debts={selectedClient.spouse1Debts}
      spouse2Name={selectedClient.spouse2Name}
      spouse2Debts={selectedClient.spouse2Debts}
      jurisdiction={selectedClient.jurisdiction}
      spouse1SignatureDate={selectedClient.spouse1SignatureDate}
      spouse2SignatureDate={selectedClient.spouse2SignatureDate}
      witnessSignatureDate={selectedClient.witnessSignatureDate}
      notarySignatureDate={selectedClient.notarySignatureDate}
    />
  </>
)}

    </div>
  );
};

export default ClientCards;
