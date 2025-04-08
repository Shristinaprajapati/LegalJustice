import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from "./AdminClients.module.css";

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/clients");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.success && Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setClients(data);
        setFilteredClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to fetch clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(lowerSearch) ||
        client._id?.toLowerCase().includes(lowerSearch)
    );
    setFilteredClients(filtered);
    setCurrentPage(1); // reset to first page on search
  }, [searchTerm, clients]);

  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  return (
    <div className={styles.adminPanel}>
      <Sidebar />
      <div className={styles.clientsContainer}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Client List</h1>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.loading}>Loading clients...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Client ID</th>
                  </tr>
                </thead>
                <tbody>
                  {currentClients.map((client) => (
                    <tr key={client._id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone || "-"}</td>
                      <td>{client._id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminClients;
