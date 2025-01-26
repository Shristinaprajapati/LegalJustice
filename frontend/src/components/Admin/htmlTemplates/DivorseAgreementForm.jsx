import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './DivorseAgreementForm.module.css';

const DivorceAgreementForm = ({ submitForm }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (submitForm) {
        await submitForm(formData);
      } else {
        const response = await axios.post(
          'http://localhost:8080/api/divorse-agreement/',
          formData
        );

        console.log('Success:', response.data.message);
        navigate('/divorce-agreement-template', { state: { clientId: formData.clientId } });
      }
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
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, ' $1')}
              :
            </label>
            <input
              type={field.toLowerCase().includes('date') ? 'date' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
              className={styles.input}
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
