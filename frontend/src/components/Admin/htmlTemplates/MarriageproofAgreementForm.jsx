import React, { useState } from 'react';
import axios from 'axios';
import styles from './DivorceAgreementForm.module.css';

const MarriageProofForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: '67d8e753989451345160dba4', 
    spouse1Name: '',
    spouse2Name: '',
    marriageDate: '',
    marriageLocation: '',
    spouse1DOB: '',
    spouse2DOB: '',
    spouse1Address: '',
    spouse2Address: '',
    spouse1Occupation: '',
    spouse2Occupation: '',
    witness1Name: '',
    witness2Name: '',
    witness1Address: '',
    witness2Address: '',
    witness1Signature: '',
    witness2Signature: '',
    notarySignature: '',
    notaryName: '',
    notaryLicenseNumber: '',
    jurisdiction: '',
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

    // Validate date fields before submitting
    if (formData.marriageDate && !isValidDate(formData.marriageDate)) {
      console.log('Invalid marriage date');
      return;
    }

    if (formData.spouse1DOB && !isValidDate(formData.spouse1DOB)) {
      console.log('Invalid spouse1 DOB');
      return;
    }

    if (formData.spouse2DOB && !isValidDate(formData.spouse2DOB)) {
      console.log('Invalid spouse2 DOB');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/marriageproof/marriage-proof',
        formData
      );
      console.log('Success:', response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Marriage Proof Document Form</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          'clientName',
          'clientId',
          'spouse1Name',
          'spouse2Name',
          'marriageDate',
          'marriageLocation',
          'spouse1DOB',
          'spouse2DOB',
          'spouse1Address',
          'spouse2Address',
          'spouse1Occupation',
          'spouse2Occupation',
          'witness1Name',
          'witness2Name',
          'witness1Address',
          'witness2Address',
          'witness1Signature',
          'witness2Signature',
          'notarySignature',
          'notaryName',
          'notaryLicenseNumber',
          'jurisdiction',
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
              required={field === 'marriageDate' || field === 'spouse1DOB' || field === 'spouse2DOB'} // Mark date fields as required
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

export default MarriageProofForm;