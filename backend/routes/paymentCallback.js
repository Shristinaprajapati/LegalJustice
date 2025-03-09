const express = require('express');
const router = express.Router();
const axios = require('axios');
const Payment = require('../models/payment');
const Booking = require('../models/Booking');

// Khalti payment callback endpoint
router.post('/payment-callback', async (req, res) => {
  const {
    pidx,
    status,
    transaction_id,
    amount,
    total_amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    clientId,
    serviceId,
    category,
  } = req.body;

  try {
    // Verify payment status with Khalti
    const verificationResponse = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // If payment is completed, save the transaction and create a booking
    if (verificationResponse.data.status === 'Completed') {
      // Save payment to the database
      const paymentData = {
        pidx,
        transaction_id,
        amount: total_amount,
        status: verificationResponse.data.status,
        mobile,
        purchase_order_id,
        purchase_order_name,
        paymentDate: new Date(),
        paymentMethod: 'Khalti',
        paymentDetails: JSON.stringify(verificationResponse.data),
        clientId,
        serviceId,
        category,
      };
      await Payment.create(paymentData);

      // Create a booking
      const bookingData = {
        serviceId,
        clientId,
        category: 'documentation', // Set the category as non-consulting
      };
      await Booking.create(bookingData);

      // Respond to Khalti
      return res.status(200).json({ success: true });
    } else {
      // Payment not completed
      return res.status(400).json({ success: false, message: 'Payment not completed.' });
    }
  } catch (error) {
    console.error('Error processing Khalti callback:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;