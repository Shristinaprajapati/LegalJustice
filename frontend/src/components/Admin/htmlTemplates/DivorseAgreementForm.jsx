import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
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
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      transports: ['websocket'],
      withCredentials: true
    });
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

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
        toast.error('Failed to load user information');
      }
    };

    fetchClientData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'clientName', 'clientId', 'spouse1', 'spouse2', 
      'spouse1Address', 'spouse2Address', 'marriageDate', 
      'marriageLocation', 'jurisdiction'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map(f => formatLabel(f)).join(', ')}`);
      return false;
    }

    const dateFields = ['marriageDate', 'child1DOB', 'child2DOB', 'alimonyStartDate'];
    for (const field of dateFields) {
      if (formData[field] && !Date.parse(formData[field])) {
        toast.error(`Please enter a valid date for ${formatLabel(field)}`);
        return false;
      }
    }

    return true;
  };

  const sendAdminNotification = async (agreementId) => {
    try {
      const notificationPayload = {
        recipientId: '674952ba89c4cfb98008666d', // Admin ID
        clientId: formData.clientId,
        clientName: formData.clientName,
        title: 'Divorce Agreement Submission',
        message: `New divorce agreement submitted by ${formData.clientName} (ID: ${formData.clientId})`,
        type: 'general',
        actionUrl: `/admin/divorce-agreements/${agreementId}`,
        read: false
      };

      // Save notification to database
      const notificationResponse = await axios.post(
        'http://localhost:8080/api/admin/notifications/admin',
        notificationPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Emit socket notification
      if (socket) {
        socket.emit('sendAdminNotification', notificationResponse.data);
      }

    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Submit divorce agreement
      const response = await axios.post(
        'http://localhost:8080/api/divorse-agreement',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Divorce agreement submitted successfully!');
      
      // Send admin notification
      await sendAdminNotification(response.data._id);

      // Reset form (keep client info)
      setFormData(prev => ({
        ...prev,
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
      }));

    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to submit agreement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldGroups = [
    {
      title: 'Client Information',
      fields: [
        { name: 'clientName', type: 'text', editable: false, required: true },
        { name: 'clientId', type: 'text', editable: false, required: true }
      ]
    },
    {
      title: 'Spouse Information',
      fields: [
        { name: 'spouse1', type: 'text', editable: true, required: true },
        { name: 'spouse1Name', type: 'text', editable: true, required: false },
        { name: 'spouse1Address', type: 'text', editable: true, required: true },
        { name: 'spouse2', type: 'text', editable: true, required: true },
        { name: 'spouse2Name', type: 'text', editable: true, required: false },
        { name: 'spouse2Address', type: 'text', editable: true, required: true }
      ]
    },
    {
      title: 'Marriage Details',
      fields: [
        { name: 'marriageDate', type: 'date', editable: true, required: true },
        { name: 'marriageLocation', type: 'text', editable: true, required: true },
        { name: 'jurisdiction', type: 'text', editable: true, required: true }
      ]
    },
    {
      title: 'Children Information (Optional)',
      fields: [
        { name: 'children', type: 'text', editable: true, required: false },
        { name: 'child1Name', type: 'text', editable: true, required: false },
        { name: 'child1DOB', type: 'date', editable: true, required: false },
        { name: 'child2Name', type: 'text', editable: true, required: false },
        { name: 'child2DOB', type: 'date', editable: true, required: false },
        { name: 'custodyArrangement', type: 'text', editable: true, required: false },
        { name: 'visitationSchedule', type: 'text', editable: true, required: false },
        { name: 'childSupport', type: 'text', editable: true, required: false }
      ]
    },
    {
      title: 'Property Division (Optional)',
      fields: [
        { name: 'propertyDivision', type: 'text', editable: true, required: false },
        { name: 'realPropertyDivision', type: 'text', editable: true, required: false },
        { name: 'vehicleDivision', type: 'text', editable: true, required: false },
        { name: 'bankAccountDivision', type: 'text', editable: true, required: false },
        { name: 'retirementAccountDivision', type: 'text', editable: true, required: false },
        { name: 'personalPropertyDivision', type: 'text', editable: true, required: false }
      ]
    },
    {
      title: 'Financial Arrangements (Optional)',
      fields: [
        { name: 'alimony', type: 'text', editable: true, required: false },
        { name: 'alimonyAmount', type: 'text', editable: true, required: false },
        { name: 'alimonyDuration', type: 'text', editable: true, required: false },
        { name: 'alimonyStartDate', type: 'date', editable: true, required: false },
        { name: 'spouse1Debts', type: 'text', editable: true, required: false },
        { name: 'spouse2Debts', type: 'text', editable: true, required: false }
      ]
    },
    {
      title: 'Signatures (Optional)',
      fields: [
        { name: 'spouse1SignatureDate', type: 'date', editable: true, required: false },
        { name: 'spouse2SignatureDate', type: 'date', editable: true, required: false },
        { name: 'witnessSignatureDate', type: 'date', editable: true, required: false },
        { name: 'notarySignatureDate', type: 'date', editable: true, required: false }
      ]
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
                  {group.title.includes('(Optional)') && (
                    <span className={styles.optionalTag}> (Optional)</span>
                  )}
                </h2>
                <div className={styles.groupFields}>
                  {group.fields.map((field) => (
                    <div key={field.name} className={styles.field}>
                      <label className={styles.label}>
                        {formatLabel(field.name)}
                        {field.required && <span className={styles.required}> *</span>}
                      </label>
                      <input
                        type={field.type || (field.name.includes('Date') || field.name.includes('DOB') ? 'date' : 'text')}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Agreement'
                )}
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