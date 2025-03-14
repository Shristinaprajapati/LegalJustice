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
    const serviceId = bookingData?.serviceId?._id;
  
    console.log('Service ID:', serviceId);
  
    // Initialize category and redirectUrl variables
    let redirectUrl = '';
    let category = ''; // Declare category variable
  
    // Determine the redirect URL and category based on the serviceId
    if (serviceId === '67a84aa53c49df8a5b9ca1df') {
      redirectUrl = 'http://localhost:3000/divorseform';
      category = 'Divorce Agreement';  // Corrected typo in category
    } else if (serviceId === '67abfc26166a138b70b6271d') {
      redirectUrl = 'http://localhost:3000/partnerform';
      category = 'Partnership Agreement';
    } else if (serviceId === '67d3b7e6fd712ab1eddaf624') {
        redirectUrl = 'http://localhost:3000/rentalform';
        category = 'Rental Agreement';
      } else if (serviceId === '67d3e4d8aafbee77550d4058') {
        redirectUrl = 'http://localhost:3000/marriageprooftemplate';
        category = 'Marriage Proof Document';
      } else if (serviceId === '67d3f9d3c5edee371762757b') {
        redirectUrl = 'http://localhost:3000/propertytransfer';
        category = 'Property Transfer Document';
    
    } else {
      // If there are more service IDs, you can add additional conditions here
      console.log('Service ID does not match any predefined IDs.');
      return; // Exit the function if no match is found
    }
  
    // Prepare the notification data
    const notificationData = {
      message: `Your booking has been confirmed. Fill out the below form to proceed with the ${category}.`,
      buttonText: 'Go to Form',
      redirectUrl, // Use the dynamically set redirectUrl
      clientId, // Send the clientId to target a specific user
      serviceId,
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
