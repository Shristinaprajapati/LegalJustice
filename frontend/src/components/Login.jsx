import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; 
import axios from 'axios';  // Add axios for sending API requests



const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");  // State to manage error messages
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const url = "http://localhost:8080/api/auth"; 
      const { data: res } = await axios.post(url, data);  // Post request to authenticate user
      
      // Save token and email in local storage 
      localStorage.setItem('token', res.data);
      localStorage.setItem('email', data.email);
      
      // Check if the user is an admin and navigate accordingly
      if (res.isAdmin) {
        navigate("/admin/AdminDashboard"); // Navigate to admin panel
      } else {
        navigate("/");  // Navigate to regular user dashboard
      }

      console.log(res.message); // Log success message (optional)
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);  
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Login</h2>
        
        {/* Display error message if exists */}
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

          <br></br>
          <Link to="/forgot-password" style={{ alignSelf: "flex-start" }}>
            <p style={{ padding: "0 15px" }}>Forgot Password ?</p>
          </Link>
          <br></br>

          <button type="submit">Login</button>
        </form>
      </div>

      <div className={styles.loginImage}></div>
    </div>
  );
};

export default Login;
