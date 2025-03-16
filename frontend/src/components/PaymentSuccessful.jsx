import React, { useMemo, useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const { serviceId, clientId } = useParams(); // Extract both serviceId and clientId from URL params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const bookingCreated = useRef(false); // Track whether the booking has been created

  console.log("Service ID:", serviceId);
  console.log("Client ID:", clientId);

  console.log("Search Params:", searchParams);
  searchParams.forEach((value, key) => {
    console.log(key, value);
  });

  const transactionData = useMemo(() => ({
    pidx: searchParams.get("pidx"),
    transaction_id: searchParams.get("transaction_id"),
    amount: searchParams.get("amount"),
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
  }), [searchParams, clientId, serviceId]);
  

  // Function to create a new booking
  const createBooking = async () => {
    try {
      const bookingData = {
        serviceId: serviceId,
        clientId: clientId,
        category: "documentation", // Set the category as non-consulting
      };

      const response = await axios.post(
        "http://localhost:8080/api/bookings", // Replace with your booking route
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking created:", response.data);
    } catch (err) {
      console.error("Error creating booking:", err);
      throw err; // Re-throw the error to handle it in the main function
    }
  };
  
  // Function to save payment to the database
  const savePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/payments",
        transactionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment recorded successfully:", response.data);
    } catch (err) {
      console.error("Error recording payment:", err);
      throw err; // Re-throw the error to handle it in the main function
    }
  };
  

  useEffect(() => {
    const handlePaymentStatus = async () => {
      try {
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
  
        // Prevent duplicate bookings
        if (transactionData.status === "Completed" && !bookingCreated.current) {
          bookingCreated.current = true; // Mark as created before async call
          await createBooking();
          await savePayment();
        }
      } catch (err) {
        console.error("Error handling payment status or creating booking:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to handle payment status or create booking."
        );
      } finally {
        setLoading(false);
      }
    };
  
    handlePaymentStatus();
  }, []); // Empty dependency array ensures this runs only once when mounted
  

  // Styles
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
    },
    image: {
      width: "100px",
      height: "100px",
      marginBottom: "-15px",
    },
    message: {
      fontSize: "16px",
      color: "#333",
      marginBottom: "40px",
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
        <h2 style={styles.heading}>Booking Successful</h2>
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