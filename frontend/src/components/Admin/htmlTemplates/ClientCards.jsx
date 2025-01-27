import React, { useEffect, useState } from "react";
import axios from "axios";
import DivorceTemplate from "./DivorceTemplate"; 
import Sidebar from '../Sidebar';

const ClientCards = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  

  return (
    <div>
      <Sidebar/>
      <h1>Clients</h1>

      <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "250px" }}>
        {clients.map((client) => (
          <div
            key={client._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              margin: "10px",
              width: "250px",
            }}
          >
            <h3>{client.clientName}</h3>
            <p>Client ID: {client.clientId}</p>
            <button
              onClick={() => handleCreateDocument(client.clientId)} // Pass the client ID to fetch agreement data
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Create Document
            </button>
          </div>
        ))}
      </div>

      {/* Show loading spinner while fetching agreement data */}
      {loading && <p>Loading agreement data...</p>}

      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Pass selected client data as props to DivorceTemplate */}
      {selectedClient && (
  <>
    {/* Log the props passed to DivorceTemplate */}
    {console.log("Props passed to DivorceTemplate:", {
      clientName: selectedClient.clientName,
      clientId: selectedClient.clientId,
      spouse1: selectedClient.spouse1,
      spouse2: selectedClient.spouse2,
      children: selectedClient.children,
      propertyDivision: selectedClient.propertyDivision,
      alimony: selectedClient.alimony,
      spouse1Address: selectedClient.spouse1Address,
      spouse2Address: selectedClient.spouse2Address,
      marriageDate: selectedClient.marriageDate,
      marriageLocation: selectedClient.marriageLocation,
      child1Name: selectedClient.child1Name,
      child1DOB: selectedClient.child1DOB,
      child2Name: selectedClient.child2Name,
      child2DOB: selectedClient.child2DOB,
      custodyArrangement: selectedClient.custodyArrangement,
      visitationSchedule: selectedClient.visitationSchedule,
      childSupport: selectedClient.childSupport,
      realPropertyDivision: selectedClient.realPropertyDivision,
      vehicleDivision: selectedClient.vehicleDivision,
      bankAccountDivision: selectedClient.bankAccountDivision,
      retirementAccountDivision: selectedClient.retirementAccountDivision,
      personalPropertyDivision: selectedClient.personalPropertyDivision,
      alimonyAmount: selectedClient.alimonyAmount,
      alimonyDuration: selectedClient.alimonyDuration,
      alimonyStartDate: selectedClient.alimonyStartDate,
      spouse1Name: selectedClient.spouse1Name,
      spouse1Debts: selectedClient.spouse1Debts,
      spouse2Name: selectedClient.spouse2Name,
      spouse2Debts: selectedClient.spouse2Debts,
      jurisdiction: selectedClient.jurisdiction,
      spouse1SignatureDate: selectedClient.spouse1SignatureDate,
      spouse2SignatureDate: selectedClient.spouse2SignatureDate,
      witnessSignatureDate: selectedClient.witnessSignatureDate,
      notarySignatureDate: selectedClient.notarySignatureDate,
    })}

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
