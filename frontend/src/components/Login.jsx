import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // Make sure the path is correct
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Icon } from "@iconify/react";

const SITE_KEY = "6Lc5D6IqAAAAAMu0jayEUodrDJOuDInq1lAMKLNw";

const Login = () => {
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRecaptcha = (value) => {
    setRecaptchaValue(value);
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

      const response = await axios.post(url, payload, { timeout: 10000 });
      const res = response.data;

      console.log("Login Response:", res);

      if (res.token) {
        console.log("Storing Token:", res.token);
        localStorage.setItem("token", res.token);
        localStorage.setItem("email", data.email);

        if (res.redirectTo) {
          window.location.href = res.redirectTo; // Redirect to the admin dashboard
        } else {
          navigate("/"); // Normal user, redirect to home page
        }
      } else {
        setError("Authentication failed. No token received.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <h1 className={styles.mainHeading}>Welcome to Legal Justice Platform!</h1>
        <p className={styles.subheading}>Sign in to access your account and manage your cases.</p>
      </div>

      <div className={styles.loginForm}>
        <h2 className={styles.heading}>Nice to see you here!</h2>
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
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                <Icon
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  className={styles.eyeIcon}
                />
              </button>
            </div>
          </div>
          <Link to="/forgot-password" className={styles.forgotPassword}>
            Forgot Password?
          </Link>
          <div className={styles.captchaContainer}>
            <ReCAPTCHA sitekey={SITE_KEY} onChange={handleRecaptcha} />
          </div>
          <button type="submit" className={styles.loginButtonSubmit}>
            Login
          </button>
        </form>
        <div className={styles.signupLinkContainer}>
          <p className={styles.paragraph}>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.signupLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
