const mongoose = require('mongoose');

// Define the Divorce Agreement Schema
const divorceAgreementSchema = new mongoose.Schema({
  spouse1: {
    type: String,
    required: true,
  },
  spouse2: {
    type: String,
    required: true,
  },
  children: {
    type: [String],  // Array of strings for multiple children
    required: true,
  },
  propertyDivision: {
    type: String,
    required: true,
  },
  alimony: {
    type: String,
    required: true,
  },
  effectiveDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updatedAt` field when the document is saved
divorceAgreementSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model based on the schema
const DivorceAgreement = mongoose.model('DivorceAgreement', divorceAgreementSchema);

module.exports = DivorceAgreement;
