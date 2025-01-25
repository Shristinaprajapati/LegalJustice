import React, { useEffect, useState } from "react";
import axios from "axios";
import DivorceTemplate from "./DivorceTemplate"; 

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

  // Fetch agreement data for a specific client
  const fetchAgreementData = async (clientId) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`http://localhost:8080/api/divorse-agreement/${clientId}`);
      setSelectedClient((prev) => ({
        ...prev,
        agreementData: response.data.data, // Attach fetched data to the selected client
      }));
    } catch (err) {
      setError("Failed to fetch agreement data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle button click, pass the entire client object
  const handleCreateDocument = (client) => {
    setSelectedClient(client);
    fetchAgreementData(client.clientId); // Fetch agreement data using client ID
  };

  return (
    <div>
      <h1>Clients</h1>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
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
              onClick={() => handleCreateDocument(client)}
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

      {/* Display the selected client details */}
      {/* {selectedClient && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            maxWidth: "600px",
            margin: "20px auto",
          }}
        >
          <h3>Selected Client Details</h3>
          <pre
            style={{
              backgroundColor: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(selectedClient, null, 2)}
          </pre>
          {loading && <div>Loading agreement data...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}

          {selectedClient.agreementData && (
            <>
              <h3>Agreement Data</h3>
              <pre
                style={{
                  backgroundColor: "#f4f4f4",
                  padding: "10px",
                  borderRadius: "5px",
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(selectedClient.agreementData, null, 2)}
              </pre>
            </>
          )}
        </div>
      )} */}

      {/* Pass selected client data as props to DivorceTemplate */}
      {selectedClient && selectedClient.agreementData && (
        <DivorceTemplate
          clientName={selectedClient.clientName}
          clientId={selectedClient.clientId}
          spouse1={selectedClient.spouse1}
          spouse2={selectedClient.spouse2}
          children={selectedClient.children}
          propertyDivision={selectedClient.propertyDivision}
          alimony={selectedClient.alimony}
        />
      )}
    </div>
  );
};

export default ClientCards;
