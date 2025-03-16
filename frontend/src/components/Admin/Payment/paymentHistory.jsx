import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar"; // Import the Sidebar component
import styles from "./Payments.module.css"; // Add custom styles

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment data from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/payments");

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div> {/* Custom spinner */}
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div> {/* Custom error message */}
      </div>
    );
  }

  return (
    <div className={styles.adminPanel}>
      <Sidebar /> {/* Add the Sidebar */}
      <div className={styles.paymentsContainer}>
        <h1>Payment Information</h1>
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
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.transaction_id}</td>
                <td>Rs. {payment.amount}</td>
                <td>
                  <span
                    style={{
                      color: payment.status === "Completed" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {payment.status}
                  </span>
                </td>
                <td>{payment.clientId}</td>
                <td>{payment.serviceId}</td>
                <td>{payment.category}</td>
                <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                <td>{payment.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;