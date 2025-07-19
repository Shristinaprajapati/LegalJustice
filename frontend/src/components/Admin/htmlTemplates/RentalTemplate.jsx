import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import jsPDF from "jspdf";

const RentalAgreement = ({
  clientName,
  clientId,
  landlordName,
  tenantName,
  propertyAddress,
  rentalStartDate,
  rentalEndDate,
  monthlyRent,
  securityDeposit,
  leaseTerm,
  landlordSignature,
  tenantSignature,
  witnessSignature,
  notarySignature,
  landlordContact,
  tenantContact,
  propertyDescription,
  utilitiesIncluded,
  lateFeePolicy,
  maintenanceResponsibilities,
  petPolicy,
  terminationClause,
}) => {
  const editor = useRef(null);
  const title = "Rental Agreement";

  const template = `
<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
  }

  .container {
    width: 80%;
    margin: 50px auto;
    background-color: #ffffff;
    padding: 50px;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }

  h2, h3 {
    font-weight: bold;
    text-align: left;
    font-size: 18px;
    margin-bottom: 6px; /* Reducing space after headings */
  }

  p {
    text-align: left;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    margin-bottom: 6px; /* Adjusted to prevent large gaps */
  }

  b {
    line-height: 1;
  }

  /* Ensure proper spacing between paragraphs */
  p + p {
    margin-top: 6px;
  }
    h3 +p {
    margin-top: 6px;
  }
     h2 +p {
    margin-top: 8px;
  }
</style>

<div class="container">
  <h2>RENTAL AGREEMENT</h2>

  <p>This Rental Agreement ("Agreement") is entered into on <b>{rentalStartDate}</b>, by and between <b>{landlordName}</b>, hereinafter referred to as the "Landlord," and <b>{tenantName}</b>, hereinafter referred to as the "Tenant." The Landlord agrees to rent the property located at <b>{propertyAddress}</b> to the Tenant under the terms and conditions set forth in this Agreement.</p>

  <h3>1. Property Details</h3>
  <p><b>Property Address:</b> {propertyAddress}</p>
  <p><b>Property Description:</b> {propertyDescription}</p>
  <p><b>Utilities Included:</b> {utilitiesIncluded}</p>

  <h3>2. Lease Terms</h3>
  <p><b>Lease Term:</b> {leaseTerm}</p>
  <p><b>Rental Start Date:</b> {rentalStartDate}</p>
  <p><b>Rental End Date:</b> {rentalEndDate}</p>
  <p><b>Monthly Rent:</b> {monthlyRent}</p>
  <p><b>Security Deposit:</b> {securityDeposit}</p>

  <h3>3. Responsibilities</h3>
  <p><b>Maintenance Responsibilities:</b> {maintenanceResponsibilities}</p>
  <p><b>Late Fee Policy:</b> {lateFeePolicy}</p>
  <p><b>Pet Policy:</b> {petPolicy}</p>

  <h3>4. Termination Clause</h3>
  <p><b>Termination Clause:</b> {terminationClause}</p>

  <h3>5. Signatures</h3>
  <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the dates set forth below:</p>
  <br>
  <p><b>Landlord:</b> ______________________________ Signed on <b>{landlordSignature}</b></p>
  <br>
  <p><b>Tenant:</b> ______________________________ Signed on <b>{tenantSignature}</b></p>
  <br>
  <p><b>Witness:</b> ______________________________ Signed on <b>{witnessSignature}</b></p>
  <br>
  <p><b>Notary:</b> ______________________________ Signed on <b>{notarySignature}</b></p>
</div>
`;

  const filledAgreement = template
    .replaceAll("{clientName}", clientName ?? "____")
    .replaceAll("{clientId}", clientId ?? "____")
    .replaceAll("{landlordName}", landlordName ?? "____")
    .replaceAll("{tenantName}", tenantName ?? "____")
    .replaceAll("{propertyAddress}", propertyAddress ?? "____")
    .replaceAll("{rentalStartDate}", rentalStartDate ?? "____")
    .replaceAll("{rentalEndDate}", rentalEndDate ?? "____")
    .replaceAll("{monthlyRent}", monthlyRent ?? "____")
    .replaceAll("{securityDeposit}", securityDeposit ?? "____")
    .replaceAll("{leaseTerm}", leaseTerm ?? "____")
    .replaceAll("{landlordSignature}", landlordSignature ?? "____")
    .replaceAll("{tenantSignature}", tenantSignature ?? "____")
    .replaceAll("{witnessSignature}", witnessSignature ?? "____")
    .replaceAll("{notarySignature}", notarySignature ?? "____")
    .replaceAll("{landlordContact}", landlordContact ?? "____")
    .replaceAll("{tenantContact}", tenantContact ?? "____")
    .replaceAll("{propertyDescription}", propertyDescription ?? "____")
    .replaceAll("{utilitiesIncluded}", utilitiesIncluded ?? "____")
    .replaceAll("{lateFeePolicy}", lateFeePolicy ?? "____")
    .replaceAll("{maintenanceResponsibilities}", maintenanceResponsibilities ?? "____")
    .replaceAll("{petPolicy}", petPolicy ?? "____")
    .replaceAll("{terminationClause}", terminationClause ?? "____");

  // Handle save content
  const handleSaveContent = async () => {
    if (!editor.current) {
      alert("Editor is not initialized.");
      return;
    }

    const agreementHTML = editor.current.value; // Get full HTML content
    const agreementText = agreementHTML; // You can clean up the content if needed here

    // Check if all required fields are filled
    if (!clientId || !clientName || !title || !agreementText.trim()) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/document/save`,
        {
          clientId,
          clientName,
          title,
          agreementContent: agreementText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the request was successful
      if (response.status === 201) {
        alert("Document saved successfully!");
      } else if (response.status === 200) {
        alert("Document updated successfully!");
      } else {
        alert("Error saving document.");
      }
    } catch (error) {
      console.error("Error saving document:", error.response || error.message);
      alert("Error saving document.");
    }
  };

  return (
    <div
    style={{
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
    }}
  >
  
    {/* Editable Agreement Section */}
    <div
      style={{
        marginTop: "20px",
        borderRadius: "8px",
        marginLeft: "0px",
        maxWidth: "100rem",
      }}
    >
      <JoditEditor
        ref={editor}
        value={filledAgreement}
        config={{
          readonly: false,
          height: 800,
          width: "100%",
          toolbarSticky: false,
          iframe: false,
          style: false,
          defaultFontSizePoints: "12",
          defaultFont: "Arial",
        }}
      />
  
      {/* Action Buttons */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <button
          onClick={handleSaveContent}
          style={{
            padding: "12px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
  );
};

export default RentalAgreement;