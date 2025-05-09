import React, { useMemo, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const { serviceId, clientId } = useParams(); // Extract both serviceId and clientId from URL params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [existingPayment, setExistingPayment] = useState(null); // State to store existing payment data

  console.log("Service ID:", serviceId);
  console.log("Client ID:", clientId);

  console.log("Search Params:", searchParams);
  searchParams.forEach((value, key) => {
    console.log(key, value);
  });

  const transactionData = useMemo(() => {
    const amountInPaisa = parseInt(searchParams.get("amount"), 10); // Get amount in paisa
    const amountInRupees = amountInPaisa / 100; // Convert to rupees

    return {
      pidx: searchParams.get("pidx"),
      transaction_id: searchParams.get("transaction_id"),
      amount: amountInRupees, // Store amount in rupees
      fee: 0,
      status: searchParams.get("status"),
      refunded: false,
      mobile: searchParams.get("mobile"),
      purchase_order_id: searchParams.get("purchase_order_id"),
      purchase_order_name: searchParams.get("purchase_order_name"),
      clientId: clientId,
      serviceId: serviceId,
      category: "documentation",
      paymentMethod: "Khalti",
      paymentDetails: {},
    };
  }, [searchParams, clientId, serviceId]);

  // Fetch existing payment record
  useEffect(() => {
    const fetchExistingPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/payments?serviceId=${serviceId}&clientId=${clientId}`
        );

        if (response.data.success && response.data.data.length > 0) {
          setExistingPayment(response.data.data[0]); // Store the first matching payment record
        } else {
          throw new Error("No existing payment record found.");
        }
      } catch (err) {
        console.error("Error fetching existing payment:", err);
        setError("Failed to fetch existing payment record.");
      }
    };

    fetchExistingPayment();
  }, [serviceId, clientId]);

  // Function to update payment status to "Completed"
  const handlePaymentCompletion = async (paymentId, amountPaid) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/payments/${paymentId}/complete`,
        {
          paid_amount: amountPaid, // Amount in rupees
          transaction_id: existingPayment.transaction_id, // Use existing transaction_id
        }
      );

      if (response.data.success) {
        console.log("Payment updated successfully:", response.data);
      } else {
        console.error("Failed to update payment status.");
      }
    } catch (error) {
      console.error("Error completing payment:", error);
    }
  };

  useEffect(() => {
    const handlePaymentStatus = async () => {
      try {
        if (!existingPayment) {
          throw new Error("Existing payment record not found.");
        }

        if (
          !transactionData.pidx ||
          !transactionData.transaction_id ||
          !transactionData.amount ||
          !transactionData.status ||
          !transactionData.purchase_order_id ||
          !transactionData.purchase_order_name ||
          !transactionData.clientId ||
          !transactionData.serviceId ||
          !transactionData.category
        ) {
          throw new Error("Missing required transaction data.");
        }

        // Set payment status
        setPaymentStatus(transactionData.status);

        // Update payment status to "Completed" in the database
        await handlePaymentCompletion(existingPayment.pidx, transactionData.amount);
      } catch (err) {
        console.error("Error handling payment status:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to handle payment status."
        );
      } finally {
        setLoading(false);
      }
    };

    if (existingPayment) {
      handlePaymentStatus();
    }
  }, [transactionData, existingPayment]); // Add existingPayment as a dependency

  // Styles (same as before)
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
    },
    box: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      width: "80%",
      maxWidth: "400px",
      margin: "0 20px",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#333",
      textAlign: "center",
    },
    subText: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "30px",
      marginTop: "30px",
      textAlign: "center",    // For centering the text
      display: "flex",        // Enables flexbox properties
      flexDirection: "column", // Stacks items vertically
      alignItems: "center",   // Centers horizontally (cross-axis for column)
      justifyContent: "center" // Centers vertically (main-axis for column)
    },
    image: {
      width: "100px",
      height: "100px",
      marginBottom: "15px",
    },
    message: {
      fontSize: "16px",
      color: "#333",
      marginBottom: "40px",
      textAlign: "center",  
      display: "flex",     
      alignItems: "center", 
      justifyContent: "center" 
    },
    processed: {
      color: "green",
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "green",
      color: "#fff",
      padding: "10px 20px",
      fontSize: "14px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      textDecoration: "none",
      marginBottom: "32px",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.heading}>Processing...</h2>
          <p style={styles.subText}>Please wait while we process your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.heading}>Error</h2>
          <p style={styles.subText}>{error}</p>
          <a href="/" style={styles.button}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Payment Successful</h2>
        <p style={styles.subText}>We appreciate your trust in us.</p>
        <img src="/Images/check.png" alt="Success" style={styles.image} />
        <p style={styles.message}>
          Payment Status:{" "}
          <span style={styles.processed}>{paymentStatus}</span>
        </p>
        <a href="/" style={styles.button}>
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default BookingSuccess;