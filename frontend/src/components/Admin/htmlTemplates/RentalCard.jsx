import React, { useEffect, useState } from "react";
import axios from "axios";
import RentalTemplate from "./RentalTemplate";
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css';
import { FiArrowLeft } from 'react-icons/fi';

const RentalCard = () => {
  const [rentalAgreements, setRentalAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDocument, setShowDocument] = useState(false);

  useEffect(() => {
    const fetchRentalAgreements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/rental/rental-agreements`);
        setRentalAgreements(response.data);
      } catch (err) {
        setError("Failed to load rental agreements.");
      }
    };
    fetchRentalAgreements();
  }, []);

  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/rental/rental-agreements/${clientId}`);
        
        if (response.data && response.data.length > 0) {
          setSelectedAgreement(response.data[0]);
          setShowDocument(true);
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

  const handleBackClick = () => {
    setShowDocument(false);
    setSelectedAgreement(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAgreements = rentalAgreements.filter((agreement) =>
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
              <h1>Rental Agreements</h1>
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
              <div className={styles.empty}>No rental agreements found</div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleBackClick} className={styles.backButton}>
              <FiArrowLeft /> Back to Agreements
            </button>
            {selectedAgreement && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RentalCard;