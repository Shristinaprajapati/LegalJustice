import React, { useEffect, useState } from "react";
import axios from "axios";
import DivorceTemplate from "./DivorceTemplate"; 
import Sidebar from '../Sidebar';
import styles from './ClientCards.module.css';
import { FiArrowLeft } from 'react-icons/fi';

const ClientCards = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDocument, setShowDocument] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // const response = await axios.get("http://localhost:8080/api/divorse-agreement/");
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/divorse-agreement/`);
        setClients(response.data.data);
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
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/divorse-agreement/${clientId}`);    
        if (response.data.data && response.data.data.length > 0) {
          setSelectedClient(response.data.data[0]);
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
              <h1>Divorce Agreements</h1>
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
              <div className={styles.empty}>No clients found</div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleBackClick} className={styles.backButton}>
              <FiArrowLeft /> Back to Clients
            </button>
            {selectedClient && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientCards;