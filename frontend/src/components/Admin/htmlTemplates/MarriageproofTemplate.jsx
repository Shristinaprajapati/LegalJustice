import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

const MarriageProofDocument = ({
  clientName,
  clientId,
  spouse1Name,
  spouse2Name,
  marriageDate,
  marriageLocation,
  spouse1DOB,
  spouse2DOB,
  spouse1Address,
  spouse2Address,
  spouse1Occupation,
  spouse2Occupation,
  witness1Name,
  witness2Name,
  witness1Address,
  witness2Address,
  witness1Signature,
  witness2Signature,
  notarySignature,
  notaryName,
  notaryLicenseNumber,
  jurisdiction,
}) => {
  const editor = useRef(null);
  const title = "Marriage Proof Document";

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
  <h2>MARRIAGE PROOF DOCUMENT</h2>

  <p>This Marriage Proof Document is issued on <b>{marriageDate}</b>, certifying the marriage between <b>{spouse1Name}</b> and <b>{spouse2Name}</b>, hereinafter referred to as the "Spouses." The marriage was solemnized at <b>{marriageLocation}</b> on <b>{marriageDate}</b>.</p>

  <h3>1. Spouse Details</h3>
  <p><b>Spouse 1 Name:</b> {spouse1Name}</p>
  <p><b>Spouse 1 Date of Birth:</b> {spouse1DOB}</p>
  <p><b>Spouse 1 Address:</b> {spouse1Address}</p>
  <p><b>Spouse 1 Occupation:</b> {spouse1Occupation}</p>
  <p><b>Spouse 2 Name:</b> {spouse2Name}</p>
  <p><b>Spouse 2 Date of Birth:</b> {spouse2DOB}</p>
  <p><b>Spouse 2 Address:</b> {spouse2Address}</p>
  <p><b>Spouse 2 Occupation:</b> {spouse2Occupation}</p>

  <h3>2. Witness Details</h3>
  <p><b>Witness 1 Name:</b> {witness1Name}</p>
  <p><b>Witness 1 Address:</b> {witness1Address}</p>
  <p><b>Witness 2 Name:</b> {witness2Name}</p>
  <p><b>Witness 2 Address:</b> {witness2Address}</p>

  <h3>3. Notary Details</h3>
  <p><b>Notary Name:</b> {notaryName}</p>
  <p><b>Notary License Number:</b> {notaryLicenseNumber}</p>
  <p><b>Jurisdiction:</b> {jurisdiction}</p>

  <h3>4. Signatures</h3>
  <p>IN WITNESS WHEREOF, the parties have executed this Document as of the dates set forth below:</p>
  <br>
  <p><b>Spouse 1:</b> ______________________________ Signed on <b>{marriageDate}</b></p>
  <br>
  <p><b>Spouse 2:</b> ______________________________ Signed on <b>{marriageDate}</b></p>
  <br>
  <p><b>Witness 1:</b> ______________________________ Signed on <b>{marriageDate}</b></p>
  <br>
  <p><b>Witness 2:</b> ______________________________ Signed on <b>{marriageDate}</b></p>
  <br>
  <p><b>Notary:</b> ______________________________ Signed on <b>{marriageDate}</b></p>
</div>
`;

  const filledAgreement = template
    .replaceAll("{clientName}", clientName ?? "____")
    .replaceAll("{clientId}", clientId ?? "____")
    .replaceAll("{spouse1Name}", spouse1Name ?? "____")
    .replaceAll("{spouse2Name}", spouse2Name ?? "____")
    .replaceAll("{marriageDate}", marriageDate ?? "____")
    .replaceAll("{marriageLocation}", marriageLocation ?? "____")
    .replaceAll("{spouse1DOB}", spouse1DOB ?? "____")
    .replaceAll("{spouse2DOB}", spouse2DOB ?? "____")
    .replaceAll("{spouse1Address}", spouse1Address ?? "____")
    .replaceAll("{spouse2Address}", spouse2Address ?? "____")
    .replaceAll("{spouse1Occupation}", spouse1Occupation ?? "____")
    .replaceAll("{spouse2Occupation}", spouse2Occupation ?? "____")
    .replaceAll("{witness1Name}", witness1Name ?? "____")
    .replaceAll("{witness2Name}", witness2Name ?? "____")
    .replaceAll("{witness1Address}", witness1Address ?? "____")
    .replaceAll("{witness2Address}", witness2Address ?? "____")
    .replaceAll("{witness1Signature}", witness1Signature ?? "____")
    .replaceAll("{witness2Signature}", witness2Signature ?? "____")
    .replaceAll("{notarySignature}", notarySignature ?? "____")
    .replaceAll("{notaryName}", notaryName ?? "____")
    .replaceAll("{notaryLicenseNumber}", notaryLicenseNumber ?? "____")
    .replaceAll("{jurisdiction}", jurisdiction ?? "____");

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

export default MarriageProofDocument;