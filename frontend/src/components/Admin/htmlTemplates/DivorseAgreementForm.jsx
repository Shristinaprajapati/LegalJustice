import React, { useState } from 'react';
import axios from 'axios';
import styles from './DivorceAgreementForm.module.css';

const DivorceAgreementForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: '67a84aa53c49df8a5b9ca1df', // Hardcoded serviceId
    spouse1: '',
    spouse2: '',
    children: '',
    propertyDivision: '',
    alimony: '',
    spouse1Address: '',
    spouse2Address: '',
    marriageDate: '',
    marriageLocation: '',
    child1Name: '',
    child1DOB: '',
    child2Name: '',
    child2DOB: '',
    custodyArrangement: '',
    visitationSchedule: '',
    childSupport: '',
    realPropertyDivision: '',
    vehicleDivision: '',
    bankAccountDivision: '',
    retirementAccountDivision: '',
    personalPropertyDivision: '',
    alimonyAmount: '',
    alimonyDuration: '',
    alimonyStartDate: '',
    spouse1Name: '',
    spouse1Debts: '',
    spouse2Name: '',
    spouse2Debts: '',
    jurisdiction: '',
    spouse1SignatureDate: '',
    spouse2SignatureDate: '',
    witnessSignatureDate: '',
    notarySignatureDate: '',
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

    // Validate child DOB fields before submitting
    if (formData.child1DOB && !isValidDate(formData.child1DOB)) {
      console.log('Invalid child1DOB date');
      return;
    }

    if (formData.child2DOB && !isValidDate(formData.child2DOB)) {
      console.log('Invalid child2DOB date');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/divorse-agreement',
        formData
      );
      console.log('Success:', response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Divorce Agreement Form</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          'clientName',
          'clientId',
          'spouse1',
          'spouse2',
          'children',
          'propertyDivision',
          'alimony',
          'spouse1Address',
          'spouse2Address',
          'marriageDate',
          'marriageLocation',
          'child1Name',
          'child1DOB',
          'child2Name',
          'child2DOB',
          'custodyArrangement',
          'visitationSchedule',
          'childSupport',
          'realPropertyDivision',
          'vehicleDivision',
          'bankAccountDivision',
          'retirementAccountDivision',
          'personalPropertyDivision',
          'alimonyAmount',
          'alimonyDuration',
          'alimonyStartDate',
          'spouse1Name',
          'spouse1Debts',
          'spouse2Name',
          'spouse2Debts',
          'jurisdiction',
          'spouse1SignatureDate',
          'spouse2SignatureDate',
          'witnessSignatureDate',
          'notarySignatureDate',
        ].map((field) => (
          <div key={field} className={styles.field}>
            <label className={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
            </label>
            <input
              type={field.includes('DOB') || field.includes('Date') ? 'date' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
              className={styles.input}
              required={field === 'child1DOB' || field === 'child2DOB'} // Mark child DOB fields as required
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

export default DivorceAgreementForm;
