import React, { useEffect, useState } from "react";
import axios from "axios";
import MarriageProofDocument from "./MarriageproofTemplate"; 
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css';
import { FiArrowLeft } from 'react-icons/fi';

const MarriageProofCard = () => {
  const [marriageProofs, setMarriageProofs] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDocument, setShowDocument] = useState(false);

  useEffect(() => {
    const fetchMarriageProofs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/marriageproof/marriage-proofs`);
        setMarriageProofs(response.data);
      } catch (err) {
        setError("Failed to load marriage proof documents.");
      }
    };
    fetchMarriageProofs();
  }, []);

  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    const fetchProofData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/marriageproof/marriage-proofs/${clientId}`);
        
        if (response.data && response.data.length > 0) {
          setSelectedProof(response.data[0]);
          setShowDocument(true);
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

  const handleBackClick = () => {
    setShowDocument(false);
    setSelectedProof(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProofs = marriageProofs.filter((proof) =>
    proof.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proof.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        {!showDocument ? (
          <>
            <div className={styles.header}>
              <h1>Marriage Proof Documents</h1>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search by Name or ID"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className={styles.clientCardsContainer}>
              {filteredProofs.map((proof) => (
                <div key={proof._id} className={styles.clientCard}>
                  <div className={styles.cardHeader}>
                    <h3>{proof.clientName}</h3>
                    <p>Client ID: {proof.clientId}</p>
                  </div>
                  <button
                    onClick={() => handleCreateDocument(proof.clientId)}
                    className={styles.viewButton}
                  >
                    View Document
                  </button>
                </div>
              ))}
            </div>

            {loading && <div className={styles.loading}>Loading...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {filteredProofs.length === 0 && !loading && (
              <div className={styles.empty}>No marriage proofs found</div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleBackClick} className={styles.backButton}>
              <FiArrowLeft /> Back to Documents
            </button>
            {selectedProof && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarriageProofCard;