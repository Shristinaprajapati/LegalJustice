const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  pidx: { type: String, required: true },
  transaction_id: { type: String, required: true },
  amount: { type: Number, required: true },
  fee: { type: Number },
  status: { type: String, required: true },
  refunded: { type: Boolean, default: false },
  mobile: { type: String, required: true },
  purchase_order_id: { type: String, required: true },
  purchase_order_name: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true }, // assuming you have a "Client" model
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }, // assuming you have a "Service" model
  category: { type: String, required: true }, // You can define the type as needed
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
