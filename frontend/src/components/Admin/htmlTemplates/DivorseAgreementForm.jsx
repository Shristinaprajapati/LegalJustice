import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../../Main/Header.jsx';
import Footer from '../../Footer.jsx';
import styles from './DivorceAgreementForm.module.css';

const DivorceAgreementForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: '67a84aa53c49df8a5b9ca1df',
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to access this form');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setFormData(prev => ({
          ...prev,
          clientId: user.clientId,
          clientName: user.name || ''
        }));

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user information');
      }
    };

    fetchClientData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidDate = (date) => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields based on schema
    const requiredFields = [
      'clientName', 'clientId', 'spouse1', 'spouse2', 
      'spouse1Address', 'spouse2Address', 'marriageDate', 
      'marriageLocation', 'jurisdiction'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${formatLabel(field)}`);
        setIsSubmitting(false);
        return;
      }
    }

    // Validate date fields if they exist
    const dateFields = ['marriageDate', 'child1DOB', 'child2DOB', 'alimonyStartDate'];
    for (const field of dateFields) {
      if (formData[field] && !isValidDate(formData[field])) {
        toast.error(`Please enter a valid date for ${formatLabel(field)}`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/divorse-agreement',
        formData
      );
      toast.success('Divorce agreement submitted successfully!');
      console.log('Success:', response.data.message);
    } catch (error) {
      toast.error('Error submitting form. Please try again.');
      console.error('Error submitting form:', error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldGroups = [
    {
      title: 'Client Information',
      fields: [
        { name: 'clientName', editable: true, required: true },
        { name: 'clientId', editable: false, required: true }
      ],
      optional: false
    },
    {
      title: 'Spouse Information',
      fields: [
        { name: 'spouse1', editable: true, required: true },
        { name: 'spouse1Name', editable: true, required: false },
        { name: 'spouse1Address', editable: true, required: true },
        { name: 'spouse2', editable: true, required: true },
        { name: 'spouse2Name', editable: true, required: false },
        { name: 'spouse2Address', editable: true, required: true }
      ],
      optional: false
    },
    {
      title: 'Marriage Details',
      fields: [
        { name: 'marriageDate', editable: true, required: true },
        { name: 'marriageLocation', editable: true, required: true },
        { name: 'jurisdiction', editable: true, required: true }
      ],
      optional: false
    },
    {
      title: 'Children Information',
      fields: [
        { name: 'children', editable: true, required: false },
        { name: 'child1Name', editable: true, required: false },
        { name: 'child1DOB', editable: true, required: false },
        { name: 'child2Name', editable: true, required: false },
        { name: 'child2DOB', editable: true, required: false },
        { name: 'custodyArrangement', editable: true, required: false },
        { name: 'visitationSchedule', editable: true, required: false },
        { name: 'childSupport', editable: true, required: false }
      ],
      optional: true
    },
    {
      title: 'Property Division',
      fields: [
        { name: 'propertyDivision', editable: true, required: false },
        { name: 'realPropertyDivision', editable: true, required: false },
        { name: 'vehicleDivision', editable: true, required: false },
        { name: 'bankAccountDivision', editable: true, required: false },
        { name: 'retirementAccountDivision', editable: true, required: false },
        { name: 'personalPropertyDivision', editable: true, required: false }
      ],
      optional: true
    },
    {
      title: 'Financial Arrangements',
      fields: [
        { name: 'alimony', editable: true, required: false },
        { name: 'alimonyAmount', editable: true, required: false },
        { name: 'alimonyDuration', editable: true, required: false },
        { name: 'alimonyStartDate', editable: true, required: false },
        { name: 'spouse1Debts', editable: true, required: false },
        { name: 'spouse2Debts', editable: true, required: false }
      ],
      optional: true
    },
    {
      title: 'Signatures',
      fields: [
        { name: 'spouse1SignatureDate', editable: true, required: false },
        { name: 'spouse2SignatureDate', editable: true, required: false },
        { name: 'witnessSignatureDate', editable: true, required: false },
        { name: 'notarySignatureDate', editable: true, required: false }
      ],
      optional: true
    }
  ];

  const formatLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Toaster position="top-right" />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Divorce Agreement Form</h1>
          <p className={styles.subheading}>
            Fields marked with <span className={styles.required}>*</span> are required
          </p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {fieldGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.fieldGroup}>
                <h2 className={styles.groupTitle}>
                  {group.title}
                  {group.optional && <span className={styles.optionalTag}> (Optional)</span>}
                </h2>
                <div className={styles.groupFields}>
                  {group.fields.map((field) => (
                    <div key={field.name} className={styles.field}>
                      <label className={styles.label}>
                        {formatLabel(field.name)}
                        {field.required && <span className={styles.required}> *</span>}
                      </label>
                      <input
                        type={field.name.includes('DOB') || field.name.includes('Date') ? 'date' : 'text'}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={field.editable ? handleChange : undefined}
                        className={styles.input}
                        required={field.required}
                        readOnly={!field.editable}
                        disabled={!field.editable}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.submitContainer}>
              <button 
                type="submit" 
                className={styles.submitButton}
                style={{ backgroundColor: '#003d8f' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Agreement'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DivorceAgreementForm;