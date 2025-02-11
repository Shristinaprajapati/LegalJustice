import React, { useEffect, useRef } from 'react';
import styles from './bookingpopup.module.css';
import io from 'socket.io-client';

const BookingPopup = ({ show, onConfirm, onCancel, bookingData }) => {
  const socket = useRef(null);

  useEffect(() => {
    // Connect to the socket only once when the component mounts
    if (!socket.current) {
      socket.current = io('http://localhost:8080');
    }

    // Listen for notification event
    socket.current.on('receiveNotification', (notificationData) => {
      alert(notificationData.message); // Show notification (could be a toast instead of alert)
    });

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        socket.current.off('receiveNotification');
      }
    };
  }, []);

  const handleSendForm = () => {
    // Get the clientId from the booking data
    const clientId = bookingData.clientId._id;
    
    // Prepare the notification data
    const notificationData = {
      message: 'Your booking form is ready. Click below to fill it out.',
      buttonText: 'Go to Form',
      redirectUrl: 'http://localhost:3000/divorseform', // URL to direct the client to the form
      clientId, // Send the clientId to target a specific user
    };
  
    // Log the notification data to check if it's correct
    console.log('Sending notification:', notificationData);
  
    // Emit event to backend with the notification data
    socket.current.emit('sendFormNotification', notificationData);
  
    // Call the onConfirm handler if needed
    onConfirm();
  };
  
  

  if (!show || !bookingData) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button onClick={onCancel} className={styles.closeButton}>X</button>
        <h3>Confirm Documentation Booking</h3>
        <p>Are you sure you want to confirm this documentation booking?</p>
        <div>
          <p><strong>Client Name:</strong> {bookingData.clientId?.name}</p>
          <p><strong>Email:</strong> {bookingData.clientId?.email}</p>
          <p><strong>Service:</strong> {bookingData.serviceId?.title}</p>
          <p><strong>Booking Date:</strong> {new Date(bookingData.createdAt).toLocaleDateString()}</p>
        </div>
        <div className={styles.popupButtons}>
          <button onClick={handleSendForm} className={styles.confirmButton}>
            Send Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;
