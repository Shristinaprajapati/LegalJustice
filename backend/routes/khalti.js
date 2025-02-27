const express = require("express");
const axios = require("axios");
const Payment = require("../models/payment"); 

const router = express.Router();  // Use a router instead of an app instance
require("dotenv").config();


// Log the KHALTI_SECRET_KEY to check if it's loaded correctly
console.log("KHALTI_SECRET_KEY:", process.env.KHALTI_SECRET_KEY);

router.post("/khalti-api", async (req, res) => {
  const payload = req.body;
  const { clientId, serviceId, category } = payload;

  // Log the payload to check if all fields are correct
  console.log("Payload received for Khalti API:", payload);

  // Check if the necessary fields exist in the payload
  if (!clientId || !serviceId || !category) {
    return res.status(400).json({ success: false, message: "Missing required fields: clientId, serviceId, or category" });
  }

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

    // Save the transaction data to the DB
    await saveTransactionToDB({
      ...khaltiResponse.data,
      clientId,
      serviceId,
      category,
    });

    // Respond with the Khalti response data
    res.json({
      success: true,
      data: khaltiResponse.data,
    });
  } catch (error) {
    console.error("Error during Khalti API request:", error);
    res.status(500).json({ message: "Error processing Khalti request", error: error.message });
  }
});



router.get("/khalti-callback", async (req, res) => {
  const {
    pidx,
    status,
    transaction_id, // Khalti's response contains this for transaction
    tidx,
    amount,
    total_amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
  } = req.query;

  console.log("Received Khalti callback:", req.query); // Log all received data

  // Check for missing required parameters
  if (!pidx || !status) {
    return res.status(400).json({
      success: false,
      message: "Invalid callback: Missing required parameters (pidx or status).",
    });
  }

  try {
    // Check if Khalti secret key is set in environment variables
    if (!process.env.KHALTI_SECRET_KEY) {
      throw new Error("KHALTI_SECRET_KEY is not defined in environment variables.");
    }

    // Verify the payment using Khalti's Lookup API
    const verificationResponse = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx }, // Send pidx to verify the payment
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Khalti verification response:", verificationResponse.data);

    // Check if the payment was completed
    if (verificationResponse.data.status === "Completed") {
      // Save the transaction data in your DB if needed
      // (Example: saveTransactionToDB({ ...verificationResponse.data, purchase_order_id, purchase_order_name }));

      return res.json({
        success: true,
        message: "Payment verified successfully.",
        data: verificationResponse.data, // Include the verified data from Khalti
        transaction_id: transaction_id, // Send the Khalti transaction_id here
        purchase_order_id, // Include the original purchase_order_id
        transaction_code: pidx, // Include the payment identifier (pidx)
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Verification failed. Payment status is not completed.",
        status: verificationResponse.data.status,
      });
    }
  } catch (error) {
    console.error("Error verifying Khalti payment:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Error verifying payment with Khalti.",
      error: error?.response?.data || error.message,
    });
  }
});


// Function to Save Transaction to Database
const saveTransactionToDB = async (data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(data.clientId) || !mongoose.Types.ObjectId.isValid(data.serviceId)) {
      console.error("Invalid ObjectId for clientId or serviceId:", data.clientId, data.serviceId);
      return;
    }

    const newPayment = new Payment({
      pidx: data.pidx,
      transaction_id: data.transaction_id || "N/A", // Ensure it doesn't break if missing
      amount: data.total_amount || 0, // Default value if missing
      fee: data.fee || 0,
      status: data.status,
      refunded: data.refunded || false,
      mobile: data.mobile || "N/A",
      purchase_order_id: data.purchase_order_id || "N/A",
      purchase_order_name: data.purchase_order_name || "N/A",
      clientId: data.clientId, // Make sure it's a valid ObjectId
      serviceId: data.serviceId, // Make sure it's a valid ObjectId
      category: data.category || "Unknown", // Ensure a valid category
    });

    await newPayment.save();
    console.log("Transaction saved successfully:", newPayment);
  } catch (error) {
    console.error("Error saving transaction:", error);
  }
};




// const saveTransactionToDB = async (data) => {
//   try {
//     const newPayment = new Payment({
//       pidx: data.pidx,
//       transaction_id: data.transaction_id,
//       amount: data.amount,
//       status: data.status,
//       mobile: data.mobile,
//       purchase_order_id: data.purchase_order_id,
//       purchase_order_name: data.purchase_order_name,
//     });

//     await newPayment.save();
//     console.log("Transaction saved successfully");
//   } catch (error) {
//     console.error("Error saving transaction:", error);
//   }
// };



module.exports = router;  
