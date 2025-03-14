import React, { useEffect, useState } from "react";
import axios from "axios";
import EmploymentTemplate from "./EmploymentcontractTemplate"; 
import Sidebar from "../Sidebar";
import styles from "./ClientCards.module.css"; 

const EmploymentCards = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all employment contracts from the backend
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employment/employment-contract");
        setContracts(response.data); // Assuming the response returns an array of contracts
      } catch (err) {
        setError("Failed to load contracts.");
      }
    };

    fetchContracts();
  }, []);

  // Handle creating/selecting a document
  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    // Log clientId when the button is clicked
    console.log("Selected Client ID:", clientId);

    const fetchContractData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/employment/employment-contract/${clientId}`
        );

        // Log the fetched data
        console.log("Fetched Contract Data:", response.data);

        // Check if there's any data and set the first item of the array
        if (response.data && response.data.length > 0) {
          setSelectedContract(response.data[0]); // Access the first contract data in the array
        } else {
          setError("No contract data found.");
        }
      } catch (err) {
        setError("Failed to fetch contract data.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter contracts based on search query
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.maindiv}>
      <Sidebar />
      <h1 className={styles.divorceheading}>Employment Contracts</h1>

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

      {/* Display Employment Contract Cards */}
      <div className={styles.clientCardsContainer}>
        {filteredContracts.map((contract) => (
          <div key={contract._id} className={styles.clientCard}>
            <h3>{contract.clientName}</h3>
            <p className={styles.clientIdStyle}>Client ID: {contract.clientId}</p>
            <button
              onClick={() => handleCreateDocument(contract.clientId)} // Pass the client ID to fetch contract data
              className={styles.createDocumentButton}
            >
              See Document
            </button>
          </div>
        ))}
      </div>

      {/* Show loading spinner while fetching contract data */}
      {loading && <p className={styles.loadingMessage}>Loading contract data...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Pass selected contract data as props to EmploymentTemplate */}
      {selectedContract && (
        <>
          {/* Render EmploymentTemplate with the props */}
          <EmploymentTemplate
            clientName={selectedContract.clientName}
            clientId={selectedContract.clientId}
            employerName={selectedContract.employerName}
            employeeName={selectedContract.employeeName}
            jobTitle={selectedContract.jobTitle}
            startDate={selectedContract.startDate}
            endDate={selectedContract.endDate}
            salary={selectedContract.salary}
            paymentFrequency={selectedContract.paymentFrequency}
            workHours={selectedContract.workHours}
            workLocation={selectedContract.workLocation}
            probationPeriod={selectedContract.probationPeriod}
            benefits={selectedContract.benefits}
            terminationConditions={selectedContract.terminationConditions}
            confidentialityAgreement={selectedContract.confidentialityAgreement}
            nonCompeteAgreement={selectedContract.nonCompeteAgreement}
            jurisdiction={selectedContract.jurisdiction}
            employerSignatureDate={selectedContract.employerSignatureDate}
            employeeSignatureDate={selectedContract.employeeSignatureDate}
            witnessSignatureDate={selectedContract.witnessSignatureDate}
            notarySignatureDate={selectedContract.notarySignatureDate}
          />
        </>
      )}
    </div>
  );
};

export default EmploymentCards;