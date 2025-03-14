import React, { useEffect, useState } from "react";
import axios from "axios";
import MarriageProofDocument from "./MarriageproofTemplate"; 
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css'; 

const MarriageProofCard = () => {
  const [marriageProofs, setMarriageProofs] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all marriage proof documents from the backend
  useEffect(() => {
    const fetchMarriageProofs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/marriageproof/marriage-proofs");
        setMarriageProofs(response.data); // Assuming the response returns an array of marriage proofs
      } catch (err) {
        setError("Failed to load marriage proof documents.");
      }
    };

    fetchMarriageProofs();
  }, []);

  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    // Log clientId when the button is clicked
    console.log("Selected Client ID:", clientId);

    const fetchProofData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/marriageproof/marriage-proofs/${clientId}`);
        
        // Log the fetched data
        console.log("Fetched Marriage Proof Data:", response.data);

        // Check if there's any data and set the first item of the array
        if (response.data && response.data.length > 0) {
          setSelectedProof(response.data[0]); // Access the first proof data in the array
        } else {
          setError("No marriage proof data found.");
        }
      } catch (err) {
        setError("Failed to fetch marriage proof data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProofData();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProofs = marriageProofs.filter((proof) =>
    proof.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proof.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.maindiv}>
      <Sidebar />
      <h1 className={styles.divorceheading}>Marriage Proof Documents</h1>

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
        {filteredProofs.map((proof) => (
          <div key={proof._id} className={styles.clientCard}>
            <h3>{proof.clientName}</h3>
            <p className={styles.clientIdStyle}>Client ID: {proof.clientId}</p>
            <button
              onClick={() => handleCreateDocument(proof.clientId)} // Pass the client ID to fetch proof data
              className={styles.createDocumentButton}
            >
              See Document
            </button>
          </div>
        ))}
      </div>

      {/* Show loading spinner while fetching proof data */}
      {loading && <p className={styles.loadingMessage}>Loading marriage proof data...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Pass selected proof data as props to MarriageProofDocument */}
      {selectedProof && (
        <>
          {/* Render MarriageProofDocument with the props */}
          <MarriageProofDocument
            clientName={selectedProof.clientName}
            clientId={selectedProof.clientId}
            spouse1Name={selectedProof.spouse1Name}
            spouse2Name={selectedProof.spouse2Name}
            marriageDate={selectedProof.marriageDate}
            marriageLocation={selectedProof.marriageLocation}
            spouse1DOB={selectedProof.spouse1DOB}
            spouse2DOB={selectedProof.spouse2DOB}
            spouse1Address={selectedProof.spouse1Address}
            spouse2Address={selectedProof.spouse2Address}
            spouse1Occupation={selectedProof.spouse1Occupation}
            spouse2Occupation={selectedProof.spouse2Occupation}
            witness1Name={selectedProof.witness1Name}
            witness2Name={selectedProof.witness2Name}
            witness1Address={selectedProof.witness1Address}
            witness2Address={selectedProof.witness2Address}
            witness1Signature={selectedProof.witness1Signature}
            witness2Signature={selectedProof.witness2Signature}
            notarySignature={selectedProof.notarySignature}
            notaryName={selectedProof.notaryName}
            notaryLicenseNumber={selectedProof.notaryLicenseNumber}
            jurisdiction={selectedProof.jurisdiction}
          />
        </>
      )}
    </div>
  );
};

export default MarriageProofCard;