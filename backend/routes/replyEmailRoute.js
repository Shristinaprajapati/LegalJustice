const express = require("express");
const sendEmail = require("../utils/sendEmail"); // Import the sendEmail utility
const router = express.Router();

// POST route to handle sending the reply email
router.post("/send-reply", async (req, res) => {
  const { email, subject, message } = req.body; // Correct destructuring to match frontend

  // Check if all fields are provided
  if (!email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Sending the email through the sendEmail utility
    await sendEmail(email, subject, message);

    // Send success response
    res.status(200).json({ message: "Reply sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send the reply" });
  }
});

module.exports = router;
