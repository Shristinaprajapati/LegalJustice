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
  landlordContact: { type: String, required: true },
  tenantContact: { type: String, required: true },
  propertyDescription: { type: String, required: true },
  utilitiesIncluded: { type: String, required: true },
  lateFeePolicy: { type: String, required: true },
  maintenanceResponsibilities: { type: String, required: true },
  petPolicy: { type: String, required: true },
  terminationClause: { type: String, required: true },
});

const RentalAgreement = mongoose.model('RentalAgreement', rentalAgreementSchema);

module.exports = RentalAgreement;