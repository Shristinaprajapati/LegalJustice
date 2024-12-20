import React, { useState } from "react";
import axios from "axios";

const DocumentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dateOfBirth: "",
    documentType: "template1", // Example for selecting a template
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/documents", formData);
      setSuccessMessage(response.data.message || "Document generated successfully!");
    } catch (err) {
      console.error(err.response?.data || "Error generating document");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
      </label>
      <label>
        Address:
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
      </label>
      <label>
        Date of Birth:
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
      </label>
      <label>
        Document Type:
        <select name="documentType" value={formData.documentType} onChange={handleInputChange}>
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
        </select>
      </label>
      <button type="submit">Generate Document</button>
      {successMessage && <p>{successMessage}</p>}
    </form>
  );
};

export default DocumentForm;
