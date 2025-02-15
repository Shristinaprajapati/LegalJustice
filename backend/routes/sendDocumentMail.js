const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");
const multer = require("multer");
const upload = multer();  // You can configure storage settings if needed

// POST route to send email
router.post("/mail", upload.single('file'), async (req, res) => {
  const { email, subject, message } = req.body;
  const file = req.file;

  let emailText = message;
  if (file) {
    emailText += `\n\nAttachment: ${file.originalname}`;
  }

  try {
    // Pass file buffer to the sendEmail function
    await sendEmail(email, subject, emailText, file);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email." });
  }
});

module.exports = router;
