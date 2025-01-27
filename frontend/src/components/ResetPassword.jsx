import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Extract userId and otp from the URL
  const userId = searchParams.get("userId");
  const otp = searchParams.get("otp");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const url = `http://localhost:8080/api/password-reset/reset-password`;
      const { data } = await axios.post(url, { userId, password });
      setMsg(data.message);
      setError("");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  useEffect(() => {
    if (!userId || !otp) {
      setError("Invalid or missing parameters in the URL");
    }
  }, [userId, otp]);

  return (
    <div className={styles.container}>
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        {error && <div className={styles.error_msg}>{error}</div>}
        {msg && <div className={styles.success_msg}>{msg}</div>}
        <input
          type="password"
          placeholder="New Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.green_btn}>
          Reset Password
        </button>

        <a href="/login">Login from here</a>

      </form>
    </div>
  );
};

export default ResetPassword;
