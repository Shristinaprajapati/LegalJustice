import React, { useEffect, useState } from 'react';
import { FaMoneyBillAlt } from "react-icons/fa";
import { MdCalendarToday, MdExpandMore, MdExpandLess } from "react-icons/md";
import { QRCode } from "react-qr-code";
import axios from 'axios';
import styles from './Header.module.css';

const PaymentTab = ({ clientId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
  const [serviceDetails, setServiceDetails] = useState({});
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/payments/${clientId}`);
        console.log("Backend response:", response.data);
        const paymentsFromDb = response.data.data || [];

        setPayments((prevPayments) => {
          const newPayments = paymentsFromDb.filter((newPayment) =>
            !prevPayments.some((existingPayment) => existingPayment._id === newPayment._id)
          );
          return [...newPayments, ...prevPayments];
        });

        paymentsFromDb.forEach(async (payment) => {
          if (payment.serviceId) {
            try {
              const serviceResponse = await axios.get(`http://localhost:8080/api/services/${payment.serviceId}`);
              setServiceDetails((prevDetails) => ({
                ...prevDetails,
                [payment._id]: serviceResponse.data,
              }));
            } catch (err) {
              console.error('Error fetching service details:', err);
            }
          }
        });
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchPayments();
    }
  }, [clientId]);

  const toggleSlidebar = (paymentId) => {
    setExpandedPaymentId((prevId) => (prevId === paymentId ? null : paymentId));
  };

  const calculateRemainingPayment = (payment) => {
    const service = serviceDetails[payment._id];
    if (!service) return 'Loading...';
    const remaining = service.price - payment.paid_amount; // Already in rupees
    return remaining > 0 ? `NPR ${remaining}` : 'Fully Paid';
  };

  const calculatePaymentProgress = (payment) => {
    const service = serviceDetails[payment._id];
    if (!service || service.price === 0) return 0;
    return (payment.paid_amount / service.price) * 100; // Calculate progress based on paid_amount
  };

  const handleCompleteClick = async (payment) => {
    console.log("Complete button clicked for payment:", payment);

    const service = serviceDetails[payment._id];
    if (service) {
      const remainingAmount = service.price - payment.paid_amount; // Already in rupees
      if (remainingAmount > 0) {
        // Fetch client details using the clientId from the payment
        const email = localStorage.getItem("email"); // Get email from local storage
        if (!email) {
          setPaymentError("Email not found in local storage.");
          return;
        }

        try {
          // Fetch client details
          const clientResponse = await axios.get(`http://localhost:8080/api/users?email=${email}`);
          const clientData = clientResponse.data;

          console.log("Fetched client details:", clientData);

          // Set selected payment with client details
          const updatedPayment = {
            ...payment,
            remainingAmount,
            clientDetails: {
              name: clientData.name || "",
              email: clientData.email || "",
              phone: clientData.phone || "",
            },
          };

          console.log("Updated payment data for popup:", updatedPayment);

          setSelectedPayment(updatedPayment);
          setShowPaymentPopup(true);

          // Fetch the payment URL
          setIsLoadingPayment(true);
          setPaymentError(null);
          const khaltiResponse = await axios.post("http://localhost:8080/api/khalti-api", {
            return_url: `http://localhost:3000/successfull/${payment.serviceId}/${payment.clientId}`,
            website_url: "http://localhost:8080/payment-callback",
            amount: remainingAmount * 100, // Convert to paisa for Khalti
            purchase_order_id: payment.serviceId,
            purchase_order_name: `Service for ${payment.clientId}`,
            customer_info: {
              name: clientData.name || "",
              email: clientData.email || "",
              phone: clientData.phone || "",
            },
            serviceId: payment.serviceId,
            clientId: payment.clientId,
            category: "documentation", // Assuming this is for documentation services
          });

          if (khaltiResponse.data.success) {
            setPaymentUrl(khaltiResponse.data.data.payment_url);
          } else {
            setPaymentError("Failed to get payment URL");
          }
        } catch (error) {
          console.error("Error fetching client details or initiating Khalti payment:", error.response?.data || error.message);
          setPaymentError("Error processing payment: " + (error.response?.data?.message || error.message));
        } finally {
          setIsLoadingPayment(false);
        }
      } else {
        alert("This payment is already fully paid.");
      }
    }
  };

  const handlePayNow = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Payment History</h2>
      <p className={styles.sectionText}>Here are your past transactions.</p>

      {loading ? (
        <p className={styles.loading}>Loading payments...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : payments.length === 0 ? (
        <p className={styles.noPayments}>No payments found.</p>
      ) : (
        <div className={styles.paymentList}>
          {payments.map((payment) => (
            <div key={payment._id} className={styles.paymentCard}>
              <div className={styles.paymentHeader} onClick={() => toggleSlidebar(payment._id)}>
                <h3 className={styles.paymentTitle}>
                  {payment.service?.title || "Payment"}
                </h3>
                <p className={styles.paymentAmount}>
                  <FaMoneyBillAlt /> NPR {payment.paid_amount}
                </p>
                <p className={styles.paymentDate}>
                  <MdCalendarToday /> {new Date(payment.date).toDateString()}
                </p>
                <div className={styles.expandIcon}>
                  {expandedPaymentId === payment._id ? <MdExpandLess /> : <MdExpandMore />}
                </div>
              </div>

              {expandedPaymentId === payment._id && (
                <div className={styles.slidebar}>
                  <p className={styles.slidebarText}>
                    <strong>Service:</strong> {serviceDetails[payment._id]?.title || 'Loading...'}
                  </p>
                  <p className={styles.slidebarText}>
                    <strong>Total Price:</strong> NPR {serviceDetails[payment._id]?.price || 'Loading...'}
                  </p>
                  <p className={styles.slidebarText}>
                    <strong>Amount Paid:</strong> NPR {payment.paid_amount}
                  </p>
                  <p className={styles.slidebarText}>
                    <strong>Remaining Payment:</strong> {calculateRemainingPayment(payment)}
                  </p>

                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${calculatePaymentProgress(payment)}%` }}
                    ></div>
                  </div>

                  <button
                    className={styles.completeButton}
                    onClick={() => {
                      console.log("Complete button clicked");
                      handleCompleteClick(payment);
                    }}
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Integrated Payment Popup */}
      {showPaymentPopup && selectedPayment && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.leftSection}>
              <h3>Payment Details</h3>
              <div className={styles.clientDetails}>
                <p><strong>Name:</strong> {selectedPayment.clientDetails.name}</p>
                <p><strong>Email:</strong> {selectedPayment.clientDetails.email}</p>
                <p><strong>Phone:</strong> {selectedPayment.clientDetails.phone}</p>
                <p><strong>Remaining Amount:</strong> NPR {selectedPayment.remainingAmount}</p>
              </div>
              {isLoadingPayment && <p>Loading payment URL...</p>}
              {paymentError && <p className={styles.error}>{paymentError}</p>}
              <div className={styles.paymentOptions}>
                <button onClick={handlePayNow} className={styles.submitBtn} disabled={isLoadingPayment || !paymentUrl}>
                  Pay Now
                </button>
              </div>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.modalHeader}>
                <span className={styles.closeIcon} onClick={() => setShowPaymentPopup(false)}>X</span>
              </div>
              {paymentUrl && (
                <div className={styles.qrCode}>
                  <p>OR, Scan to Pay:</p>
                  <QRCode value={paymentUrl} size={200} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTab;