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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRecaptcha = (value) => {
    setRecaptchaValue(value);
    setError("");
  };

  const validateForm = () => {
    if (!data.email.trim()) {
      setError("Email is required");
      return false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!data.password) {
      setError("Password is required");
      return false;
    }

    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA verification");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const url = `${process.env.REACT_APP_BASE_URL}/api/auth`;
      const payload = { ...data, recaptchaValue };

      const response = await axios.post(url, payload, { 
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 500 
      });
      
      const res = response.data;

      if (response.status === 200 && res.token) {
        if (res.user.role === "admin") {
          localStorage.setItem("admin_token", res.token);
          localStorage.setItem("admin_email", res.user.email);
        } else {
          localStorage.setItem("token", res.token);
          localStorage.setItem("email", res.user.email);
        }

        navigate(res.redirectTo || "/");
        return;
      }

      // Handle specific error cases from server
      if (response.status === 401) {
        setError(res.message || "Invalid email or password");
      } else if (response.status === 403) {
        setError(res.message || "reCAPTCHA verification failed");
      } else if (response.status === 400) {
        setError(res.message || "Invalid request data");
      } else {
        setError(res.message || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (error.response) {
        // Handle cases where server responds with error
        const { status, data } = error.response;
        if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.message || "An error occurred during login.");
        }
      } else if (error.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      {loading && (
        <div className={styles.loaderOverlay}>
          <Loader />
        </div>
      )}
      
      <div className={styles.loginContainer}>
        <div className={styles.loginHero}>
          <h1 className={styles.mainHeading}>Welcome to Legal Justice Platform</h1>
          <p className={styles.subheading}>
            Sign in to access your account and manage your cases efficiently.
          </p>
          <div className={styles.loginIllustration}></div>
        </div>

        <div className={styles.loginFormContainer}>
          <div className={styles.loginForm}>
            <div className={styles.formHeader}>
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <Icon icon="mdi:alert-circle-outline" className={styles.errorIcon} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputContainer}>
                  <Icon icon="mdi:email-outline" className={styles.inputIcon} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={styles.inputField}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputContainer}>
                  <Icon icon="mdi:lock-outline" className={styles.inputIcon} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="••••••••"
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

              <div className={styles.formOptions}>
                <Link to="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </div>

              <div className={styles.captchaContainer}>
                <ReCAPTCHA
                  sitekey={SITE_KEY}
                  onChange={handleRecaptcha}
                  className={loading ? styles.disabledCaptcha : ""}
                />
              </div>

              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon icon="mdi:loading" className={styles.spinnerIcon} />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className={styles.signupPrompt}>
  <p>
    Don’t have an account?{" "}
    <Link to="/signup" className={styles.signupLink}>
      Create one
    </Link>
  </p>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;