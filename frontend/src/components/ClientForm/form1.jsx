import React, { useState } from "react";
import axios from "axios";

const LegalForm = () => {
  const [formData, setFormData] = useState({
    partyA: "",
    partyB: "",
    date: "",
    terms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/submitForm", formData);
      alert("Form submitted successfully.");
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    }
  };

  return (
    <div className="legal-form-container">
      <h1>Fill Out the Legal Document</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="partyA">Party A:</label>
          <input
            type="text"
            id="partyA"
            name="partyA"
            value={formData.partyA}
            onChange={handleChange}
            placeholder="Enter Party A Name"
            required
          />
        </div>
        <div>
          <label htmlFor="partyB">Party B:</label>
          <input
            type="text"
            id="partyB"
            name="partyB"
            value={formData.partyB}
            onChange={handleChange}
            placeholder="Enter Party B Name"
            required
          />
        </div>
        <div>
          <label htmlFor="date">Effective Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="terms">Terms:</label>
          <textarea
            id="terms"
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            placeholder="Enter the terms of the contract"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LegalForm;
