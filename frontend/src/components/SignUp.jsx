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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);

    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      setLoading(false);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.signupContainer}>
      {loading && <Loader />}

      <div className={styles.signupContent}>
        <h1 className={styles.mainHeading}>Welcome to Legal Justice!</h1>
        <p className={styles.subheading}>Create an account to get started with our services.</p>
      </div>

      <div className={styles.signupForm}>
        <h2 className={styles.heading}>Join Us Today!</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name:</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className={styles.inputField}
            />
          </div>

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
            <label className={styles.label}>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
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
                placeholder="Create a password"
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

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password:</label>
            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.passwordToggle}
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
            className={styles.signupButtonSubmit}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.loginLinkContainer}>
          <p className={styles.paragraph}>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;