// models/DivorceAgreement.js
const mongoose = require('mongoose');

const DivorceAgreementSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  spouse1: {
    type: String,
    required: true,
  },
  spouse2: {
    type: String,
    required: true,
  },
  children: {
    type: String,
    required: false,
  },
  propertyDivision: {
    type: String,
    required: true,
  },
  alimony: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DivorceAgreement', DivorceAgreementSchema);
