import React, {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6Lc5D6IqAAAAAMu0jayEUodrDJOuDInq1lAMKLNw";

const Login = () => {
  const [recaptchaValue, setRecaptchaValue] = useState(""); // State for reCAPTCHA value
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const url = "http://localhost:8080/api/auth"; 
      const payload = {
        ...data,
        recaptchaValue, // Include the reCAPTCHA value
      };

      const { data: res } = await axios.post(url, payload); // Send payload with reCAPTCHA

      // Save token and email in local storage
      localStorage.setItem("token", res.data);
      localStorage.setItem("email", data.email);

      // Navigate based on user role
      if (res.isAdmin) {
        navigate("/admin/AdminDashboard");
      } else {
        navigate("/");
      }

      console.log(res.message); // Optional success message log
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message); // Display backend error message
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Login</h2>

        {/* Display error message */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <br />
          <Link to="/forgot-password" style={{ alignSelf: "flex-start" }}>
            <p>Forgot Password?</p>
          </Link>
          <br />

          <div className="captcha mt-2">
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={(value) => setRecaptchaValue(value)} // Set reCAPTCHA value
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div className={styles.loginImage}></div>
    </div>
  );
};

export default Login;
