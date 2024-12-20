import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css'; 
import axios from 'axios';  // Added the correct axios import

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");  // State to store the error message
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);  // Post request to backend
      navigate("/login");  // Redirect to login page after successful sign-up
      console.log(res.message); // Log success message
    } catch (error) {
      if (error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);  // Set error message if sign-up fails
      }
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupForm}>
        <h2>Sign Up</h2>
        
        {/* Display error message if it exists */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
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
              required
            />
          </div>

          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className={styles.signupImageContainer}></div>
    </div>
  );
};

export default SignUp;
