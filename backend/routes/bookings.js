const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/service');
const User = require('../models/user');

// Fetch all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('clientId', 'name email') // Populating client details (name, email)
      .populate('serviceId', 'title'); // Populating service details (title)

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    // Format the response to match the frontend structure
    const bookingsWithDetails = bookings.map((booking) => {
      // Safely check for null values before accessing properties
      const client = booking.clientId ? {
        _id: booking.clientId._id,
        name: booking.clientId.name,
        email: booking.clientId.email,
      } : null;

      const service = booking.serviceId ? {
        _id: booking.serviceId._id,
        title: booking.serviceId.title,
      } : null;

      return {
        _id: booking._id,
        serviceId: service, // May be null
        clientId: client, // May be null
        category: booking.category, // Include category here
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        __v: booking.__v,
      };
    });

    res.status(200).json({ bookings: bookingsWithDetails });

  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});



// Create a booking (POST)
router.post('/', async (req, res) => {
  try {
    const { serviceId, clientId, date, timeSlot, category } = req.body;

    // Validate required fields for any booking
    if (!serviceId || !clientId) {
      return res.status(400).json({ message: 'Missing required fields: serviceId or clientId' });
    }

    // If it's a consulting booking, validate date and timeSlot
    if (category === "consulting" && (!date || !timeSlot)) {
      return res.status(400).json({ message: 'Missing required fields for consulting booking: date or timeSlot' });
    }

    // Prepare booking data based on category
    const bookingData = {
      serviceId,
      clientId,
      date: category === "consulting" ? date : undefined, // Include date only for consulting
      timeSlot: category === "consulting" ? timeSlot : undefined, 
      category,
      status: 'Pending', // Default status for new bookings
    };

    // Create a new booking
    const newBooking = new Booking(bookingData);

    // Save the booking to the database
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (err) {
    console.error('Error creating booking:', err); // Log error for debugging
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
});


// Update booking status (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the provided status
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update the booking's status
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: `Booking status updated to ${status}`,
      booking,
    });
  } catch (err) {
    console.error('Error updating booking status:', err); // Log error for debugging
    res.status(500).json({ message: 'Error updating booking status', error: err.message });
  }
});

// Approve or Reject a booking (Optional)
router.post('/:action/:id', async (req, res) => {
  try {
    const { action, id } = req.params;

    // Determine the status based on the action
    let status;
    if (action === 'approve') {
      status = 'Confirmed';
    } else if (action === 'reject') {
      status = 'Cancelled';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Update the booking's status
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: `Booking ${status.toLowerCase()}`,
      booking,
    });
  } catch (err) {
    console.error('Error updating booking status:', err); // Log error for debugging
    res.status(500).json({ message: 'Error updating booking status', error: err.message });
  }
});

// Fetch confirmed bookings
router.get('/confirmed', async (req, res) => {
  try {
    const confirmedBookings = await Booking.find({ status: 'Confirmed' });
    res.status(200).json({
      message: 'Confirmed bookings fetched successfully',
      bookings: confirmedBookings,
    });
  } catch (err) {
    console.error('Error fetching confirmed bookings:', err);
    res.status(500).json({ message: 'Error fetching confirmed bookings', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to find and delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err); // Log error for debugging
    res.status(500).json({ message: 'Error deleting booking', error: err.message });
  }
});




module.exports = router;
