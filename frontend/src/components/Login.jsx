import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6Lc5D6IqAAAAAMu0jayEUodrDJOuDInq1lAMKLNw";

const Login = () => {
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }
    try {
      const url = "http://localhost:8080/api/auth";
      const payload = { ...data, recaptchaValue };

      const response = await axios.post(url, payload);
      const res = response.data;

      localStorage.setItem("token", res.token);
      localStorage.setItem("email", data.email);

      navigate(res.isAdmin ? "/admin/AdminDashboard" : "/");
    } catch (error) {
      if (error.response?.status >= 400 && error.response?.status <= 500) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.heading}>Login</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password:</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={styles.inputField}
            />
          </div>
          <Link to="/forgot-password" className={styles.forgotPassword}>
            Forgot Password?
          </Link>
          <div className={styles.captchaContainer}>
            <ReCAPTCHA sitekey={SITE_KEY} onChange={setRecaptchaValue} />
          </div>
          <button type="submit" className={styles.loginButtonSubmit}>
            Login
          </button>
        </form>
      </div>
      <div className={styles.loginImage}></div>
    </div>
  );
};

export default Login;
