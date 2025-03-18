const express = require("express");
const axios = require("axios");
const Payment = require("../models/payment");
const mongoose = require("mongoose");


const router = express.Router();
require("dotenv").config();


router.post("/khalti-api", async (req, res) => {
  const payload = req.body;

  console.log("Payload received for Khalti API:", payload);

  // Validate required fields
  if (
    !payload.return_url ||
    !payload.website_url ||
    !payload.amount ||
    !payload.purchase_order_id ||
    !payload.purchase_order_name ||
    !payload.customer_info?.name ||
    !payload.customer_info?.email ||
    !payload.customer_info?.phone ||
    !payload.serviceId ||
    !payload.clientId ||
    !payload.category
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid request: Missing required fields.",
    });
  }

  try {
    const khaltiResponse = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    console.log("Khalti API Response:", khaltiResponse.data);

    res.json({ success: true, data: khaltiResponse.data });
  } catch (error) {
    console.error("Error during Khalti API request:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });

    res.status(500).json({
      message: "Error processing Khalti request",
      error: error.response?.data || error.message,
    });
  }
});


router.get("/khalti-callback", async (req, res) => {
  const {
    pidx,
    status,
    transaction_id,
    amount,
    total_amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    clientId,
    serviceId,
    category,
  } = req.query;

  // Validate required parameters
  if (!pidx || !status || !clientId || !serviceId || !category) {
    return res.status(400).json({
      success: false,
      message: "Invalid callback: Missing required parameters (pidx, status, clientId, serviceId, or category).",
    });
  }

  try {
    // Verify payment status with Khalti
    const verificationResponse = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // If payment is completed, save the transaction to your database
    if (verificationResponse.data.status === "Completed") {
      const transactionData = {
        pidx,
        transaction_id,
        amount: total_amount,
        status: verificationResponse.data.status,
        mobile,
        purchase_order_id,
        purchase_order_name,
        paymentDate: new Date(),
        paymentMethod: "Khalti",
        paymentDetails: JSON.stringify(verificationResponse.data),
        clientId,
        serviceId,
        category,
      };

      // Save transaction to the database
      await saveTransactionToDB(transactionData);

      return res.json({
        success: true,
        message: "Payment verified and transaction saved successfully.",
        data: verificationResponse.data,
        transaction_id,
        purchase_order_id,
        transaction_code: pidx,
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


router.get("/payment-status/:serviceId/:clientId", async (req, res) => {
  const { serviceId } = req.params;

  try {
    // Fetch the transaction from the database
    const transaction = await Payment.findOne({ serviceId });
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    // Return the payment status
    res.json({ success: true, status: transaction.status });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching payment status." });
  }
});

// Save payment to the database
router.post("/payments", async (req, res) => {
  try {
    let {
      pidx,
      transaction_id,
      amount,
      fee,
      status,
      refunded,
      mobile,
      purchase_order_id,
      purchase_order_name,
      clientId,
      serviceId,
      category,
      paymentMethod,
      paymentDetails,
    } = req.body;

    // Validate required fields
    if (
      !pidx ||
      !transaction_id ||
      !amount ||
      !status ||
      !purchase_order_id ||
      !purchase_order_name ||
      !clientId ||
      !serviceId ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Convert to valid MongoDB ObjectId
    try {
      clientId = new mongoose.Types.ObjectId(clientId);
      serviceId = new mongoose.Types.ObjectId(serviceId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid ObjectId format for clientId or serviceId",
      });
    }

    // Create and save new payment record
    const newPayment = new Payment({
      pidx,
      transaction_id,
      amount,
      fee: fee || 0,
      status,
      refunded: refunded || false,
      mobile,
      purchase_order_id,
      purchase_order_name,
      clientId,
      serviceId,
      category,
      paymentDate: new Date(),
      paymentMethod: paymentMethod || "Khalti",
      paymentDetails: paymentDetails || {},
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: newPayment,
    });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({
      success: false,
      message: "Error saving payment",
      error: error.message,
    });
  }
});



  router.get("/payments", async (req, res) => {
    try {
      const { clientId, serviceId, transaction_id } = req.query;
  
      // Build the query object based on provided parameters
      const query = {};
      if (clientId) query.clientId = new mongoose.Types.ObjectId(clientId);
      if (serviceId) query.serviceId = new mongoose.Types.ObjectId(serviceId);
      if (transaction_id) query.transaction_id = transaction_id;
  
      // Fetch payments from the database
      const payments = await Payment.find(query);
  
      // If no payments are found, return a 404 response
      if (!payments || payments.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No payments found for the given criteria.",
        });
      }
  
      // Return the payments data
      res.status(200).json({
        success: true,
        message: "Payments retrieved successfully.",
        data: payments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching payments.",
        error: error.message,
      });
    }
  });



  router.get("/payments/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params; // Extract clientId from the URL parameters
  
      // Validate clientId
      if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid clientId.",
        });
      }
  
      // Fetch payments for the given clientId
      const payments = await Payment.find({ clientId: new mongoose.Types.ObjectId(clientId) });
  
      // If no payments are found, return a 404 response
      if (!payments || payments.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No payments found for the given clientId.",
        });
      }
  
      // Return the payments data
      res.status(200).json({
        success: true,
        message: "Payments retrieved successfully.",
        data: payments,
      });
    } catch (error) {
      console.error("Error fetching payments by clientId:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching payments.",
        error: error.message,
      });
    }
  });

module.exports = router;