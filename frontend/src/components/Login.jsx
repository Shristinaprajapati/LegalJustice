import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Icon } from "@iconify/react";
import Loader from "./Loader";

const SITE_KEY = "6Lc5D6IqAAAAAMu0jayEUodrDJOuDInq1lAMKLNw";

const Login = () => {
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRecaptcha = (value) => {
    setRecaptchaValue(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when form is submitted

    // Validate email and password
    if (!data.email || !data.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    try {
      const url = "http://localhost:8080/api/auth";
      const payload = { ...data, recaptchaValue };

      const response = await axios.post(url, payload, { timeout: 10000 });
      const res = response.data;
      setLoading(false); // Stop loading on success

      if (res.token) {
        if (res.user.role === "admin") {
          localStorage.setItem("admin_token", res.token);
          localStorage.setItem("admin_email", res.user.email);
        } else {
          localStorage.setItem("token", res.token);
          localStorage.setItem("email", res.user.email);
        }

        if (res.redirectTo) {
          window.location.href = res.redirectTo;
        } else {
          navigate("/");
        }
      } else {
        setError("Authentication failed. No token received.");
      }
    } catch (error) {
      setLoading(false); // Stop loading on error
      console.error("Login Error:", error);

      if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setError(data.message || "Invalid request. Please check your input.");
            break;
          case 401:
            setError(data.message || "Invalid email or password.");
            break;
          case 403:
            setError(data.message || "reCAPTCHA verification failed.");
            break;
          case 500:
            setError("An internal server error occurred. Please try again later.");
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
        setError("Unable to connect to the server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      {loading && <Loader />} {/* Loader positioned here to overlay the entire form */}
      
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
              disabled={loading} // Disable inputs during loading
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
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                disabled={loading}
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
            <ReCAPTCHA 
              sitekey={SITE_KEY} 
              onChange={handleRecaptcha}
              className={loading ? styles.disabledCaptcha : ""}
            />
          </div>
          <button 
            type="submit" 
            className={styles.loginButtonSubmit}
            style={{ backgroundColor: '#1e40af' }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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