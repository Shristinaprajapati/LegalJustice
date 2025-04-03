import React, { useEffect, useState } from "react";
import axios from "axios";
import PartnershipTemplate from "./PartnershipTemplate";
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css';
import { FiArrowLeft } from 'react-icons/fi';

const PartnershipCard = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDocument, setShowDocument] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/partnership-agreement/");
        if (Array.isArray(response.data)) {
          setClients(response.data);
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

    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/partnership-agreement/${clientId}`);
        
        if (response.data && response.data.length > 0) {
          setSelectedClient(response.data[0]);
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
    setSelectedClient(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        {!showDocument ? (
          <>
            <div className={styles.header}>
              <h1>Partnership Agreements</h1>
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
              {filteredClients.map((client) => (
                <div key={client._id} className={styles.clientCard}>
                  <div className={styles.cardHeader}>
                    <h3>{client.clientName}</h3>
                    <p>Client ID: {client.clientId}</p>
                  </div>
                  <button
                    onClick={() => handleCreateDocument(client.clientId)}
                    className={styles.viewButton}
                  >
                    View Agreement
                  </button>
                </div>
              ))}
            </div>

            {loading && <div className={styles.loading}>Loading...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {filteredClients.length === 0 && !loading && (
              <div className={styles.empty}>No partnership agreements found</div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleBackClick} className={styles.backButton}>
              <FiArrowLeft /> Back to Agreements
            </button>
            {selectedClient && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PartnershipCard;