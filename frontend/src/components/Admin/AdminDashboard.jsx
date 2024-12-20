import React from 'react';
import Sidebar from './Sidebar';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h2>Admin Dashboard</h2>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Bookings</h3>
            <p>5 Pending</p>
          </div>
          <div className={styles.statCard}>
            <h3>Templates</h3>
            <p>3 Active</p>
          </div>
          <div className={styles.statCard}>
            <h3>Payments</h3>
            <p>$2000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
