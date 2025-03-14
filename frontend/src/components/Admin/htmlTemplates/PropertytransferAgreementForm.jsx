import React, { useState } from 'react';
import axios from 'axios';
import styles from './DivorceAgreementForm.module.css';

const PropertyTransferAgreementForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: '67d3f9d3c5edee371762757b', 
    transferorName: '',
    transfereeName: '',
    propertyAddress: '',
    propertyDescription: '',
    transferDate: '',
    considerationAmount: '',
    paymentTerms: '',
    transferorSignatureDate: '',
    transfereeSignatureDate: '',
    witnessSignatureDate: '',
    notarySignatureDate: '',
    jurisdiction: '',
    additionalTerms: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/api/propertytransfer/property-transfer-agreement',
        formData
      );
      console.log('Success:', response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Property Transfer Agreement Form</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          'clientName',
          'clientId',
          'transferorName',
          'transfereeName',
          'propertyAddress',
          'propertyDescription',
          'transferDate',
          'considerationAmount',
          'paymentTerms',
          'transferorSignatureDate',
          'transfereeSignatureDate',
          'witnessSignatureDate',
          'notarySignatureDate',
          'jurisdiction',
          'additionalTerms',
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
              required
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

export default PropertyTransferAgreementForm;