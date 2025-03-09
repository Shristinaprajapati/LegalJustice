// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  pidx: { type: String, required: true }, // Payment ID from Khalti
  transaction_id: { type: String, required: true }, // Transaction ID from Khalti
  amount: { type: Number, required: true }, // Amount in paisa
  fee: { type: Number, default: 0 }, // Transaction fee
  status: { type: String, required: true }, // Payment status (e.g., "Completed")
  refunded: { type: Boolean, default: false }, // Whether the payment is refunded
  mobile: { type: String }, // User's mobile number
  purchase_order_id: { type: String, required: true }, // Your service ID
  purchase_order_name: { type: String, required: true }, // Service name
  clientId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Client ID
  serviceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Service ID
  category: { type: String, required: true }, // Service category
  paymentDate: { type: Date, default: Date.now }, // Payment date
  paymentMethod: { type: String, default: "Khalti" }, // Payment method
  paymentDetails: { type: Object, default: {} }, // Raw payment details from Khalti
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;

