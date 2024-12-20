import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import axios from 'axios';
import styles from './booking.module.css';
import AdminCalendar from './AdminCalendar';

const Booking = () => {
  const [bookings, setBookings] = useState([]); // Holds bookings data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bookings');
        if (Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings);
        } else {
          throw new Error('Invalid data structure received');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings: ' + err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle booking status change
  const handleStatusChange = async (_id, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/bookings/${_id}`,
        { status: newStatus }
      );
      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === _id ? { ...booking, status: newStatus } : booking
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Error updating booking status: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className={styles.bookingPage}>
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className={styles.content}>
        <h2 className={styles.pageTitle}>Booking Management</h2>

        {/* Display Error Message */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Booking Table */}
        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.date}</td>
                  <td>{booking.timeSlot}</td>
                  <td>{booking.clientId?.name || 'N/A'}</td>
                  <td>{booking.clientId?.email || 'N/A'}</td>
                  <td>{booking.serviceId?.title || 'N/A'}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        booking.status === 'Confirmed'
                          ? styles.confirmed
                          : styles.pending
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'Pending' ? (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'Confirmed')}
                        className={styles.statusButton}
                      >
                        Confirm
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'Pending')}
                        className={styles.statusButtonCancel}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No bookings available</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Admin Calendar */}
        <div className={styles.calendarSection}>
          <AdminCalendar />
        </div>
      </div>
    </div>
  );
};

export default Booking;
