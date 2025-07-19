import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import styles from "./Payments.module.css";
import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/payments`);
        if (response.data.success) {
          setPayments(response.data.data);
        } else {
          setError("No payments found.");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Failed to fetch payments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => 
    payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.serviceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FiAlertCircle className={styles.errorIcon} />
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.adminPanel}>
      <Sidebar />
      <div className={styles.paymentsContainer}>
        <div className={styles.header}>
          <h1>
            Payment Information
          </h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className={styles.noResults}>
            <FiAlertCircle className={styles.noResultsIcon} />
            <p>No payments found matching your search.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.paymentsTable}>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Client ID</th>
                  <th>Service ID</th>
                  <th>Category</th>
                  <th>Payment Date</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td className={styles.transactionId}>{payment.transaction_id}</td>
                    <td className={styles.amount}>Rs. {payment.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          payment.status === "Completed" ? styles.completed : styles.failed
                        }`}
                      >
                        {payment.status === "Completed" ? (
                          <FiCheckCircle className={styles.statusIcon} />
                        ) : (
                          <FiAlertCircle className={styles.statusIcon} />
                        )}
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.clientId}</td>
                    <td>{payment.serviceId}</td>
                    <td className={styles.category}>{payment.category}</td>
                    <td className={styles.date}>
                      <FiClock className={styles.dateIcon} />
                      {new Date(payment.paymentDate).toLocaleString()}
                    </td>
                    <td>{payment.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;