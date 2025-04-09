import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './SignUp.module.css'; 
import axios from 'axios';
import Loader from "./Loader";
import { Icon } from "@iconify/react";

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!data.name.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!data.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!data.phone.trim()) {
      setError("Phone number is required");
      return false;
    }

    if (!data.password) {
      setError("Password is required");
      return false;
    }

    if (data.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
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
      const url = "http://localhost:8080/api/users";
      const response = await axios.post(url, data, {
        validateStatus: (status) => status >= 200 && status < 500
      });

      if (response.status === 201) {
        navigate("/login", {
          state: { successMessage: "Account created successfully! Please log in." }
        });
        return;
      }

      // Handle specific error cases from server
      if (response.status === 400) {
        setError(response.data.message || "Invalid request data");
      } else if (response.status === 409) {
        setError(response.data.message || "Email already exists");
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (error.response) {
        setError(error.response.data.message || "An error occurred during registration.");
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
    <div className={styles.signupWrapper}>
      {loading && (
        <div className={styles.loaderOverlay}>
          <Loader />
        </div>
      )}
      
      <div className={styles.signupContainer}>
        <div className={styles.signupHero}>
          <h1 className={styles.mainHeading}>Welcome to Legal Justice Platform</h1>
          <p className={styles.subheading}>
            Create an account to access our comprehensive legal services and case management tools.
          </p>
          <div className={styles.signupIllustration}></div>
        </div>

        <div className={styles.signupFormContainer}>
          <div className={styles.signupForm}>
            <div className={styles.formHeader}>
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <Icon icon="mdi:alert-circle-outline" className={styles.errorIcon} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputContainer}>
                  <Icon icon="mdi:account-outline" className={styles.inputIcon} />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={styles.inputField}
                    disabled={loading}
                  />
                </div>
              </div>

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
                <label htmlFor="phone">Phone Number</label>
                <div className={styles.inputContainer}>
                  <Icon icon="mdi:phone-outline" className={styles.inputIcon} />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    placeholder="+977-0000000000"
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
                <p className={styles.passwordHint}>
                  Must be at least 8 characters
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={styles.inputContainer}>
                  <Icon icon="mdi:lock-check-outline" className={styles.inputIcon} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={styles.inputField}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.passwordToggle}
                    disabled={loading}
                  >
                    <Icon
                      icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                      className={styles.eyeIcon}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.signupButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon icon="mdi:loading" className={styles.spinnerIcon} />
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className={styles.loginPrompt}>
              <p>Already have an account?</p>
              <Link to="/login" className={styles.loginLink}>
                Log in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;