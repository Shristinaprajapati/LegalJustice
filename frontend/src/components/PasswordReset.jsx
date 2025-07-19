import { useEffect, useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./PasswordReset.module.css";

const PasswordReset = () => {
    const [validOtp, setValidOtp] = useState(false);
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Using URL state or fallback to URL parameters if needed
    const { userId, otp } = location.state || {};
    
    // If userId or OTP is missing, show an error
    useEffect(() => {
        if (!userId || !otp) {
            setValidOtp(false);
            setError("Invalid or missing user ID/OTP.");
            return;
        }

        const verifyOtp = async () => {
            try {
                const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/password-reset/verify-otp`, { userId, otp });
                setValidOtp(true);
                setMsg(data.message);
            } catch (error) {
                setValidOtp(false);
                setError(error.response?.data?.message || "Invalid or expired OTP");
            }
        };
        verifyOtp();
    }, [userId, otp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate password format here if required (like minimum length, etc.)
        if (password.length < 6) {
            setError("Password should be at least 6 characters long.");
            return;
        }

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/password-reset/reset-password`, { userId, password });
            setMsg(data.message);
            setError("");
            navigate("/login"); // Redirect to login page after successful password reset
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            setMsg("");
        }
    };

    return (
        <Fragment>
            {validOtp ? (
                <div className={styles.container}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Set New Password</h1>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        {msg && <div className={styles.success_msg}>{msg}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <div className={styles.errorPage}>
                    <h1>Invalid or expired OTP</h1>
                    <p>Please request a new OTP.</p>
                </div>
            )}
        </Fragment>
    );
};

export default PasswordReset;
