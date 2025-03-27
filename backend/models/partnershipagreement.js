const mongoose = require("mongoose");

const agreementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientId: { type: String, required: true },
  serviceId: { type: String, required: true },
  partner1Name: { type: String, required: true },
  partner2Name: { type: String, required: true },
  businessName: { type: String, required: true },
  businessPurpose: { type: String, required: true },
  businessAddress: { type: String, required: true },
  capitalContribution1: { type: String, required: false},
  capitalContribution2: { type: String, required: false },
  profitSharingRatio: { type: String, required: false},
  decisionMaking: { type: String, required: false },
  disputeResolution: { type: String, required: false },
  agreementStartDate: { type: String, required: false},
  agreementEndDate: { type: String, required: false },
  jurisdiction: { type: String, required: false },
  partner1SignatureDate: { type: String, required: false },
  partner2SignatureDate: { type: String, required: false },
  witnessSignatureDate: { type: String, required: false },
  notarySignatureDate: { type: String, required: false},
}, { timestamps: true });

const Agreement = mongoose.model("Agreement", agreementSchema, "partnershipagreements");

module.exports = Agreement;
