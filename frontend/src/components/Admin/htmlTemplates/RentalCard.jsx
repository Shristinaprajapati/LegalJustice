import React, { useEffect, useState } from "react";
import axios from "axios";
import RentalTemplate from "./RentalTemplate"; // Import the RentalTemplate component
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css'; // Reuse the same styles or create a new one

const RentalCard = () => {
  const [rentalAgreements, setRentalAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all rental agreements from the backend
  useEffect(() => {
    const fetchRentalAgreements = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rental/rental-agreements");
        setRentalAgreements(response.data); // Assuming the response returns an array of rental agreements
      } catch (err) {
        setError("Failed to load rental agreements.");
      }
    };

    fetchRentalAgreements();
  }, []);

  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    // Log clientId when the button is clicked
    console.log("Selected Client ID:", clientId);

    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/rental/rental-agreements/${clientId}`);
        
        // Log the fetched data
        console.log("Fetched Rental Agreement Data:", response.data);

        // Check if there's any data and set the first item of the array
        if (response.data && response.data.length > 0) {
          setSelectedAgreement(response.data[0]); // Access the first agreement data in the array
        } else {
          setError("No rental agreement data found.");
        }
      } catch (err) {
        setError("Failed to fetch rental agreement data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgreementData();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAgreements = rentalAgreements.filter((agreement) =>
    agreement.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agreement.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.maindiv}>
      <Sidebar />
      <h1 className={styles.divorceheading}>Rental Agreements</h1>

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
      {loading && <p className={styles.loadingMessage}>Loading rental agreement data...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Pass selected agreement data as props to RentalTemplate */}
      {selectedAgreement && (
        <>
          {/* Render RentalTemplate with the props */}
          <RentalTemplate
            clientName={selectedAgreement.clientName}
            clientId={selectedAgreement.clientId}
            landlordName={selectedAgreement.landlordName}
            tenantName={selectedAgreement.tenantName}
            propertyAddress={selectedAgreement.propertyAddress}
            rentalStartDate={selectedAgreement.rentalStartDate}
            rentalEndDate={selectedAgreement.rentalEndDate}
            monthlyRent={selectedAgreement.monthlyRent}
            securityDeposit={selectedAgreement.securityDeposit}
            leaseTerm={selectedAgreement.leaseTerm}
            landlordSignature={selectedAgreement.landlordSignature}
            tenantSignature={selectedAgreement.tenantSignature}
            witnessSignature={selectedAgreement.witnessSignature}
            notarySignature={selectedAgreement.notarySignature}
            landlordContact={selectedAgreement.landlordContact}
            tenantContact={selectedAgreement.tenantContact}
            propertyDescription={selectedAgreement.propertyDescription}
            utilitiesIncluded={selectedAgreement.utilitiesIncluded}
            lateFeePolicy={selectedAgreement.lateFeePolicy}
            maintenanceResponsibilities={selectedAgreement.maintenanceResponsibilities}
            petPolicy={selectedAgreement.petPolicy}
            terminationClause={selectedAgreement.terminationClause}
          />
        </>
      )}
    </div>
  );
};

export default RentalCard;