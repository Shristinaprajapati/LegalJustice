import { useState } from "react";
import axios from "axios";
import styles from "./ForgotPassword.module.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [userId, setUserId] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
	const [showOtpPopup, setShowOtpPopup] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Handle email submission to request OTP
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.post(`http://localhost:8080/api/password-reset`, { email });
			setMsg(data.message);
			setError("");
			setShowOtpPopup(true);
			setUserId(data.userId); // Ensure backend sends this
		} catch (error) {
			setError(error.response?.data?.message || "An error occurred");
			setMsg("");
		} finally {
			setLoading(false);
		}
	};

	// Handle OTP verification
	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (!userId) {
			setError("User ID missing. Please try again.");
			setLoading(false);
			return;
		}

		if (!/^\d{6}$/.test(otp)) {
			setError("Invalid OTP format. Must be a 6-digit number.");
			setLoading(false);
			return;
		}

		try {
			const { data } = await axios.post(`http://localhost:8080/api/password-reset/verify-otp`, { userId, otp });
			setMsg(data.message);
			setError("");
			setShowOtpPopup(false);

			
        // Navigate to password reset page with userId and otp as state
        navigate("/reset-password", { state: { userId, otp } });
		
		} catch (error) {
			setError(error.response?.data?.message || "Invalid OTP");
			setMsg("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<form className={styles.form_container} onSubmit={handleSubmit}>
				<h1>Forgot Password</h1>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className={styles.input}
				/>
				{error && <div className={styles.error_msg}>{error}</div>}
				{msg && <div className={styles.success_msg}>{msg}</div>}
				<button type="submit" className={styles.green_btn} disabled={loading}>
					{loading ? "Submitting..." : "Submit"}
				</button>
			</form>

			{showOtpPopup && (
				<div className={styles.popup}>
					<div className={styles.popup_content}>
						<h2>Enter OTP</h2>
						<input
							type="text"
							placeholder="Enter OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<div className={styles.popup_buttons}>
							<button
								onClick={handleOtpSubmit}
								className={styles.green_btn}
								disabled={loading}
							>
								{loading ? "Verifying..." : "Submit OTP"}
							</button>
							<button
								onClick={() => setShowOtpPopup(false)}
								className={styles.red_btn}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ForgotPassword;
