const express = require("express");
const axios = require("axios");

const router = express.Router();  // Use a router instead of an app instance

require("dotenv").config();

// POST route for Khalti API initiation
router.post("/khalti-api", async (req, res) => {
  const payload = req.body;

  try {
    const khaltiResponse = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/initiate/',
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,  
        },
      }
    );

    // Send a response based on the Khalti API response
    if (khaltiResponse.data) {
      res.json({
        success: true,
        data: khaltiResponse.data,
      });
    } else {
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
    
  } catch (error) {
    console.error("Error during Khalti API request:", error);
    res.status(500).json({ message: "Error processing Khalti request", error: error.message });
  }
});

module.exports = router;  // Export the router
