import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../../Main/Header.jsx';
import Footer from '../../Footer.jsx';
import styles from './DivorceAgreementForm.module.css';
import { io } from 'socket.io-client';

const RentalAgreementForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: '67d3b7e6fd712ab1eddaf624',
    landlordName: '',
    tenantName: '',
    propertyAddress: '',
    rentalStartDate: '',
    rentalEndDate: '',
    monthlyRent: '',
    securityDeposit: '',
    leaseTerm: '',
    landlordSignature: '',
    tenantSignature: '',
    witnessSignature: '',
    notarySignature: '',
    landlordContact: '',
    tenantContact: '',
    propertyDescription: '',
    utilitiesIncluded: '',
    lateFeePolicy: '',
    maintenanceResponsibilities: '',
    petPolicy: '',
    terminationClause: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);
    // Initialize socket connection
    useEffect(() => {
      const newSocket = io('http://localhost:8080'); // Connect to your backend
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

  const isValidDate = (date) => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  };

  const isValidNumber = (value) => {
    return !isNaN(value) && value !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const requiredFields = [
      'clientName', 'clientId', 'landlordName', 'tenantName', 
      'propertyAddress', 'rentalStartDate', 'rentalEndDate',
      'monthlyRent', 'securityDeposit', 'leaseTerm'
    ];
  
    const missingFields = requiredFields.filter(field => !formData[field]);
  
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map(f => formatLabel(f)).join(', ')}`);
      setIsSubmitting(false);
      return;
    }
  
    if (!isValidDate(formData.rentalStartDate)) {
      toast.error('Please enter a valid rental start date');
      setIsSubmitting(false);
      return;
    }
  
    if (!isValidDate(formData.rentalEndDate)) {
      toast.error('Please enter a valid rental end date');
      setIsSubmitting(false);
      return;
    }
  
    if (!isValidNumber(formData.monthlyRent)) {
      toast.error('Please enter a valid monthly rent amount');
      setIsSubmitting(false);
      return;
    }
  
    if (!isValidNumber(formData.securityDeposit)) {
      toast.error('Please enter a valid security deposit amount');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/rental/rental-agreement',
        {
          ...formData,
          monthlyRent: Number(formData.monthlyRent),
          securityDeposit: Number(formData.securityDeposit)
        }
      );
  
      toast.success('Rental agreement submitted successfully!');
  
// After successful form submission
const adminNotificationPayload = {
  recipientId: '674952ba89c4cfb98008666d', // Admin ID
  clientId: formData.clientId,
  clientName: formData.clientName,
  title: 'Rental Agreement',
  message: `Rental agreement submitted by ${formData.clientName} (ID: ${formData.clientId})`,
  type: 'rental_agreement'
};

// Save the notification to the database
await axios.post('http://localhost:8080/api/admin/notifications/admin', adminNotificationPayload);

// Emit socket event after saving to DB
if (socket) {
  socket.emit('sendAdminNotification', adminNotificationPayload);
  console.log('✅ Notification saved and emitted to admin via socket');
}

  
      // Reset form except for client info and serviceId
      setFormData(prev => ({
        ...prev,
        landlordName: '',
        tenantName: '',
        propertyAddress: '',
        rentalStartDate: '',
        rentalEndDate: '',
        monthlyRent: '',
        securityDeposit: '',
        leaseTerm: '',
        landlordSignature: '',
        tenantSignature: '',
        witnessSignature: '',
        notarySignature: '',
        landlordContact: '',
        tenantContact: '',
        propertyDescription: '',
        utilitiesIncluded: '',
        lateFeePolicy: '',
        maintenanceResponsibilities: '',
        petPolicy: '',
        terminationClause: '',
      }));
  
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rental agreement');
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
        { name: "landlordName", type: "text", required: true },
        { name: "landlordContact", type: "text", required: false },
        { name: "tenantName", type: "text", required: true },
        { name: "tenantContact", type: "text", required: false },
      ],
    },
    {
      title: "Property Details",
      fields: [
        { name: "propertyAddress", type: "text", required: true },
        { name: "propertyDescription", type: "text", required: false },
      ],
    },
    {
      title: "Rental Terms",
      fields: [
        { name: "rentalStartDate", type: "date", required: true },
        { name: "rentalEndDate", type: "date", required: true },
        { name: "monthlyRent", type: "number", required: true },
        { name: "securityDeposit", type: "number", required: true },
        { name: "leaseTerm", type: "text", required: true },
      ],
    },
    {
      title: "Policies (Optional)",
      fields: [
        { name: "utilitiesIncluded", type: "text", required: false },
        { name: "lateFeePolicy", type: "text", required: false },
        { name: "maintenanceResponsibilities", type: "text", required: false },
        { name: "petPolicy", type: "text", required: false },
        { name: "terminationClause", type: "text", required: false },
      ],
    },
    {
      title: "Signatures (Optional)",
      fields: [
        { name: "landlordSignature", type: "text", required: false },
        { name: "tenantSignature", type: "text", required: false },
        { name: "witnessSignature", type: "text", required: false },
        { name: "notarySignature", type: "text", required: false },
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
          <h1 className={styles.heading}>Rental Agreement Form</h1>
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
                        min={field.type === 'number' ? '0' : undefined}
                        step={field.type === 'number' ? '0.01' : undefined}
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

export default RentalAgreementForm;