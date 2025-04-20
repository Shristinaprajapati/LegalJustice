import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../../Main/Header.jsx';
import Footer from '../../Footer.jsx';
import styles from './DivorceAgreementForm.module.css';
import { io } from 'socket.io-client';

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
      [name]: value
    }));
  };

  const validateForm = () => {
    // Validate required fields
    const requiredFields = [
      'clientName', 'clientId', 'spouse1Name', 'spouse2Name',
      'marriageDate', 'marriageLocation', 'spouse1DOB', 'spouse2DOB',
      'spouse1Address', 'spouse2Address', 'spouse1Occupation', 'spouse2Occupation',
      'witness1Name', 'witness2Name', 'witness1Address', 'witness2Address',
      'notaryName', 'notaryLicenseNumber', 'jurisdiction'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields`);
      return false;
    }

    // Validate dates
    const dateFields = ['marriageDate', 'spouse1DOB', 'spouse2DOB'];
    const invalidDates = dateFields.filter(field => !Date.parse(formData[field]));

    if (invalidDates.length > 0) {
      toast.error(`Invalid dates for: ${invalidDates.map(f => formatLabel(f)).join(', ')}`);
      return false;
    }

    return true;
  };

  const sendAdminNotification = async (documentId) => {
    try {
      const notificationPayload = {
        recipientId: '674952ba89c4cfb98008666d', // Admin ID
        clientId: formData.clientId,
        clientName: formData.clientName,
        title: 'Marriage Proof Submission',
        message: `New marriage proof document submitted by ${formData.clientName}`,
        type: 'general',
        actionUrl: `/admin/marriage-proofs/${documentId}`,
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
    const loadingToast = toast.loading('Submitting marriage proof document...');

    try {
      // Submit marriage proof document
      const response = await axios.post(
        'http://localhost:8080/api/marriageproof/marriage-proof',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.dismiss(loadingToast);
      toast.success('Marriage proof document submitted successfully!');
      
      // Send admin notification
      await sendAdminNotification(response.data._id);

      // Reset form (keep client info)
      setFormData(prev => ({
        ...prev,
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
      }));

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit marriage proof document');
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
      title: "Spouses Information",
      fields: [
        { name: "spouse1Name", type: "text", required: true },
        { name: "spouse1DOB", type: "date", required: true },
        { name: "spouse1Address", type: "text", required: true },
        { name: "spouse1Occupation", type: "text", required: true },
        { name: "spouse2Name", type: "text", required: true },
        { name: "spouse2DOB", type: "date", required: true },
        { name: "spouse2Address", type: "text", required: true },
        { name: "spouse2Occupation", type: "text", required: true },
      ],
    },
    {
      title: "Marriage Details",
      fields: [
        { name: "marriageDate", type: "date", required: true },
        { name: "marriageLocation", type: "text", required: true },
        { name: "jurisdiction", type: "text", required: true },
      ],
    },
    {
      title: "Witnesses Information",
      fields: [
        { name: "witness1Name", type: "text", required: true },
        { name: "witness1Address", type: "text", required: true },
        { name: "witness1Signature", type: "text", required: false },
        { name: "witness2Name", type: "text", required: true },
        { name: "witness2Address", type: "text", required: true },
        { name: "witness2Signature", type: "text", required: false },
      ],
    },
    {
      title: "Notary Information",
      fields: [
        { name: "notarySignature", type: "text", required: false },
        { name: "notaryName", type: "text", required: true },
        { name: "notaryLicenseNumber", type: "text", required: true },
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

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Toaster position="top-right" />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Marriage Proof Document Form</h1>
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
                {isSubmitting ? 'Submitting...' : 'Submit Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarriageProofForm;