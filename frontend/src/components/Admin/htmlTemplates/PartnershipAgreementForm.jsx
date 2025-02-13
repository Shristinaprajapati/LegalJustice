import React, { useState } from "react";

const PartnershipAgreementForm = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/partnership-agreement/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Agreement submitted successfully!");
        setFormData({
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
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting agreement:", error);
    }
  };

  return (
    <div>
      <h2>Partnership Agreement Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label>
              {field.replace(/([A-Z])/g, " $1").trim()}:
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PartnershipAgreementForm;
