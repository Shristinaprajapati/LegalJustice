const mongoose = require('mongoose');

// Booking schema with optional adminNotes and timestamps
const bookingSchema = new mongoose.Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  timeSlot: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Pending' 
  },
  adminNotes: { 
    type: String, 
    required: false, 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Booking', bookingSchema);
