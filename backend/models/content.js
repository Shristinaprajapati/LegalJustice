// models/Content.js
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["privacyPolicy", "termsAndConditions"], // Only allow these two types
  },
  content: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;