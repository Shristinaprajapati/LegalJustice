import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import styles from './AdminCalendar.module.css';

const localizer = momentLocalizer(moment);

const AdminCalendar = ({ refreshCalendar }) => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [confirmedDates, setConfirmedDates] = useState([]);
  const [bookingsForSelectedDate, setBookingsForSelectedDate] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [reminderForSelectedDate, setReminderForSelectedDate] = useState([]);

  // Fetch reminders from backend
  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reminders');
      const remindersData = response.data || [];
      
      // Filter out past reminders
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const validReminders = remindersData.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return reminderDate >= currentDate;
      });

      // Delete past reminders
      const pastReminders = remindersData.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return reminderDate < currentDate;
      });

      for (const reminder of pastReminders) {
        await axios.delete(`http://localhost:8080/api/reminders/${reminder._id}`);
      }

      setReminders(validReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  // Function to delete past bookings
  const deletePastBookings = async () => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const response = await axios.get('http://localhost:8080/api/bookings');
      const allBookings = response.data.bookings || [];
      const pastBookings = allBookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate < currentDate;
      });
      for (const booking of pastBookings) {
        await axios.delete(`http://localhost:8080/api/bookings/${booking._id}`);
      }
      return true;
    } catch (error) {
      console.error('Error deleting past bookings:', error);
      return false;
    }
  };

  // Fetch current and future bookings
  const fetchBookings = async () => {
    try {
      await deletePastBookings();
      const response = await axios.get('http://localhost:8080/api/bookings');
      const bookings = response.data.bookings || [];
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const formattedBookings = bookings
        .filter((booking) => {
          const bookingDate = new Date(booking.date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate >= currentDate;
        })
        .map((booking) => ({
          ...booking,
          date: new Date(booking.date),
        }));
      setConfirmedDates(formattedBookings);
      const bookingsForDate = formattedBookings.filter(
        (booking) =>
          booking.status === 'Confirmed' &&
          booking.date.toDateString() === selectedDate.toDateString()
      );
      setBookingsForSelectedDate(bookingsForDate);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Handle daily cleanup
  useEffect(() => {
    const loadData = async () => {
      await fetchBookings();
      await fetchReminders();
    };
    loadData();

    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    const timeUntilMidnight = midnight - now;
    const dailyCleanup = setTimeout(() => {
      loadData();
      setInterval(loadData, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
    return () => clearTimeout(dailyCleanup);
  }, [refreshCalendar]);

  // Handle booking deletion
  const handleDeleteBooking = async (_id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/bookings/${_id}`);
      if (response.status === 200) {
        const updatedBookings = confirmedDates.filter((booking) => booking._id !== _id);
        setConfirmedDates(updatedBookings);
        const filteredBookings = updatedBookings.filter(
          (booking) =>
            booking.status === 'Confirmed' &&
            booking.date.toDateString() === selectedDate.toDateString()
        );
        setBookingsForSelectedDate(filteredBookings);
        toast.success('Appointment marked as done.');

      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to complete appointment. Please try again.');
    }
  };

  // Handle reminder deletion
  const handleDeleteReminder = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/reminders/${id}`);
      if (response.status === 200) {
        setReminders(prev => prev.filter(r => r._id !== id));
        setReminderForSelectedDate([]);
        toast.success('Reminder deleted successfully');

      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Failed to delete reminder');
    }
  };

  // Open reminder modal
  const openReminderModal = () => {
    setReminderTitle('');
    setReminderDate('');
    setShowReminderModal(true);
  };

  // Save new reminder
  const handleSaveReminder = async () => {
    if (!reminderTitle || !reminderDate) {
      toast.success('Please enter both title and date.');

      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/reminders', {
        title: reminderTitle,
        date: new Date(reminderDate),
      });
      if (response.status === 201) {
        setReminders(prev => [...prev, response.data]);
        setShowReminderModal(false);
        toast.success('Reminder added successfully');
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
      alert('Failed to add reminder.');
    }
  };

  // Combine confirmed bookings and reminders as calendar events
  const events = [
    ...confirmedDates.map((booking) => ({
      title: `${booking.clientId?.name || 'Client'} - ${booking.serviceId?.title || 'Service'}`,
      start: new Date(booking.date),
      end: new Date(booking.date),
      allDay: true,
      resource: booking,
      type: 'booking',
    })),
    ...reminders.map((reminder) => ({
      title: `Reminder: ${reminder.title}`,
      start: new Date(reminder.date),
      end: new Date(reminder.date),
      allDay: true,
      resource: reminder,
      type: 'reminder',
    })),
  ];

  return (
    <div className={styles.calendarContainer}>
       <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: '#333',
      color: '#fff',
    },
  }}
/>

      <div className={styles.calendarPanel}>
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              fontFamily: 'Arial',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.type === 'reminder' ? '#f39c12' : '#004aad',
                borderRadius: '4px',
                border: 'none',
                color: 'white',
              },
            })}
            onSelectEvent={(event) => {
              setSelectedDate(new Date(event.start));
              if (event.type === 'reminder') {
                setReminderForSelectedDate([event.resource]);
                setBookingsForSelectedDate([]);
              } else {
                setReminderForSelectedDate([]);
                setBookingsForSelectedDate([event.resource]);
              }
            }}
          />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <button className={styles.reminderButton} onClick={openReminderModal}>
          + Add Reminder
        </button>

        {showReminderModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Add Reminder</h3>
              <input
                type="text"
                placeholder="Reminder Title"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                className={styles.modalInput}
              />
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className={styles.modalInput}
              />
              <div className={styles.modalActions}>
                <button onClick={() => setShowReminderModal(false)} className={styles.modalCancel}>Cancel</button>
                <button onClick={handleSaveReminder} className={styles.modalSave}>Save</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.detailsContainer}>
          <h3 className={styles.dateHeader}>Details for {selectedDate.toDateString()}</h3>

          {reminderForSelectedDate.length > 0 && (
            <ul className={styles.bookingList}>
              {reminderForSelectedDate.map((reminder) => (
                <li key={reminder._id} className={styles.bookingItem}>
                  <div className={styles.bookingDetails}>
                    <p><strong>Reminder:</strong> {reminder.title}</p>
                    <p><strong>Date:</strong> {new Date(reminder.date).toDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder._id)}
                    className={styles.statusButtonCancel}
                  >
                    Done
                  </button>
                </li>
              ))}
            </ul>
          )}

          {bookingsForSelectedDate.length > 0 ? (
            <ul className={styles.bookingList}>
              {bookingsForSelectedDate.map((booking) => (
                <li key={booking._id} className={styles.bookingItem}>
                  <div className={styles.bookingDetails}>
                    <p><strong>Client:</strong> {booking.clientId?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {booking.clientId?.email || 'N/A'}</p>
                    <p><strong>Service:</strong> {booking.serviceId?.title || 'N/A'}</p>
                    <p><strong>Time Slot:</strong> {booking.timeSlot || 'N/A'}</p>
                  </div>
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
          ) : reminderForSelectedDate.length === 0 ? (
            <p className={styles.noBookingsText}>No bookings or reminders for this date.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;