// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./PopupForm.module.css";
// import { useSearchParams } from "react-router-dom";
// import PaymentPopup from "./PaymentPopup.jsx";
// import MessagePopup from "./MessagePopup.jsx";

// const PopupForm = ({ isOpen, onClose, formData, setFormData }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
//   const [searchParams] = useSearchParams();
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false);

//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     if (isOpen && email) {
//       const fetchClientDetails = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(`http://localhost:8080/api/users?email=${email}`);
//           const data = response.data;

//           setFormData((prevData) => ({
//             ...prevData,
//             clientId: data._id || "",
//             name: data.name || "",
//             email: data.email || "",
//             phone: data.phone || "",
//           }));
//         } catch (err) {
//           setError(err.response?.data?.message || "Failed to fetch client details");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchClientDetails();
//     }
//   }, [isOpen, email, setFormData]);

//   const resetFormData = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       date: "",
//       timeSlot: "",
//     }));
//   };

//   useEffect(() => {
//     const verifyPayment = async () => {
//       const pidx = searchParams.get("pidx");
//       const status = searchParams.get("status");
//       const transaction_id = searchParams.get("transaction_id");
//       const amount = searchParams.get("amount");
//       const total_amount = searchParams.get("total_amount");
//       const mobile = searchParams.get("mobile");
//       const purchase_order_id = searchParams.get("purchase_order_id");
//       const purchase_order_name = searchParams.get("purchase_order_name");
//       const clientId = formData.clientId;
//       const category = formData.category;

//       if (pidx && status) {
//         setShowPopup(true);

//         if (status === "Completed") {
//           try {
//             const response = await axios.get("http://localhost:8080/api/khalti-callback", {
//               params: {
//                 pidx,
//                 status,
//                 transaction_id,
//                 amount,
//                 total_amount,
//                 mobile,
//                 purchase_order_id,
//                 purchase_order_name,
//                 clientId,
//                 category,
//               },
//             });

//             if (response.data.success) {
//               setPaymentStatus("Payment Successful! ✅");
//               await handleSubmit();
//             } else {
//               setPaymentStatus("Payment Verification Failed. ❌");
//             }
//           } catch (error) {
//             setPaymentStatus("Error verifying payment: " + (error.response?.data?.message || error.message));
//           }
//         } else {
//           setPaymentStatus("Payment failed or canceled.");
//         }
//       }
//     };

//     if (formData.clientId) {
//       verifyPayment();
//     }
//   }, [searchParams, formData.clientId, formData.category]);

//   const handleKhaltiPayment = async (serviceId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const paymentPayload = {
//         return_url: "http://localhost:3000/service",
//         website_url: "http://localhost:3000",
//         amount: 30 * 100,
//         purchase_order_id: serviceId,
//         purchase_order_name: formData.clientId,
//         customer_info: {
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//         },
//         serviceId,
//         clientId: formData.clientId,
//         category: formData.category,
//       };

//       const khaltiResponse = await axios.post("http://localhost:8080/api/khalti-api", paymentPayload);

//       if (khaltiResponse.data.success) {
//         window.location.href = khaltiResponse.data.data.payment_url;
//       } else {
//         setError("Failed to initiate Khalti payment.");
//       }
//     } catch (err) {
//       setError("Error processing payment: " + err.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccessMessage("");

//     try {
//       let bookingData;
//       if (formData.category === "consulting") {
//         bookingData = {
//           serviceId: formData.serviceId,
//           clientId: formData.clientId,
//           date: formData.date,
//           timeSlot: formData.timeSlot,
//           category: formData.category,
//         };
//       } else {
//         const storedFormData = JSON.parse(localStorage.getItem("formData"));
//         const { serviceId, clientId, category } = storedFormData || {};
//         bookingData = {
//           serviceId: serviceId,
//           clientId: clientId,
//           category: category,
//         };
//       }

//       const response = await axios.post("http://localhost:8080/api/bookings", bookingData);
//       setSuccessMessage("Booking successful!");
//       setIsMessagePopupOpen(true);
//       localStorage.removeItem("formData");
//       resetFormData();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setSuccessMessage("");
//     setError("");
//   };

//   const closeMessagePopup = () => {
//     setIsMessagePopupOpen(false);
//   };

//   const popupStyle = {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     background: "white",
//     padding: "20px",
//     boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//     borderRadius: "8px",
//     textAlign: "center",
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className={styles.modalOverlay}>
//         <div className={styles.modalContent}>
//           <div className={styles.modalHeader}>
//             <span className={styles.closeIcon} onClick={onClose}>
//               X
//             </span>
//           </div>
//           {formData.category === "consulting" ? (
//             <>
//               <h3>Book Service</h3>
//               {loading && <p>Loading...</p>}
//               {error && <p className={styles.errorMessage}>{error}</p>}
//               {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleSubmit();
//                 }}
//               >
//                 <label>
//                   Service:
//                   <input type="text" name="service" value={formData.service} readOnly required />
//                 </label>
//                 <label>
//                   Date:
//                   <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
//                 </label>
//                 <label>
//                   Time Slot:
//                   <select name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} required>
//                     <option value="">Select a time slot</option>
//                     <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
//                     <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
//                     <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
//                   </select>
//                 </label>
//                 <div className={styles.modalActions}>
//                   <button type="submit" className={styles.submitBtn}>Submit</button>
//                 </div>
//               </form>
//             </>
//           ) : (
//             <>
//               <h3>Get Document</h3>
//               <p>Are you sure you want to get the document?</p>
//               {loading && <p>Loading...</p>}
//               <button 
//                 onClick={() => {
//                   localStorage.setItem("formData", JSON.stringify({
//                     serviceId: formData.serviceId,
//                     clientId: formData.clientId,
//                     category: formData.category,
//                   }));
//                   setShowPaymentPopup(true);
//                 }} 
//                 className={styles.submitBtn}>
//                 Yes, Pay Rs. 2000
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {showPopup && (
//         <div style={popupStyle}>
//           <h3>{paymentStatus}</h3>
//           <button onClick={() => setShowPopup(false)}>Close</button>
//         </div>
//       )}

//       {showPaymentPopup && (
//         <PaymentPopup
//           clientDetails={formData}
//           onClose={() => setShowPaymentPopup(false)}
//           onPayNow={() => handleKhaltiPayment(formData.serviceId)}
//         />
//       )}

//       {isMessagePopupOpen && (
//         <MessagePopup message={successMessage} onClose={closeMessagePopup} />
//       )}
//     </>
//   );
// };

// export default PopupForm;




import React from "react";
import styles from "./PopupForm.module.css";

const PaymentPopup = ({ clientDetails, onClose, onPayNow }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.closeIcon} onClick={onClose}>
            X
          </span>
        </div>
        <h3>Payment Details</h3>
        <div className={styles.clientDetails}>
          <p><strong>Name:</strong> {clientDetails.name}</p>
          <p><strong>Email:</strong> {clientDetails.email}</p>
          <p><strong>Phone:</strong> {clientDetails.phone}</p>
        </div>
        <div className={styles.paymentOptions}>
          <button onClick={onPayNow} className={styles.submitBtn}>
            Pay Now
          </button>
          <div className={styles.qrCode}>
            {/* Add your QR code image or component here */}
            <img src="path_to_your_qr_code_image.png" alt="QR Code" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;