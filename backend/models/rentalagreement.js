const mongoose = require('mongoose');

const rentalAgreementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientId: { type: String, required: true },
  serviceId: { type: String, required: true },
  landlordName: { type: String, required: true },
  tenantName: { type: String, required: true },
  propertyAddress: { type: String, required: true },
  rentalStartDate: { type: Date, required: true },
  rentalEndDate: { type: Date, required: true },
  monthlyRent: { type: Number, required: true }, 
  securityDeposit: { type: Number, required: true },
  leaseTerm: { type: String, required: true },
  landlordSignature: { type: String, required: false },
  tenantSignature: { type: String, required: false },
  witnessSignature: { type: String, required: false },
  notarySignature: { type: String, required: false },
  landlordContact: { type: String, required: false },
  tenantContact: { type: String, required: false },
  propertyDescription: { type: String, required: false },
  utilitiesIncluded: { type: String, required: false },
  lateFeePolicy: { type: String, required: false },
  maintenanceResponsibilities: { type: String, required: false },
  petPolicy: { type: String, required: false },
  terminationClause: { type: String, required: false },
});

const RentalAgreement = mongoose.model('RentalAgreement', rentalAgreementSchema);

module.exports = RentalAgreement;