import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

const PartnershipAgreement = ({
  clientName, 
  clientId, 
  partner1Name,
  partner2Name,
  businessName,
  businessPurpose,
  businessAddress,
  capitalContribution1,
  capitalContribution2,
  profitSharingRatio,
  decisionMaking,
  disputeResolution,
  agreementStartDate,
  agreementEndDate,
  jurisdiction,
  partner1SignatureDate,
  partner2SignatureDate,
  witnessSignatureDate,
  notarySignatureDate,
}) => {
  const editor = useRef(null);
  const title = "Partnership Agreement";

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
    <h2>PARTNERSHIP AGREEMENT</h2>
    
    <p>This Partnership Agreement ("Agreement") is entered into on <b>{agreementStartDate}</b>, by and between <b>{partner1Name}</b>, hereinafter referred to as "Partner 1," and <b>{partner2Name}</b>, hereinafter referred to as "Partner 2," collectively referred to as the "Partners." The Partners desire to establish a business partnership under the terms and conditions set forth in this Agreement, for the purpose of engaging in business operations and conducting activities under the name of <b>{businessName}</b>.</p>

    <h3>1. Business Details</h3>
    <p><b>Business Name:</b> {businessName}</p>
    <p><b>Business Purpose:</b> {businessPurpose} The business will be conducted primarily in the field of <b>{businessPurpose}</b>, and will serve clients within the target market of <b>{businessPurpose}</b>. The goal of the business is to provide high-quality services/products to our customers and maintain sustainable growth.</p>
    <p><b>Business Address:</b> {businessAddress} The business operations will be based at the address listed above, and all meetings, communications, and administrative work will be conducted from this location unless otherwise agreed upon by both parties.</p>
    
    <h3>2. Capital Contributions</h3>
    <p><b>{partner1Name}:</b> {capitalContribution1} Partner 1 agrees to contribute the capital amount of <b>{capitalContribution1}</b> in cash or equivalent assets, which will be used for initial operational costs, inventory, or any other business requirement deemed necessary by the Partners.</p>
    <p><b>{partner2Name}:</b> {capitalContribution2} Partner 2 agrees to contribute the capital amount of <b>{capitalContribution2}</b> in cash or equivalent assets. The contribution will be utilized for similar purposes as Partner 1’s contribution, ensuring the business’s initial growth and continued operations.</p>
    
    <h3>3. Profit and Loss Distribution</h3>
    <p>The Partners shall share profits and losses in accordance with the agreed-upon ratio of <b>{profitSharingRatio}</b>, which reflects the proportional contributions and roles each Partner plays in the business. This distribution will be reviewed annually to ensure fairness and adjustment in line with any changes in the business structure or contributions.</p>
    
    <h3>4. Management and Decision-Making</h3>
    <p>Decisions regarding the business operations, management structure, and major business activities shall be determined as follows: <b>{decisionMaking}</b>. Both Partners shall be equally responsible for making decisions regarding day-to-day business operations, hiring employees, and managing finances, with major decisions requiring mutual agreement or consultation.</p>
    
    <h3>5. Dispute Resolution</h3>
    <p>In the event of any disputes arising under this Agreement, the Partners agree to resolve the conflict through the following methods: <b>{disputeResolution}</b>. The Partners shall first attempt to resolve any issues through informal discussions. If resolution is not achieved, they will proceed with formal mediation or arbitration under the laws of <b>{jurisdiction}</b>.</p>
    
    <h3>6. Duration</h3>
    <p>This Agreement shall commence on <b>{agreementStartDate}</b> and shall continue until <b>{agreementEndDate}</b>, unless terminated earlier by mutual agreement or due to unforeseen events as specified under the terms of the Agreement. In the case of early termination, the Partners agree to settle any remaining business obligations and liabilities in a manner that is equitable to both parties.</p>
    
    <h3>7. Jurisdiction</h3>
    <p>This Agreement shall be governed by the laws of <b>{jurisdiction}</b>, which shall have exclusive jurisdiction over any legal disputes or claims arising from this Agreement. Both Partners agree that any litigation related to this Agreement will be brought in the courts located in <b>{jurisdiction}</b>.</p>
    
    <h3>8. Signatures</h3>
    <p>IN WITNESS WHEREOF, the Partners have executed this Agreement as of the dates set forth below:</p>
    <br>
    <p><b>{partner1Name}:______________________________</b> Signed on <b>{partner1SignatureDate}</b></p>
    <br>
    <p><b>{partner2Name}:______________________________</b> Signed on <b>{partner2SignatureDate}</b></p>
    <br>
    <p><b>Witness:</b> ______________________________Signed on <b>{witnessSignatureDate}</b></p>
    <br>
    <p><b>Notary:</b> ______________________________Signed on <b>{notarySignatureDate}</b></p>

    </div>
  `;
  


  const filledAgreement = template
    .replaceAll("{partner1Name}", partner1Name ?? "____")
    .replaceAll("{partner2Name}", partner2Name ?? "____")
    .replaceAll("{businessName}", businessName ?? "____")
    .replaceAll("{businessPurpose}", businessPurpose ?? "____")
    .replaceAll("{businessAddress}", businessAddress ?? "____")
    .replaceAll("{capitalContribution1}", capitalContribution1 ?? "____")
    .replaceAll("{capitalContribution2}", capitalContribution2 ?? "____")
    .replaceAll("{profitSharingRatio}", profitSharingRatio ?? "____")
    .replaceAll("{decisionMaking}", decisionMaking ?? "____")
    .replaceAll("{disputeResolution}", disputeResolution ?? "____")
    .replaceAll("{agreementStartDate}", agreementStartDate ?? "____")
    .replaceAll("{agreementEndDate}", agreementEndDate ?? "____")
    .replaceAll("{jurisdiction}", jurisdiction ?? "____")
    .replaceAll("{partner1SignatureDate}", partner1SignatureDate ?? "____")
    .replaceAll("{partner2SignatureDate}", partner2SignatureDate ?? "____")
    .replaceAll("{witnessSignatureDate}", witnessSignatureDate ?? "____")
    .replaceAll("{notarySignatureDate}", notarySignatureDate ?? "____");


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
    const response = await axios.post("http://localhost:8080/api/document/save", {
      clientId,
      clientName,
      title,
      agreementContent: agreementText,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the request was successful
    if (response.status === 201) {
      alert("Document saved successfully!");
    } else if (response.status === 200) {
      alert("Document updated successfully!");
    } else {
      alert("Error saving document..");
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

export default PartnershipAgreement;
