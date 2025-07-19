import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyTransferTemplate from "./PropertytransferTemplate";
import Sidebar from "../Sidebar";
import styles from "./ClientCards.module.css";
import { FiArrowLeft } from 'react-icons/fi';

const PropertyCards = () => {
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDocument, setShowDocument] = useState(false);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/propertytransfer/property-transfer-agreement`);
        setAgreements(response.data);
      } catch (err) {
        setError("Failed to load agreements.");
      }
    };
    fetchAgreements();
  }, []);

  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/propertytransfer/property-transfer-agreement/${clientId}`
        );

        if (response.data && response.data.length > 0) {
          setSelectedAgreement(response.data[0]);
          setShowDocument(true);
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

  const handleBackClick = () => {
    setShowDocument(false);
    setSelectedAgreement(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAgreements = agreements.filter(
    (agreement) =>
      agreement.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        {!showDocument ? (
          <>
            <div className={styles.header}>
              <h1>Property Transfer Agreements</h1>
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
              {filteredAgreements.map((agreement) => (
                <div key={agreement._id} className={styles.clientCard}>
                  <div className={styles.cardHeader}>
                    <h3>{agreement.clientName}</h3>
                    <p>Client ID: {agreement.clientId}</p>
                  </div>
                  <button
                    onClick={() => handleCreateDocument(agreement.clientId)}
                    className={styles.viewButton}
                  >
                    View Agreement
                  </button>
                </div>
              ))}
            </div>

            {loading && <div className={styles.loading}>Loading...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {filteredAgreements.length === 0 && !loading && (
              <div className={styles.empty}>No property transfer agreements found</div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleBackClick} className={styles.backButton}>
              <FiArrowLeft /> Back to Agreements
            </button>
            {selectedAgreement && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyCards;