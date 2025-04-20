const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  recipientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'New Notification'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['rental_agreement', 'document', 'booking', 'general'],
    default: 'rental_agreement'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { 
    virtuals: true 
  }
});

// Indexes for optimized queries
adminNotificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });
adminNotificationSchema.index({ createdAt: -1 });

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);

module.exports = AdminNotification;