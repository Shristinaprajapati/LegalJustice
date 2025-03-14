const mongoose = require('mongoose');

const PropertyTransferAgreementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientId: { type: String, required: true },
  serviceId: { type: String, required: true },
  transferorName: { type: String, required: true },
  transfereeName: { type: String, required: true },
  propertyAddress: { type: String, required: true },
  propertyDescription: { type: String, required: true },
  transferDate: { type: Date, required: false },
  considerationAmount: { type: String, required: true },
  paymentTerms: { type: String, required: true },
  transferorSignatureDate: { type: Date, required: false},
  transfereeSignatureDate: { type: Date, required: false },
  witnessSignatureDate: { type: Date, required: false },
  notarySignatureDate: { type: Date, required: false},
  jurisdiction: { type: String, required: true },
  additionalTerms: { type: String, required: false },
});

module.exports = mongoose.model('PropertyTransferAgreement', PropertyTransferAgreementSchema);