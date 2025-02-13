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
  capitalContribution1: { type: String, required: true },
  capitalContribution2: { type: String, required: true },
  profitSharingRatio: { type: String, required: true },
  decisionMaking: { type: String, required: true },
  disputeResolution: { type: String, required: true },
  agreementStartDate: { type: String, required: true },
  agreementEndDate: { type: String, required: true },
  jurisdiction: { type: String, required: true },
  partner1SignatureDate: { type: String, required: true },
  partner2SignatureDate: { type: String, required: true },
  witnessSignatureDate: { type: String, required: true },
  notarySignatureDate: { type: String, required: true },
}, { timestamps: true });

const Agreement = mongoose.model("Agreement", agreementSchema, "partnershipagreements");

module.exports = Agreement;
