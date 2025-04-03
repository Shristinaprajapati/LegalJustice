import React, { useEffect, useState } from "react";
import axios from "axios";
import EmploymentTemplate from "./EmploymentcontractTemplate"; 
import Sidebar from "../Sidebar";
import styles from "./ClientCards.module.css";
import { FiArrowLeft } from 'react-icons/fi';

const EmploymentCards = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDocument, setShowDocument] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employment/employment-contract");
        setContracts(response.data);
      } catch (err) {
        setError("Failed to load contracts.");
      }
    };
    fetchContracts();
  }, []);

  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    const fetchContractData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/employment/employment-contract/${clientId}`
        );

        if (response.data && response.data.length > 0) {
          setSelectedContract(response.data[0]);
          setShowDocument(true);
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

  const handleBackClick = () => {
    setShowDocument(false);
    setSelectedContract(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        {!showDocument ? (
          <>
            <div className={styles.header}>
              <h1>Employment Contracts</h1>
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
              {filteredContracts.map((contract) => (
                <div key={contract._id} className={styles.clientCard}>
                  <div className={styles.cardHeader}>
                    <h3>{contract.clientName}</h3>
                    <p>Client ID: {contract.clientId}</p>
                  </div>
                  <button
                    onClick={() => handleCreateDocument(contract.clientId)}
                    className={styles.viewButton}
                  >
                    View Contract
                  </button>
                </div>
              ))}
            </div>

            {loading && <div className={styles.loading}>Loading...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {filteredContracts.length === 0 && !loading && (
              <div className={styles.empty}>No contracts found</div>
            )}
          </>
        ) : (
          <>
            <button onClick={handleBackClick} className={styles.backButton}>
              <FiArrowLeft /> Back to Contracts
            </button>
            {selectedContract && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmploymentCards;