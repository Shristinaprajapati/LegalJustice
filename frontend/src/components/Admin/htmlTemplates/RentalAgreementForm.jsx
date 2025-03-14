import React, { useState } from 'react';
import axios from 'axios';
import styles from './DivorceAgreementForm.module.css';

const RentalAgreementForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: '67d3b7e6fd712ab1eddaf624', 
    landlordName: '',
    tenantName: '',
    propertyAddress: '',
    rentalStartDate: '',
    rentalEndDate: '',
    monthlyRent: '',
    securityDeposit: '',
    leaseTerm: '',
    landlordSignature: '',
    tenantSignature: '',
    witnessSignature: '',
    notarySignature: '',
    landlordContact: '',
    tenantContact: '',
    propertyDescription: '',
    utilitiesIncluded: '',
    lateFeePolicy: '',
    maintenanceResponsibilities: '',
    petPolicy: '',
    terminationClause: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidDate = (date) => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate); // Check if the date is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate rental start and end dates
    if (!isValidDate(formData.rentalStartDate)) {
      console.log('Invalid rental start date');
      return;
    }

    if (!isValidDate(formData.rentalEndDate)) {
      console.log('Invalid rental end date');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/rental/rental-agreement',
        formData
      );
      console.log('Success:', response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Rental Agreement Form</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          'clientName',
          'clientId',
          'landlordName',
          'tenantName',
          'propertyAddress',
          'rentalStartDate',
          'rentalEndDate',
          'monthlyRent',
          'securityDeposit',
          'leaseTerm',
          'landlordSignature',
          'tenantSignature',
          'witnessSignature',
          'notarySignature',
          'landlordContact',
          'tenantContact',
          'propertyDescription',
          'utilitiesIncluded',
          'lateFeePolicy',
          'maintenanceResponsibilities',
          'petPolicy',
          'terminationClause',
        ].map((field) => (
          <div key={field} className={styles.field}>
            <label className={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
            </label>
            <input
              type={field.includes('Date') ? 'date' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
              className={styles.input}
              required={field === 'rentalStartDate' || field === 'rentalEndDate'} // Mark date fields as required
            />
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default RentalAgreementForm;