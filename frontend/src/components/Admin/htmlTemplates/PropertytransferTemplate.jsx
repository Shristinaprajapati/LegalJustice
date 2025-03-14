import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

const PropertyTransferAgreement = ({
  clientName,
  clientId,
  transferorName,
  transfereeName,
  propertyAddress,
  propertyDescription,
  transferDate,
  considerationAmount,
  paymentTerms,
  transferorSignatureDate,
  transfereeSignatureDate,
  witnessSignatureDate,
  notarySignatureDate,
  jurisdiction,
  additionalTerms,
}) => {
  const editor = useRef(null);
  const title = "Property Transfer Agreement";

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
  <h2>PROPERTY TRANSFER AGREEMENT</h2>

  <p>This Property Transfer Agreement ("Agreement") is entered into on <b>{transferDate}</b>, by and between <b>{transferorName}</b>, hereinafter referred to as the "Transferor," and <b>{transfereeName}</b>, hereinafter referred to as the "Transferee." The Transferor agrees to transfer ownership of the property described below to the Transferee under the terms and conditions set forth in this Agreement.</p>

  <h3>1. Property Details</h3>
  <p><b>Property Address:</b> {propertyAddress}</p>
  <p><b>Property Description:</b> {propertyDescription}</p>

  <h3>2. Consideration</h3>
  <p>The Transferee agrees to pay the Transferor the sum of <b>{considerationAmount}</b> as consideration for the transfer of the property. The payment terms are as follows: <b>{paymentTerms}</b>.</p>

  <h3>3. Transfer of Ownership</h3>
  <p>The Transferor agrees to transfer ownership of the property to the Transferee on <b>{transferDate}</b>. The Transferor warrants that they have full legal authority to transfer the property and that the property is free from any liens or encumbrances, except as disclosed in this Agreement.</p>

  <h3>4. Additional Terms</h3>
  <p>{additionalTerms || "No additional terms apply."}</p>

  <h3>5. Jurisdiction</h3>
  <p>This Agreement shall be governed by and construed in accordance with the laws of <b>{jurisdiction}</b>. Any disputes arising under this Agreement shall be resolved in the courts of <b>{jurisdiction}</b>.</p>

  <h3>6. Signatures</h3>
  <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the dates set forth below:</p>
  <br>
  <p><b>{transferorName}:______________________________</b> Signed on <b>{transferorSignatureDate}</b></p>
  <br>
  <p><b>{transfereeName}:______________________________</b> Signed on <b>{transfereeSignatureDate}</b></p>
  <br>
  <p><b>Witness:</b> ______________________________Signed on <b>{witnessSignatureDate}</b></p>
  <br>
  <p><b>Notary:</b> ______________________________Signed on <b>{notarySignatureDate}</b></p>
</div>
`;

  const filledAgreement = template
    .replaceAll("{clientName}", clientName ?? "____")
    .replaceAll("{clientId}", clientId ?? "____")
    .replaceAll("{transferorName}", transferorName ?? "____")
    .replaceAll("{transfereeName}", transfereeName ?? "____")
    .replaceAll("{propertyAddress}", propertyAddress ?? "____")
    .replaceAll("{propertyDescription}", propertyDescription ?? "____")
    .replaceAll("{transferDate}", transferDate ?? "____")
    .replaceAll("{considerationAmount}", considerationAmount ?? "____")
    .replaceAll("{paymentTerms}", paymentTerms ?? "____")
    .replaceAll("{transferorSignatureDate}", transferorSignatureDate ?? "____")
    .replaceAll("{transfereeSignatureDate}", transfereeSignatureDate ?? "____")
    .replaceAll("{witnessSignatureDate}", witnessSignatureDate ?? "____")
    .replaceAll("{notarySignatureDate}", notarySignatureDate ?? "____")
    .replaceAll("{jurisdiction}", jurisdiction ?? "____")
    .replaceAll("{additionalTerms}", additionalTerms ?? "____");

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
        "http://localhost:8080/api/document/save",
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
    <div>
      {/* Display Editable Agreement */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          marginLeft: "250px",
        }}
      >
        <JoditEditor
          ref={editor}
          value={filledAgreement}
          config={{
            readonly: false, // Allow editing
            height: 500,
            toolbarSticky: false,
            iframe: false, // Use direct content without iframe isolation
            style: false, // Allow inline styles
            defaultFontSizePoints: "12",
            defaultFont: "Arial",
          }}
        />

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={handleSaveContent}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyTransferAgreement;