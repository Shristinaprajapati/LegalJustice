const mongoose = require('mongoose');

const marriageProofSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientId: { type: String, required: true },
  serviceId: { type: String, required: true },
  spouse1Name: { type: String, required: true },
  spouse2Name: { type: String, required: true },
  marriageDate: { type: Date, required: true },
  marriageLocation: { type: String, required: true },
  spouse1DOB: { type: Date, required: true },
  spouse2DOB: { type: Date, required: true },
  spouse1Address: { type: String, required: true },
  spouse2Address: { type: String, required: true },
  spouse1Occupation: { type: String, required: true },
  spouse2Occupation: { type: String, required: true },
  witness1Name: { type: String, required: true },
  witness2Name: { type: String, required: true },
  witness1Address: { type: String, required: true },
  witness2Address: { type: String, required: true },
  witness1Signature: { type: String, required: false },
  witness2Signature: { type: String, required: false },
  notarySignature: { type: String, required: false },
  notaryName: { type: String, required: true },
  notaryLicenseNumber: { type: String, required: true },
  jurisdiction: { type: String, required: true },
});

const MarriageProof = mongoose.model('MarriageProof', marriageProofSchema);

module.exports = MarriageProof;