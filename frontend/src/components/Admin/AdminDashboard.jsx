import React from 'react';
import Sidebar from './Sidebar';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Admin Dashboard</h2>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>
              <h3>Bookings</h3>
            </div>
            <div className={styles.statValue}>
              <p>5 Pending</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTitle}>
              <h3>Templates</h3>
            </div>
            <div className={styles.statValue}>
              <p>3 Active</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTitle}>
              <h3>Payments</h3>
            </div>
            <div className={styles.statValue}>
              <p>$2000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
