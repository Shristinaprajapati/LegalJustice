const mongoose = require('mongoose');

const EmploymentContractSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientId: { type: String, required: true },
  serviceId: { type: String, required: true },
  employerName: { type: String, required: true },
  employeeName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  salary: { type: String, required: true },
  paymentFrequency: { type: String, required: true },
  workHours: { type: String, required: true },
  workLocation: { type: String, required: true },
  probationPeriod: { type: String, required: false },
  benefits: { type: String, required: false },
  terminationConditions: { type: String, required: false },
  confidentialityAgreement: { type: String, required: false },
  nonCompeteAgreement: { type: String, required: false },
  jurisdiction: { type: String, required: true },
  employerSignatureDate: { type: Date, required: false },
  employeeSignatureDate: { type: Date, required: false },
  witnessSignatureDate: { type: Date, required: false },
  notarySignatureDate: { type: Date, required: false },
});

module.exports = mongoose.model('EmploymentContract', EmploymentContractSchema);