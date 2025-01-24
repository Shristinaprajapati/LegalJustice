import { useState } from "react";
import axios from "axios";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [userId, setUserId] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
	const [showOtpPopup, setShowOtpPopup] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const url = `http://localhost:8080/api/password-reset`;
			const { data } = await axios.post(url, { email });
			setMsg(data.message);
			setError("");
			setShowOtpPopup(true);
			setUserId(data.userId); // Assume the userId is returned by the backend
		} catch (error) {
			if (error.response) {
				setError(error.response.data.message || "An error occurred");
				setMsg("");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const url = `http://localhost:8080/api/password-reset/verify-otp`;
			const { data } = await axios.post(url, { userId, otp });
			setMsg(data.message);
			setError("");
			setShowOtpPopup(false);
			window.location.href = `/reset-password?userId=${userId}&otp=${otp}`;
		} catch (error) {
			if (error.response) {
				setError(error.response.data.message || "Invalid OTP");
				setMsg("");
			}
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
