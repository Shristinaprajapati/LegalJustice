import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../../Main/Header.jsx';
import Footer from '../../Footer.jsx';
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client data on component mount
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
        toast.error('Failed to load user information. Please refresh the page.');
      }
    };

    fetchClientData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValidDate = (date) => {
    if (!date) return true; // Optional dates can be empty
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields based on schema
    const requiredFields = [
      'clientName', 'clientId', 'serviceId',
      'employerName', 'employeeName', 'jobTitle',
      'startDate', 'salary', 'paymentFrequency',
      'workHours', 'workLocation', 'jurisdiction'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.map(f => formatLabel(f)).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Validate dates
    const dateFields = [
      'startDate', 'endDate',
      'employerSignatureDate', 'employeeSignatureDate',
      'witnessSignatureDate', 'notarySignatureDate'
    ];

    const invalidDates = dateFields.filter(field => !isValidDate(formData[field]));

    if (invalidDates.length > 0) {
      toast.error(`Invalid date format in: ${invalidDates.map(f => formatLabel(f)).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const loadingToast = toast.loading('Submitting employment contract...');
      
      const response = await axios.post(
        'http://localhost:8080/api/employment/employment-contract',
        formData
      );
      
      toast.dismiss(loadingToast);
      toast.success('Employment contract submitted successfully!');
      
      // Reset form except for client info and serviceId
      setFormData(prev => ({
        ...prev,
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
      }));

    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to submit contract. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldGroups = [
    {
      title: "Client Information",
      fields: [
        { name: "clientName", type: "text", required: true, editable: false },
        { name: "clientId", type: "text", required: true, editable: false },
      ],
    },
    {
      title: "Parties Information",
      fields: [
        { name: "employerName", type: "text", required: true },
        { name: "employeeName", type: "text", required: true },
      ],
    },
    {
      title: "Position Details",
      fields: [
        { name: "jobTitle", type: "text", required: true },
        { name: "startDate", type: "date", required: true },
        { name: "endDate", type: "date", required: false },
      ],
    },
    {
      title: "Compensation",
      fields: [
        { name: "salary", type: "text", required: true },
        { name: "paymentFrequency", type: "text", required: true },
      ],
    },
    {
      title: "Work Conditions",
      fields: [
        { name: "workHours", type: "text", required: true },
        { name: "workLocation", type: "text", required: true },
        { name: "probationPeriod", type: "text", required: false },
      ],
    },
    {
      title: "Legal Information",
      fields: [
        { name: "jurisdiction", type: "text", required: true },
      ],
    },
    {
      title: "Benefits & Agreements",
      fields: [
        { name: "benefits", type: "textarea", required: false },
        { name: "terminationConditions", type: "textarea", required: false },
        { name: "confidentialityAgreement", type: "textarea", required: false },
        { name: "nonCompeteAgreement", type: "textarea", required: false },
      ],
    },
    {
      title: "Signatures",
      fields: [
        { name: "employerSignatureDate", type: "date", required: false },
        { name: "employeeSignatureDate", type: "date", required: false },
        { name: "witnessSignatureDate", type: "date", required: false },
        { name: "notarySignatureDate", type: "date", required: false },
      ],
    },
  ];

  const formatLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderInputField = (field) => {
    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          className={`${styles.input} ${styles.textarea}`}
          required={field.required}
          readOnly={field.editable === false}
          disabled={field.editable === false}
          rows={4}
        />
      );
    }
    
    return (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        className={styles.input}
        required={field.required}
        readOnly={field.editable === false}
        disabled={field.editable === false}
      />
    );
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 5000,
          style: {
            fontSize: '14px',
            padding: '16px',
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 5000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 8000,
          },
        }}
      />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Employment Contract</h1>
          <p className={styles.subheading}>
            Fields marked with <span className={styles.required}>*</span> are required
          </p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {fieldGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.fieldGroup}>
                <h2 className={styles.groupTitle}>{group.title}</h2>
                <div className={styles.groupFields}>
                  {group.fields.map((field) => (
                    <div key={field.name} className={styles.field}>
                      <label className={styles.label}>
                        {formatLabel(field.name)}
                        {field.required && <span className={styles.required}> *</span>}
                      </label>
                      {renderInputField(field)}
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
                {isSubmitting ? 'Submitting...' : 'Submit Contract'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmploymentContractForm;