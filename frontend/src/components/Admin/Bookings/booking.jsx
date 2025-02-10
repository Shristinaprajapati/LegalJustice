import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import axios from 'axios';
import styles from './booking.module.css';
import AdminCalendar from './AdminCalendar';
import BookingPopup from './bookingpopup';

const Booking = () => {
  const [bookings, setBookings] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBookingId, setActiveBookingId] = useState(null); // For tracking the booking with active "dots menu"
  const [refreshCalendar, setRefreshCalendar] = useState(false); // New state for refresh

   // New state for popup
   const [showPopup, setShowPopup] = useState(false);
   const [selectedBookingId, setSelectedBookingId] = useState(null);
   const [popupCategory, setPopupCategory] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bookings');
        if (Array.isArray(response.data.bookings)) {
          const categorizedBookings = response.data.bookings.reduce((acc, booking) => {
            const category = booking.category || 'Uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(booking);
            return acc;
          }, {});
          setBookings(categorizedBookings);
        } else {
          throw new Error('Invalid data structure received');
        }
      } catch (err) {
        setError(`Failed to fetch bookings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const handleStatusChange = async (_id, newStatus, category, bypassPopup = false) => {
    console.log(`Category: ${category}, New Status: ${newStatus}`);  // Debug log
    try {
      // Ensure _id is the correct booking ID, not the whole booking object
      const bookingId = _id._id || _id;  // If _id is an object, extract the actual ID
  
      const response = await axios.patch(`http://localhost:8080/api/bookings/${bookingId}`, { status: newStatus });
  
      if (response.status === 200) {
        setBookings((prevBookings) => ({
          ...prevBookings,
          [category]: prevBookings[category].map((booking) =>
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          ),
        }));
        setRefreshCalendar((prev) => !prev);
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
  
      if (category === 'documentation' && newStatus === 'Confirmed' && !bypassPopup) {
        // Find the booking data using the bookingId
        const bookingData = bookings[category].find((booking) => booking._id === bookingId);
        
        // Set the full booking data in state
        setSelectedBookingId(bookingData);  // Pass the entire booking data
  
        // Show the popup
        setShowPopup(true);
        setPopupCategory(category);
      }
    } catch (err) {
      setError(`Error updating booking status: ${err.message}`);
    }
  };
  
  
  

  const handlePopupConfirm = () => {
    handleStatusChange(selectedBookingId, 'Confirmed', popupCategory, true);
    setShowPopup(false);
  };
  

  const handlePopupCancel = () => {
    setShowPopup(false);
  };

  const handleDeleteBooking = async (_id, category) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/bookings/${_id}`);
      if (response.status === 200) {
        setBookings((prevBookings) => ({
          ...prevBookings,
          [category]: prevBookings[category].filter((booking) => booking._id !== _id),
        }));
        setActiveBookingId(null); // Hide the delete button after successful delete
      } else {
        throw new Error('Failed to delete booking');
      }
    } catch (err) {
      setError(`Error deleting booking: ${err.message}`);
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleTabClick = (category) => setSelectedCategory(category);

  const handleDotsClick = (bookingId) => {
    setActiveBookingId((prevId) => (prevId === bookingId ? null : bookingId)); // Toggle visibility of delete button
  };

  

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className={styles.bookingPage}>
      <Sidebar />

      <div className={styles.content}>
        <h2 className={styles.pageTitle}>Booking Management</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${selectedCategory === 'All' ? styles.activeTab : ''}`}
            onClick={() => handleTabClick('All')}
          >
            All
          </div>
          {Object.keys(bookings).map((category) => (
            <div
              key={category}
              className={`${styles.tab} ${selectedCategory === category ? styles.activeTab : ''}`}
              onClick={() => handleTabClick(category)}
            >
              {category}
            </div>
          ))}
        </div>

        <div className={styles.bookingList}>
          {selectedCategory === 'All'
            ? Object.keys(bookings).map((category) => (
                <div key={category} className={styles.bookingSection}>
                  <h3 className={styles.categoryTitle}>{category}</h3>
                  <table className={styles.bookingTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        {category === 'Consulting' && <th>Time</th>}
                        <th>Client Name</th>
                        <th>Email</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings[category].length > 0 ? (
                        bookings[category].map((booking) => (
                          <tr key={booking._id}>
                            <td>{category === 'Documentation' ? formatDate(booking.createdAt) : formatDate(booking.date)}</td>
                            {category === 'Consulting' && <td>{booking.timeSlot}</td>}
                            <td>{booking.clientId?.name || 'N/A'}</td>
                            <td>{booking.clientId?.email || 'N/A'}</td>
                            <td>{booking.serviceId?.title || 'N/A'}</td>
                            <td>
                              <span
                                className={`${styles.status} ${
                                  booking.status === 'Confirmed' ? styles.confirmed : styles.pending
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td>
                              {booking.status === 'Pending' ? (
                                <button
                                  onClick={() => handleStatusChange(booking._id, 'Confirmed', category)}
                                  className={styles.statusButton}
                                >
                                  Confirm
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(booking._id, 'Pending', category)}
                                  className={styles.statusButtonCancel}
                                >
                                  Cancel
                                </button>
                              )}
                              <div className={styles.actionsMenu}>
                                <button
                                  className={styles.dotsButton}
                                  onClick={() => handleDotsClick(booking._id)}
                                >
                                  ...
                                </button>
                                {activeBookingId === booking._id && (
                                  <div className={styles.dotsMenu}>
                                    <button
                                      className={styles.deleteButton}
                                      onClick={() => handleDeleteBooking(booking._id, category)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
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
                </div>
              ))
            : (
              <div className={styles.bookingSection}>
                <h3 className={styles.categoryTitle}>{selectedCategory}</h3>
                <table className={styles.bookingTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      {selectedCategory === 'Consulting' && <th>Time</th>}
                      <th>Client Name</th>
                      <th>Email</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings[selectedCategory].length > 0 ? (
                      bookings[selectedCategory].map((booking) => (
                        <tr key={booking._id}>
                          <td>{selectedCategory === 'Documentation' ? formatDate(booking.createdAt) : formatDate(booking.date)}</td>
                          {selectedCategory === 'Consulting' && <td>{booking.timeSlot}</td>}
                          <td>{booking.clientId?.name || 'N/A'}</td>
                          <td>{booking.clientId?.email || 'N/A'}</td>
                          <td>{booking.serviceId?.title || 'N/A'}</td>
                          <td>
                            <span
                              className={`${styles.status} ${
                                booking.status === 'Confirmed' ? styles.confirmed : styles.pending
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            {booking.status === 'Pending' ? (
                              <button
                                onClick={() => handleStatusChange(booking._id, 'Confirmed', selectedCategory)}
                                className={styles.statusButton}
                              >
                                Confirm
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(booking._id, 'Pending', selectedCategory)}
                                className={styles.statusButtonCancel}
                              >
                                Cancel
                              </button>
                            )}
                            <div className={styles.actionsMenu}>
                              <button
                                className={styles.dotsButton}
                                onClick={() => handleDotsClick(booking._id)}
                              >
                                ...
                              </button>
                              {activeBookingId === booking._id && (
                                <div className={styles.dotsMenu}>
                                  <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteBooking(booking._id, selectedCategory)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
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
              </div>
            )}
        </div>

        <div className={styles.calendarSection}>
        {(selectedCategory === "Consulting" || selectedCategory === "All") && (
            <AdminCalendar refreshCalendar={refreshCalendar} />
          )}

  <BookingPopup 
  show={showPopup} 
  onConfirm={handlePopupConfirm} 
  onCancel={handlePopupCancel} 
  bookingData={selectedBookingId} // Pass the selected booking data
/>

      
</div>

      </div>
    </div>
  );
};

export default Booking;
