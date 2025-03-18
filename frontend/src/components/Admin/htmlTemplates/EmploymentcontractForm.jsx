import React, { useState } from 'react';
import axios from 'axios';
import styles from './DivorceAgreementForm.module.css';

const EmploymentContractForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: '67d8e6c2989451345160db61',
    employerName: '',
    employeeName: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    salary: '',
    paymentFrequency: '',
    workHours: '',
    workLocation: '',
    probationPeriod: '',
    benefits: '',
    terminationConditions: '',
    confidentialityAgreement: '',
    nonCompeteAgreement: '',
    jurisdiction: '',
    employerSignatureDate: '',
    employeeSignatureDate: '',
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

    // Validate date fields before submitting
    if (formData.startDate && !isValidDate(formData.startDate)) {
      console.log('Invalid startDate');
      return;
    }

    if (formData.endDate && !isValidDate(formData.endDate)) {
      console.log('Invalid endDate');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/employment/employment-contract',
        formData
      );
      console.log('Success:', response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Employment Contract Form</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          'clientName',
          'clientId',
          'employerName',
          'employeeName',
          'jobTitle',
          'startDate',
          'endDate',
          'salary',
          'paymentFrequency',
          'workHours',
          'workLocation',
          'probationPeriod',
          'benefits',
          'terminationConditions',
          'confidentialityAgreement',
          'nonCompeteAgreement',
          'jurisdiction',
          'employerSignatureDate',
          'employeeSignatureDate',
          'witnessSignatureDate',
          'notarySignatureDate',
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
              required={field === 'startDate' || field === 'endDate'} // Mark start and end dates as required
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

export default EmploymentContractForm;