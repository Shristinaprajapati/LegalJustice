import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaDollarSign, FaUsers, FaTasks, FaBalanceScale } from "react-icons/fa";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(null);
  const [bookingCount, setBookingCount] = useState(null);

  // Fetch user count from the API
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/count");
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  // Fetch booking count from the API
  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/bookings/count");
        setBookingCount(response.data.bookingCount);
      } catch (error) {
        console.error("Error fetching booking count:", error);
      }
    };

    fetchBookingCount();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.budgetIcon}`}>
              <FaBalanceScale className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Total Cases</h3>
              <p>500</p>
              <span className={styles.increase}>↑ 12% Since last month</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.customersIcon}`}>
              <FaUsers className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Registered Clients</h3>
              <p>{userCount !== null ? `${userCount}` : "Loading..."}</p>
              <span className={styles.decrease}>↓ 16% Since last month</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.tasksIcon}`}>
              <FaTasks className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Total Bookings</h3>
              <p>{bookingCount !== null ? `${bookingCount}` : "Loading..."}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.profitIcon}`}>
              <FaDollarSign className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Completed Cases</h3>
              <p>15k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
