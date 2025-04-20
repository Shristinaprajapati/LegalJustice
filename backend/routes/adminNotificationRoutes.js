const express = require('express');
const router = express.Router();
const AdminNotification = require('../models/adminNotification');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/auth');



router.post('/admin', async (req, res) => {
    try {
      const notification = new AdminNotification(req.body);
      await notification.save();
      res.status(201).json({ message: 'Notification saved', notification });
    } catch (error) {
      console.error('Error saving admin notification:', error);
      res.status(500).json({ message: 'Failed to save notification' });
    }
  });


// Get all admin notifications (no auth filtering, general view)
router.get('/', async (req, res) => {
    try {
      const notifications = await AdminNotification.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  });
  

// PATCH /api/admin/notifications/:id/read
router.patch('/:id/read', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNotification = await AdminNotification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: updatedNotification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

  
module.exports = router;