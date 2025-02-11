const express = require("express");
const Notification = require("../models/notificationModdel");
const router = express.Router();

// Route to save notification
router.post("/create", async (req, res) => {
  try {
    const { clientId, message, buttonText, redirectUrl } = req.body;

    // Create new notification instance
    const newNotification = new Notification({
      clientId,
      message,
      buttonText,
      redirectUrl,
    });

    // Save notification to DB
    await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Notification saved successfully!",
      notification: newNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving notification.",
      error: error.message,
    });
  }
});

// Route to get notifications for a specific client
router.get("/:clientId", async (req, res) => {
  try {
    const notifications = await Notification.find({ clientId: req.params.clientId })
      .sort({ date: -1 }) // Sort by most recent first
      .limit(10); // Fetch the last 10 notifications

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications.",
      error: error.message,
    });
  }
});

module.exports = router;
