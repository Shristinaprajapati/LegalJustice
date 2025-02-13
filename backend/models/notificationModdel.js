const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  serviceId: { type: String, required: true },
  message: { type: String, required: true },
  buttonText: { type: String },
  redirectUrl: { type: String },
  date: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
