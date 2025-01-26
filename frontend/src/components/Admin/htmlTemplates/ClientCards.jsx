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

  // Handle button click, pass the entire client object
  const handleCreateDocument = (clientId) => {
    setLoading(true);
    setError(null);

    // Fetch agreement data for the selected client
    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/divorse-agreement/${clientId}`);
        setSelectedClient(response.data.data); // Set the full client data, including the agreement data
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

      {/* Pass selected client data as props to DivorceTemplate */}
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
        />
      )}
    </div>
  );
};

export default ClientCards;
