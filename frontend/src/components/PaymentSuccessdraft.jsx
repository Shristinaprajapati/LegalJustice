// import React from "react";
// import { useParams, useSearchParams } from "react-router-dom";


// const BookingSuccess = () => {
//   const [searchparams] = useSearchParams();
//   const params = useParams()
//   console.log(params.serviceId)

//   console.log(searchparams)
//   searchparams.forEach(( key , value) => {
//     console.log(key, value)
//   })
//   const styles = {
//     container: {
//       display: "flex",  
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//       textAlign: "center",
//       fontFamily: "Arial, sans-serif",
//       backgroundColor: "#f4f4f4", // Light background color
//     },
//     box: {
//       backgroundColor: "#fff",
//       padding: "40px",
//       borderRadius: "20px",
//       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle box-shadow
//       width: "80%",
//       maxWidth: "400px",
//       margin: "0 20px",
//     },
//     heading: {
//       fontSize: "24px",
//       fontWeight: "bold",
//       marginBottom: "5px",
//       color: "#333",
//       textAlign: "center",
//     },
//     subText: {
//       fontSize: "14px",
//       color: "#666",
//       marginBottom: "30px",
//       marginTop: "30px",
//     },
//     image: {
//       width: "100px",
//       height: "100px",
//       marginBottom: "-15px",
//     },
//     message: {
//       fontSize: "16px",
//       color: "#333",
//       marginBottom: "40px",
//     },
//     processed: {
//       color: "green",
//       fontWeight: "bold",
//     },
//     note: {
//       fontSize: "12px",
//       color: "#666",
//       marginBottom: "20px",
//     },
//     button: {
//       backgroundColor: "green", // Green button color
//       color: "#fff",
//       padding: "10px 20px",
//       fontSize: "14px",
//       border: "none",
//       borderRadius: "5px",
//       cursor: "pointer",
//       textDecoration: "none",
//       marginBottom: "32px",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.box}>
//         <h2 style={styles.heading}>Booking Successfull</h2>
//         <p style={styles.subText}>We appreciate your trust in us.</p>
//         <img src="/Images/check.png" alt="Success" style={styles.image} />
//         <p style={styles.message}>
//           Your Booking is being <span style={styles.processed}>processed...</span>
//         </p>
//         <a href="/" style={styles.button}>
//           Back to Home
//         </a>
//       </div>
//     </div>
//   );
// };

// export default BookingSuccess;
