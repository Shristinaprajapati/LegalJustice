import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../../Main/Header.jsx';
import Footer from '../../Footer.jsx';
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
      'transferorName', 'transfereeName', 
      'propertyAddress', 'propertyDescription'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.map(f => formatLabel(f)).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Validate dates
    const dateFields = [
      'transferDate', 'transferorSignatureDate',
      'transfereeSignatureDate', 'witnessSignatureDate',
      'notarySignatureDate'
    ];

    const invalidDates = dateFields.filter(field => !isValidDate(formData[field]));

    if (invalidDates.length > 0) {
      toast.error(`Invalid date format in: ${invalidDates.map(f => formatLabel(f)).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const loadingToast = toast.loading('Submitting property transfer agreement...');
      
      const response = await axios.post(
        'http://localhost:8080/api/propertytransfer/property-transfer-agreement',
        formData
      );
      
      toast.dismiss(loadingToast);
      toast.success('Property transfer agreement submitted successfully!');
      
      // Reset form except for client info and serviceId
      setFormData(prev => ({
        ...prev,
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
      }));

    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to submit agreement. Please try again.';
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
        { name: "transferorName", type: "text", required: true },
        { name: "transfereeName", type: "text", required: true },
      ],
    },
    {
      title: "Property Details",
      fields: [
        { name: "propertyAddress", type: "text", required: true },
        { name: "propertyDescription", type: "textarea", required: true },
      ],
    },
    {
      title: "Transfer Terms",
      fields: [
        { name: "transferDate", type: "date", required: false },
        { name: "considerationAmount", type: "text", required: false },
        { name: "paymentTerms", type: "text", required: false },
        { name: "jurisdiction", type: "text", required: false },
        { name: "additionalTerms", type: "textarea", required: false },
      ],
    },
    {
      title: "Signatures",
      fields: [
        { name: "transferorSignatureDate", type: "date", required: false },
        { name: "transfereeSignatureDate", type: "date", required: false },
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
          },
        }}
      />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Property Transfer Agreement</h1>
          <p className={styles.subheading}>
            Please fill in all required fields marked with <span className={styles.required}>*</span>
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

export default PropertyTransferAgreementForm;