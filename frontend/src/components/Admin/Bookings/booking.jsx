import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import axios from 'axios';
import styles from './booking.module.css';
import AdminCalendar from './AdminCalendar';
import BookingPopup from './bookingpopup';
import io from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_BASE_URL}`);

const Booking = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [refreshCalendar, setRefreshCalendar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [popupCategory, setPopupCategory] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/bookings`);
        if (Array.isArray(response.data.bookings)) {
          setAllBookings(response.data.bookings);
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

  const sendNotification = (clientId, message) => {
    socket.emit('sendNotification', {
      userId: clientId,
      message: message,
      type: 'booking'
    });
  };

  const handleStatusChange = async (_id, newStatus, category, bypassPopup = false) => {
    try {
      const bookingId = _id._id || _id;
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/bookings/${bookingId}`, { status: newStatus });
  
      if (response.status === 200) {
        setAllBookings(prev => prev.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));
        
        setBookings((prevBookings) => ({
          ...prevBookings,
          [category]: prevBookings[category].map((booking) =>
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          ),
        }));
        
        setRefreshCalendar((prev) => !prev);

        const updatedBooking = bookings[category].find(booking => booking._id === bookingId);
        
        if (updatedBooking && updatedBooking.clientId) {
          const serviceTitle = updatedBooking.serviceId?.title || 'your service';
          
          if (newStatus === 'Confirmed') {
            sendNotification(
              updatedBooking.clientId._id || updatedBooking.clientId,
              `Your booking has been confirmed for ${serviceTitle}`
            );
          } else if (newStatus === 'Pending') {
            sendNotification(
              updatedBooking.clientId._id || updatedBooking.clientId,
              `Your booking has been cancelled for ${serviceTitle}`
            );
          }
        }
  
        if (category === 'documentation' && newStatus === 'Confirmed' && !bypassPopup) {
          setSelectedBookingId(updatedBooking);
          setShowPopup(true);
          setPopupCategory(category);
        }
      } else {
        throw new Error(response.data.message || 'Failed to update status');
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
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/bookings/${_id}`);
      if (response.status === 200) {
        setAllBookings(prev => prev.filter(booking => booking._id !== _id));
        setBookings((prevBookings) => ({
          ...prevBookings,
          [category]: prevBookings[category].filter((booking) => booking._id !== _id),
        }));
        setActiveBookingId(null);
      } else {
        throw new Error('Failed to delete booking');
      }
    } catch (err) {
      setError(`Error deleting booking: ${err.message}`);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleTabClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleDotsClick = (bookingId) => {
    setActiveBookingId((prevId) => (prevId === bookingId ? null : bookingId));
  };

  const getFilteredBookings = () => {
    if (!searchQuery || (selectedCategory !== 'Consulting' && selectedCategory !== 'documentation')) {
      return bookings;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allBookings.filter(booking => {
      const clientName = booking.clientId?.name?.toLowerCase() || '';
      const serviceTitle = booking.serviceId?.title?.toLowerCase() || '';
      return clientName.includes(query) || serviceTitle.includes(query);
    });

    return filtered.reduce((acc, booking) => {
      const category = booking.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(booking);
      return acc;
    }, {});
  };

  const filteredBookings = getFilteredBookings();

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className={styles.bookingPage}>
      <Sidebar />

      <div className={styles.content}>
        <h2 className={styles.pageTitle}>Booking Management</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tabContainer}>
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

          {(selectedCategory === 'consulting' || selectedCategory === 'documentation') && (
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search by client name or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
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
            bookingData={selectedBookingId}
          />
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
                            <td>
                              {['documentation', 'Documentation'].includes(category.toLowerCase()) 
                                ? formatDate(booking.createdAt) 
                                : formatDate(booking.date)}
                            </td>
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
                    {(selectedCategory === 'Consulting' || selectedCategory === 'documentation') && filteredBookings[selectedCategory] ? (
                      filteredBookings[selectedCategory].length > 0 ? (
                        filteredBookings[selectedCategory].map((booking) => (
                          <tr key={booking._id}>
                            <td>
                              {['documentation', 'Documentation'].includes(selectedCategory.toLowerCase()) 
                                ? formatDate(booking.createdAt) 
                                : formatDate(booking.date)}
                            </td>
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
                      )
                    ) : (
                      bookings[selectedCategory] && bookings[selectedCategory].length > 0 ? (
                        bookings[selectedCategory].map((booking) => (
                          <tr key={booking._id}>
                            <td>
                              {['documentation', 'Documentation'].includes(selectedCategory.toLowerCase()) 
                                ? formatDate(booking.createdAt) 
                                : formatDate(booking.date)}
                            </td>
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
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Booking;