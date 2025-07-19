import React, { useState } from 'react';
import axios from 'axios';

const DivorceAgreementForm = () => {
  const [spouse1, setSpouse1] = useState('');
  const [spouse2, setSpouse2] = useState('');
  const [children, setChildren] = useState('');
  const [propertyDivision, setPropertyDivision] = useState('');
  const [alimony, setAlimony] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/divorseagreement/generate-divorce-agreement`, {
        spouse1,
        spouse2,
        children,
        propertyDivision,
        alimony,
      });
  
      setDocumentUrl(response.data.documentUrl);
      setLoading(false);
      alert('Divorce Agreement generated successfully!');
    } catch (error) {
      console.error('Error generating agreement:', error);
      setLoading(false);
      alert('Failed to generate Divorce Agreement');
    }
  };
  

  return (
    <div>
      <h2>Divorce Agreement Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Spouse 1 Name:</label>
          <input
            type="text"
            value={spouse1}
            onChange={(e) => setSpouse1(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Spouse 2 Name:</label>
          <input
            type="text"
            value={spouse2}
            onChange={(e) => setSpouse2(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Children's Names:</label>
          <input
            type="text"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Property Division Details:</label>
          <input
            type="text"
            value={propertyDivision}
            onChange={(e) => setPropertyDivision(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Alimony Details:</label>
          <input
            type="text"
            value={alimony}
            onChange={(e) => setAlimony(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Agreement'}
        </button>
      </form>

      {documentUrl && (
        <div>
          <h3>Your Divorce Agreement</h3>
          <p>
            The document has been generated successfully. You can download it from the following link:
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">Download Document</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default DivorceAgreementForm;
