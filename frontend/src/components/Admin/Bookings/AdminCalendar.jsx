import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Import Calendar component
import 'react-calendar/dist/Calendar.css'; // Import Calendar styles
import styles from './AdminCalendar.module.css'; // Optional: Custom styles
import axios from 'axios';

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [confirmedDates, setConfirmedDates] = useState([]);
  const [bookingsForSelectedDate, setBookingsForSelectedDate] = useState([]);

  // Fetch all bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bookings'); // Fetch all bookings
        const bookings = response.data.bookings || [];

        const formattedBookings = bookings.map((booking) => ({
          ...booking,
          date: new Date(booking.date), // Convert booking date to a Date object
        }));

        setConfirmedDates(formattedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Filter bookings for the selected date
    const bookings = confirmedDates.filter(
      (booking) =>
        booking.status === 'Confirmed' &&
        booking.date.toDateString() === date.toDateString()
    );
    setBookingsForSelectedDate(bookings);
  };

  // Function to delete a booking
  const handleDeleteBooking = async (_id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/bookings/${_id}`);
      if (response.status === 200) {
        // Remove the deleted booking from the state
        const updatedBookings = confirmedDates.filter((booking) => booking._id !== _id);
        setConfirmedDates(updatedBookings);

        // Refresh bookings for the selected date
        const filteredBookings = updatedBookings.filter(
          (booking) =>
            booking.status === 'Confirmed' &&
            booking.date.toDateString() === selectedDate.toDateString()
        );
        setBookingsForSelectedDate(filteredBookings);

        alert('Appointment Done.');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    }
  };

  // Function to apply styles to tiles (dates)
  const tileClassName = ({ date }) => {
    // Check if the date matches any confirmed booking date
    if (
      confirmedDates.some(
        (booking) =>
          booking.status === 'Confirmed' &&
          booking.date.toDateString() === date.toDateString()
      )
    ) {
      return styles.highlight; // Apply the custom 'highlight' class
    }
    return null;
  };

  return (
    <div className={styles.calendarContainer}>
      <h2>Admin Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName} // Apply custom styles for highlighted dates
      />
      <div className={styles.detailsContainer}>
        <h3>Bookings for {selectedDate.toDateString()}</h3>
        {bookingsForSelectedDate.length > 0 ? (
          <ul className={styles.bookingList}>
            {bookingsForSelectedDate.map((booking) => (
              <li key={booking._id} className={styles.bookingItem}>
                <p>
                  <strong>Client:</strong> {booking.clientId?.name || 'N/A'}
                </p>
                <p>
                  <strong>Email:</strong> {booking.clientId?.email || 'N/A'}
                </p>
                <p>
                  <strong>Service:</strong> {booking.serviceId?.title || 'N/A'}
                </p>
                <p>
                  <strong>Time Slot:</strong> {booking.timeSlot || 'N/A'}
                </p>
                {booking.status === 'Confirmed' && (
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
                    className={styles.statusButtonCancel}
                  >
                    Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings for this date.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCalendar;
