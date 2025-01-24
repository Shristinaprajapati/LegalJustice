import React, { useState } from 'react';
import axios from 'axios';

const ClientForm = () => {
  const [formData, setFormData] = useState({
    agreementDate: '',
    disclosingParty: '',
    receivingParty: '',
    effectiveDate: '',
    expirationDate: '',
    disclosingPartySignature: '',
    receivingPartySignature: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/documents", formData);
      // Assuming backend returns the generated HTML document
      console.log(response.data.document);
      alert('Document generated successfully!');
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        name="agreementDate"
        value={formData.agreementDate}
        onChange={handleChange}
        placeholder="Agreement Date"
      />
      <input
        type="text"
        name="disclosingParty"
        value={formData.disclosingParty}
        onChange={handleChange}
        placeholder="Disclosing Party"
      />
      <input
        type="text"
        name="receivingParty"
        value={formData.receivingParty}
        onChange={handleChange}
        placeholder="Receiving Party"
      />
      <input
        type="date"
        name="effectiveDate"
        value={formData.effectiveDate}
        onChange={handleChange}
        placeholder="Effective Date"
      />
      <input
        type="date"
        name="expirationDate"
        value={formData.expirationDate}
        onChange={handleChange}
        placeholder="Expiration Date"
      />
      <input
        type="text"
        name="disclosingPartySignature"
        value={formData.disclosingPartySignature}
        onChange={handleChange}
        placeholder="Disclosing Party Signature"
      />
      <input
        type="text"
        name="receivingPartySignature"
        value={formData.receivingPartySignature}
        onChange={handleChange}
        placeholder="Receiving Party Signature"
      />
      <button type="submit">Generate Document</button>
    </form>
  );
};

export default ClientForm;
