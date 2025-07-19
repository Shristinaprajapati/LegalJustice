import React, { useState, useEffect } from "react";
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import Header from '../../Main/Header.jsx';
import Footer from '../../Footer.jsx';
import styles from './DivorceAgreementForm.module.css';
import { io } from 'socket.io-client';

const PartnershipAgreementForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientId: "",
    serviceId: "67a84aa53c49df8a5b9ca1df", // Default service ID
    partner1Name: "",
    partner2Name: "",
    businessName: "",
    businessPurpose: "",
    businessAddress: "",
    capitalContribution1: "",
    capitalContribution2: "",
    profitSharingRatio: "",
    decisionMaking: "",
    disputeResolution: "",
    agreementStartDate: "",
    agreementEndDate: "",
    jurisdiction: "",
    partner1SignatureDate: "",
    partner2SignatureDate: "",
    witnessSignatureDate: "",
    notarySignatureDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_BASE_URL}`); 
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

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/me`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Validate required fields
    const requiredFields = [
      'clientName', 'clientId', 'partner1Name', 'partner2Name',
      'businessName', 'businessPurpose', 'businessAddress'
    ];
  
    const missingFields = requiredFields.filter(field => !formData[field]);
  
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map(f => formatLabel(f)).join(', ')}`);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/partnership-agreement`,
        formData
      );
      
      toast.success('Submitted successfully!');
      
      // After successful form submission
      const adminNotificationPayload = {
        recipientId: '674952ba89c4cfb98008666d', // Admin ID - must be valid ObjectId
        clientId: formData.clientId, // Must be valid ObjectId
        clientName: formData.clientName,
        title: 'Partnership Agreement',
        message: `Partnership agreement submitted by ${formData.clientName} (ID: ${formData.clientId})`,
        type: 'general', // Changed from 'partnership_agreement' to match your enum
        read: false,
        actionUrl: `/admin/partnership-agreements/${response.data._id}` // Optional but useful
      };
  
      try {
        // Save the notification to the database with auth header
        const notificationResponse = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/admin/notifications/admin`, 
          adminNotificationPayload,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Notification saved:', notificationResponse.data);
  
        // Emit socket event after saving to DB
        if (socket) {
          socket.emit('sendAdminNotification', notificationResponse.data);
          console.log('✅ Notification emitted to admin via socket');
        }
      } catch (notificationError) {
        console.error('Failed to save notification:', notificationError.response?.data || notificationError.message);
        // Don't show error to user as this is a background process
      }
      
      // Reset form except for client info and serviceId
      setFormData(prev => ({
        clientName: prev.clientName,
        clientId: prev.clientId,
        serviceId: prev.serviceId,
        partner1Name: "",
        partner2Name: "",
        businessName: "",
        businessPurpose: "",
        businessAddress: "",
        capitalContribution1: "",
        capitalContribution2: "",
        profitSharingRatio: "",
        decisionMaking: "",
        disputeResolution: "",
        agreementStartDate: "",
        agreementEndDate: "",
        jurisdiction: "",
        partner1SignatureDate: "",
        partner2SignatureDate: "",
        witnessSignatureDate: "",
        notarySignatureDate: "",
      }));
  
    } catch (error) {
      console.error('Error submitting agreement:', error);
      toast.error(error.response?.data?.message || 'Failed to submit agreement');
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
      title: "Partners Information",
      fields: [
        { name: "partner1Name", type: "text", required: true },
        { name: "partner2Name", type: "text", required: true },
      ],
    },
    {
      title: "Business Details",
      fields: [
        { name: "businessName", type: "text", required: true },
        { name: "businessPurpose", type: "text", required: true },
        { name: "businessAddress", type: "text", required: true },
      ],
    },
    {
      title: "Financial Terms (Optional)",
      fields: [
        { name: "capitalContribution1", type: "text", required: false },
        { name: "capitalContribution2", type: "text", required: false },
        { name: "profitSharingRatio", type: "text", required: false },
      ],
    },
    {
      title: "Operational Terms (Optional)",
      fields: [
        { name: "decisionMaking", type: "text", required: false },
        { name: "disputeResolution", type: "text", required: false },
      ],
    },
    {
      title: "Agreement Dates (Optional)",
      fields: [
        { name: "agreementStartDate", type: "date", required: false },
        { name: "agreementEndDate", type: "date", required: false },
      ],
    },
    {
      title: "Legal Information (Optional)",
      fields: [
        { name: "jurisdiction", type: "text", required: false },
      ],
    },
    {
      title: "Signatures (Optional)",
      fields: [
        { name: "partner1SignatureDate", type: "date", required: false },
        { name: "partner2SignatureDate", type: "date", required: false },
        { name: "witnessSignatureDate", type: "date", required: false },
        { name: "notarySignatureDate", type: "date", required: false },
      ],
    },
  ];

  const formatLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Toaster position="top-right" />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Partnership Agreement Form</h1>
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

export default PartnershipAgreementForm;