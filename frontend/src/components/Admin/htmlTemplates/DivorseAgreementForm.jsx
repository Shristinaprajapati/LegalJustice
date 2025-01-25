import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      if (submitForm) {
        // Call the external submission handler if provided
        await submitForm(formData);
      } else {
        // Default form submission using Axios
        const response = await axios.post(
          'http://localhost:8080/api/divorse-agreement',
          formData
        );

        console.log('Success:', response.data.message);

        // Navigate to the template page and pass the clientId in state
        navigate('/divorce-agreement-template', { state: { clientId: formData.clientId } });
      }
    } catch (error) {
      console.error(
        'Error submitting form:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Divorce Agreement Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Render form fields dynamically */}
        {[
          'clientName',
          'clientId',
          'spouse1',
          'spouse2',
          'children',
          'propertyDivision',
          'alimony',
        ].map((field) => (
          <div key={field} style={{ marginBottom: '10px' }}>
            <label>
              {field
                .charAt(0)
                .toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1') + ':'}
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                style={{
                  marginLeft: '10px',
                  padding: '5px',
                  width: '300px',
                }}
              />
            </label>
          </div>
        ))}
        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DivorceAgreementForm;
