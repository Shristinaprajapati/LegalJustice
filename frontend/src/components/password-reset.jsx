// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./password-reset.module.css";

// const ResetPassword = () => {
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
//     const [msg, setMsg] = useState("");
//     const [isValidLink, setIsValidLink] = useState(false);
//     const { id, token } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const verifyLink = async () => {
//             try {
//                 const url = `http://localhost:8080/api/password-reset/${id}/${token}`;
//                 const { data } = await axios.get(url);

//                 if (data.redirectToForm) {
//                     setIsValidLink(true);  // Link is valid, show the form
//                 } else {
//                     setError("Invalid or expired link");
//                     setIsValidLink(false);
//                 }
//             } catch (error) {
//                 setError("Invalid or expired link");
//                 setIsValidLink(false);
//             }
//         };
//         verifyLink();
//     }, [id, token]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (password !== confirmPassword) {
//             setError("Passwords do not match");
//             return;
//         }

//         try {
//             const url = `http://localhost:8080/api/password-reset/${id}/${token}`;
//             const { data } = await axios.post(url, { password });
//             setMsg(data.message);  // Success message
//             setError("");  // Clear any previous errors
//             setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
//         } catch (error) {
//             if (error.response && error.response.status >= 400 && error.response.status <= 500) {
//                 setError(error.response.data.message);  // Display error message
//                 setMsg("");  // Clear success message
//             }
//         }
//     };

//     return (
//         <div className={styles.container}>
//             {isValidLink ? (
//                 <form className={styles.formContainer} onSubmit={handleSubmit}>
//                     <h1>Reset Password</h1>
//                     <input
//                         type="password"
//                         placeholder="New Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className={styles.input}
//                     />
//                     <input
//                         type="password"
//                         placeholder="Confirm Password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                         className={styles.input}
//                     />
//                     {error && <div className={styles.errorMsg}>{error}</div>}
//                     {msg && <div className={styles.successMsg}>{msg}</div>}
//                     <button type="submit" className={styles.greenBtn}>
//                         Reset Password
//                     </button>
//                 </form>
//             ) : (
//                 <div className={styles.errorMsg}>{error}</div>
//             )}
//         </div>
//     );
// };

// export default ResetPassword;
