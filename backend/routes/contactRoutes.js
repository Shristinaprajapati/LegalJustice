const express = require("express");
const Contact = require("../models/contact");

const router = express.Router();

// Route to handle contact form submissions
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new contact message
    const newMessage = new Contact({
      name,
      email,
      message,
    });

    // Save the contact message to the database
    await newMessage.save();

    res.status(200).send({ message: "Your message has been sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "There was an error sending your message." });
  }
});


// Route to get all contact messages (GET request)
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find(); // Fetch all contact messages from the database
    res.status(200).json(messages); // Return the messages as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching messages." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).send({ message: "Message not found." });
    }

    res.status(200).send({ message: "Message deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error deleting message." });
  }
});

module.exports = router;
