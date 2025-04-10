import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import Sidebar from "./Sidebar";
import { FaDollarSign, FaUsers, FaTasks, FaBalanceScale, FaQuoteLeft, FaChartPie, FaFile, FaNewspaper  } from "react-icons/fa";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(null);
  const [bookingCount, setBookingCount] = useState(null);
  const [documentCount, setDocumentCount] = useState(null);
  const [conversionData, setConversionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Chart color scheme
  const COLORS = ['#4CAF50', '#F44336', '#2196F3', '#FFC107'];
  const RADIAN = Math.PI / 180;

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Fetch all data in parallel
        const [usersCountRes, bookingsCountRes, usersRes, bookingsRes, documentCountRes] = await Promise.all([
          axios.get("http://localhost:8080/api/users/count"),
          axios.get("http://localhost:8080/api/bookings/count"),
          axios.get("http://localhost:8080/api/users/clients"),
          axios.get("http://localhost:8080/api/bookings/all"),
          axios.get("http://localhost:8080/api/document/count"),

        ]);
  
        // Set basic counts
        setUserCount(usersCountRes.data.userCount);
        setBookingCount(bookingsCountRes.data.bookingCount);
        setDocumentCount(documentCountRes.data.documentCount);
  
        // Calculate conversion metrics
        const totalUsers = usersRes.data.length;
        console.log("Total Users:", totalUsers);  // Log total users
  
        // Extract signed-up users' _id and convert them to string for comparison
        const signedUpUserIds = usersRes.data.map(user => user._id.toString());
        console.log("Users who have signed up:", signedUpUserIds); // Log signed-up user ids as strings
  
        // Log the structure of bookingsRes.data to check if clientId is present
        console.log("Bookings Response Data:", bookingsRes.data);  // Log the structure of bookingsRes.data
  
        // Ensure bookingsRes.data.bookings is an array before proceeding
        const bookedUserIds = new Set(); // Use Set to ensure unique users
  
        // Loop through bookings and add clientId._id to the Set if it matches a signed-up user
        if (Array.isArray(bookingsRes.data.bookings)) {
          bookingsRes.data.bookings.forEach(booking => {
            // Convert clientId._id to string for comparison
            const bookingClientId = booking.clientId._id ? booking.clientId._id.toString() : '';
            
            // Log for debugging the clientId._id and compare it with signed-up user IDs
            console.log(`Comparing signedUpUserIds with booking clientId._id: ${bookingClientId}`);
  
            // Compare the clientId._id (converted to string) with the signed-up users' IDs
            if (signedUpUserIds.includes(bookingClientId)) {
              bookedUserIds.add(bookingClientId); // Add to Set, duplicates will be ignored
            }
          });
        }
  
        console.log("Unique Users who have booked services:", [...bookedUserIds]); // Log unique users who have booked
  
        // Number of unique users who have made bookings
        const bookingClients = bookedUserIds.size;
        console.log("Booking Clients (Unique Users who booked services):", bookingClients);  // Log unique users who have booked
  
        // Calculate conversion rate
        const conversionRate = totalUsers > 0 ? (bookingClients / totalUsers) * 100 : 0;
        console.log("Conversion Rate:", conversionRate); // Log conversion rate
  
        // Set conversion data for the chart
        setConversionData({
          chartData: [
            { name: "Booked Services", value: bookingClients },
            { name: "No Bookings", value: totalUsers - bookingClients },
          ],
          metrics: {
            totalUsers,
            bookingClients,
            conversionRate: conversionRate.toFixed(1),
          },
        });
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);
  
  
  
  const getLinkClass = (path) => {
    return location.pathname === path ? `${styles.link} ${styles.active}` : styles.link;
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.mainContent}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        
        {error && <div className={styles.errorAlert}>{error}</div>}

        {/* Stats Cards Row */}
        <div className={styles.statsGrid}>

          <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.usersIcon}`}>
              <FaUsers className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Registered Clients</h3>
              <p>{userCount ?? "—"}</p>
              {/* <span className={styles.trendNegative}>↓ 5% Since last month</span> */}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.bookingsIcon}`}>
              <FaTasks className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Total Bookings</h3>
              <p>{bookingCount ?? "—"}</p>
              {/* <span className={styles.trendPositive}>↑ 8% Since last month</span> */}
            </div>
          </div>

            <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.casesIcon}`}>
              <FaFile className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Total Docuemnts</h3>
              <p>{documentCount ?? "—"}</p>
              {/* <span className={styles.trendPositive}>↑ 12% Since last month</span> */}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${styles.completedIcon}`}>
              <FaNewspaper  className={styles.icon} />
            </div>
            <div className={styles.statDetails}>
              <h3>Total Blogs</h3>
              <p>2</p>
              {/* <span className={styles.trendPositive}>↑ 3% Since last month</span> */}
            </div>
          </div>
        </div>

        {/* Conversion Analytics Section */}
        <div className={styles.analyticsSection}>
          <div className={styles.sectionHeader}>
            {/* <FaChartPie className={styles.sectionIcon} /> */}
            <h2>Client Conversion Analytics</h2>
          </div>
          
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading conversion data...</p>
            </div>
          ) : conversionData ? (
            <div className={styles.analyticsContent}>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conversionData.chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {conversionData.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip 
                      formatter={(value, name) => [`${value} clients`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className={styles.metricsSummary}>
                <div className={styles.metricCard}>
                  <h4>Total Registered Users</h4>
                  <p className={styles.metricValue}>{conversionData.metrics.totalUsers}</p>
                </div>
                
                <div className={styles.metricCard}>
                  <h4>Users with Bookings</h4>
                  <p className={styles.metricValue}>{conversionData.metrics.bookingClients}</p>
                </div>
                
                <div className={styles.metricCard}>
                  <h4>Conversion Rate</h4>
                  <p className={styles.metricValue}>{conversionData.metrics.conversionRate}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.errorState}>
              <Icon icon="mdi:alert-circle-outline" className={styles.errorIcon} />
              <p>No conversion data available</p>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          
          <div className={styles.actionCards}>
            <Link to="/admin/post" className={styles.actionCard}>
              <div className={`${styles.actionIcon} ${styles.postIcon}`}>
                <Icon icon="mdi:post" />
              </div>
              <div className={styles.actionContent}>
                <h3>Privacy Policy</h3>
                <p>Manage privacy content</p>
              </div>
            </Link>

            <Link to="/testimonial" className={styles.actionCard}>
              <div className={`${styles.actionIcon} ${styles.testimonialIcon}`}>
                <FaQuoteLeft />
              </div>
              <div className={styles.actionContent}>
                <h3>Testimonials</h3>
                <p>Manage client testimonials</p>
              </div>
            </Link>

            <Link to="/list" className={styles.actionCard}>
              <div className={`${styles.actionIcon} ${styles.clientsIcon}`}>
                <FaUsers />
              </div>
              <div className={styles.actionContent}>
                <h3>Client Details</h3>
                <p>View all client information</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;