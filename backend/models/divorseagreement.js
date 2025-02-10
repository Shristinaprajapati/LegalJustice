const mongoose = require('mongoose');

const divorceAgreementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientId: { type: String, required: true },
  serviceId: { type: String, required: true },
  spouse1: { type: String, required: true },
  spouse2: { type: String, required: true },
  children: { type: String, required: false },
  propertyDivision: { type: String, required: false },
  alimony: { type: String, required: false },
  spouse1Address: { type: String, required: true },
  spouse2Address: { type: String, required: true },
  marriageDate: { type: Date, required: true },
  marriageLocation: { type: String, required: true },
  child1Name: { type: String, required: false },
  child1DOB: { type: Date, required: false },
  child2Name: { type: String, required: false },
  child2DOB: { type: Date, required: false },
  custodyArrangement: { type: String, required: false },
  visitationSchedule: { type: String, required: false },
  childSupport: { type: String, required: false },
  realPropertyDivision: { type: String, required: false },
  vehicleDivision: { type: String, required: false },
  bankAccountDivision: { type: String, required: false },
  retirementAccountDivision: { type: String, required: false },
  personalPropertyDivision: { type: String, required: false },
  alimonyAmount: { type: String, required: false },
  alimonyDuration: { type: String, required: false },
  alimonyStartDate: { type: Date, required: false },
  spouse1Name: { type: String, required: true },
  spouse1Debts: { type: String, required: false },
  spouse2Name: { type: String, required: true },
  spouse2Debts: { type: String, required: false },
  jurisdiction: { type: String, required: true },
  spouse1SignatureDate: { type: Date, required: true },
  spouse2SignatureDate: { type: Date, required: true },
  witnessSignatureDate: { type: Date, required: true },
  notarySignatureDate: { type: Date, required: true },
});

const DivorceAgreement = mongoose.model('DivorceAgreement', divorceAgreementSchema);

module.exports = DivorceAgreement;
