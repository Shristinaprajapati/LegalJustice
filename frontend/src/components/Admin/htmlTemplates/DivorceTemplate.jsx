import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const DivorceAgreement = ({ 
  clientName, 
  clientId, 
  spouse1, 
  spouse2, 
  children, 
  propertyDivision, 
  alimony,
  spouse1Address,
  spouse2Address,
  marriageDate,
  marriageLocation,
  child1Name,
  child1DOB,
  child2Name,
  child2DOB,
  custodyArrangement,
  visitationSchedule,
  childSupport,
  realPropertyDivision,
  vehicleDivision,
  bankAccountDivision,
  retirementAccountDivision,
  personalPropertyDivision,
  alimonyAmount,
  alimonyDuration,
  alimonyStartDate,
  spouse1Name,
  spouse1Debts,
  spouse2Name,
  spouse2Debts,
  jurisdiction,
  spouse1SignatureDate,
  spouse2SignatureDate,
  witnessSignatureDate,
  notarySignatureDate
}) => {
  const editor = useRef(null);

  // Template for the divorce agreement
  const agreementTemplate = `
  <style>
    body {
      font-family: 'Arial', sans-serif;
      font-size: 12px;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .container {
      width: 80%;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    }

    h1, h2, h3 {
      font-size: 18px;
      text-align: center;
      font-weight: bold;
      margin: 10px 0;
    }

    h3 {
      font-size: 16px;
      margin-top: 20px;
    }

    p {
      font-size: 14px;
      text-align: left;
      margin: 10px 0;
      padding-left: 10px;
      padding-right: 10px;
    }

    strong {
      font-weight: bold;
    }

    ul {
      margin-left: 20px;
    }

    li {
      font-size: 14px;
    }

    .signature-section {
      margin-top: 40px;
    }

    .signature-section p {
      text-align: left;
      margin: 0;
      padding-left: 0;
    }

    .signature-section span {
      display: inline-block;
      margin-right: 50px;
      margin-bottom: 20px;
    }

    .line {
      border-top: 1px solid #000;
      width: 200px;
    }

    .footer {
      font-size: 10px;
      text-align: center;
      margin-top: 40px;
      color: #777;
    }

  </style>

  <div class="container">
    <h1>Divorce Agreement</h1>

    <p>This Divorce Agreement ("Agreement") is entered into on this <strong>{date}</strong> by and between:</p>

    <p><strong>{spouse1}</strong>, residing at <strong>{spouse1Address}</strong> ("Spouse 1"), and</p>
    <p><strong>{spouse2}</strong>, residing at <strong>{spouse2Address}</strong> ("Spouse 2").</p>

    <p>Collectively referred to as the "Parties."</p>

    <p><strong>Recitals</strong><br>
      WHEREAS, the Parties were married on <strong>{marriageDate}</strong>, in <strong>{marriageLocation}</strong>, and<br>
      WHEREAS, the Parties have mutually agreed to end their marriage and wish to settle all matters arising from their divorce in accordance with the terms set forth in this Agreement.</p>

    <h3>1. Divorce and Separation</h3>
    <p>The Parties agree to file for divorce in the appropriate jurisdiction and acknowledge that the marriage has irretrievably broken down, making it impossible for the Parties to continue living together as spouses.</p>

    <h3>2. Children</h3>
    <p>The Parties confirm that they have the following children from their marriage:</p>
    <ul>
      <li><strong>{child1Name}</strong>, born on <strong>{child1DOB}</strong></li>
      <li><strong>{child2Name}</strong>, born on <strong>{child2DOB}</strong></li>
      <!-- Add more children as needed -->
    </ul>
    <p>Both Parties agree to share custody of the children in the following manner:</p>
    <ul>
      <li><strong>Primary Custody:</strong> {custodyArrangement}</li>
      <li><strong>Visitation Rights:</strong> {visitationSchedule}</li>
      <li><strong>Child Support:</strong> {childSupport}</li>
    </ul>
    <p>The Parties will cooperate in ensuring that the children’s best interests are prioritized and will make all decisions regarding the children's welfare jointly unless stated otherwise.</p>

    <h3>3. Property Division</h3>
    <p>The Parties agree to the division of their property as follows:</p>
    <ul>
      <li><strong>Real Property:</strong> {realPropertyDivision}</li>
      <li><strong>Vehicles:</strong> {vehicleDivision}</li>
      <li><strong>Bank Accounts:</strong> {bankAccountDivision}</li>
      <li><strong>Retirement Accounts:</strong> {retirementAccountDivision}</li>
      <li><strong>Personal Property:</strong> {personalPropertyDivision}</li>
      <!-- Add more properties as necessary -->
    </ul>

    <p>The Parties agree that any remaining property not specifically mentioned will be divided according to the laws of the jurisdiction in which the divorce is finalized.</p>

    <h3>4. Alimony</h3>
    <p>The Parties agree that Spouse 1 will pay alimony to Spouse 2 in the amount of <strong>{alimonyAmount}</strong> per month for a duration of <strong>{alimonyDuration}</strong>, beginning on <strong>{alimonyStartDate}</strong>.</p>

    <p>If there is a change in the financial situation of either Party, the alimony amount may be reviewed and adjusted as necessary by the court.</p>

    <h3>5. Debts</h3>
    <p>The Parties agree that the following debts will be assumed by each Party:</p>
    <ul>
      <li><strong>{spouse1Name}</strong> will assume responsibility for the following debts: {spouse1Debts}</li>
      <li><strong>{spouse2Name}</strong> will assume responsibility for the following debts: {spouse2Debts}</li>
    </ul>

    <h3>6. Legal Fees</h3>
    <p>The Parties agree that each Party will be responsible for their own legal fees incurred in the course of this divorce proceeding, unless otherwise agreed by both Parties.</p>

    <h3>7. Waiver of Claims</h3>
    <p>Both Parties waive any further claims or rights to each other’s property, income, or benefits, except as specifically provided for in this Agreement. This waiver includes any claims related to the marriage and its dissolution, except for matters regarding children and alimony.</p>

    <h3>8. Confidentiality</h3>
    <p>Both Parties agree that the terms of this Agreement are confidential and will not be disclosed to third parties, except as required by law or in any necessary proceedings.</p>

    <h3>9. Governing Law</h3>
    <p>This Agreement will be governed by and construed in accordance with the laws of the jurisdiction of <strong>{jurisdiction}</strong>.</p>

    <h3>10. Miscellaneous</h3>
    <p>In the event of a dispute arising from the interpretation or enforcement of this Agreement, the Parties agree to seek mediation before resorting to litigation. The Parties may modify this Agreement only in writing, signed by both Parties.</p>

    <h3>11. Finality of Agreement</h3>
    <p>This Agreement is binding upon the Parties as of the date of execution. The Parties understand that they have had an opportunity to seek independent legal counsel before signing this Agreement and have entered into it voluntarily and without coercion.</p>

    <div class="signature-section">
      <p><strong>Signed:</strong></p>
      <span><strong>{spouse1}</strong> — Signature: <span class="line"></span> Date: {spouse1SignatureDate}</span>
      <span><strong>{spouse2}</strong> — Signature: <span class="line"></span> Date: {spouse2SignatureDate}</span>
    </div>

    <div class="signature-section">
      <p><strong>Witness:</strong></p>
      <span>Name: _______________________  Signature: _______________________  Date: {witnessSignatureDate}</span>
    </div>

    <div class="signature-section">
      <p><strong>Notary Public:</strong></p>
      <span>Name: _______________________  Signature: _______________________  Date: {notarySignatureDate}</span>
    </div>

    <div class="footer">
      <p>This document is legally binding and must be executed in the presence of a witness or notary public.</p>
    </div>
  </div>
  `;

  // Replace placeholders with the provided values
  const filledAgreement = agreementTemplate
    .replaceAll("{clientName}", clientName || "____")
    .replaceAll("{clientId}", clientId || "____")
    .replaceAll("{spouse1}", spouse1 || "____")
    .replaceAll("{spouse2}", spouse2 || "____")
    .replaceAll("{children}", children || "____")
    .replaceAll("{propertyDivision}", propertyDivision || "____")
    .replaceAll("{alimony}", alimony || "____")
    .replaceAll("{spouse1Address}", spouse1Address || "____")
    .replaceAll("{spouse2Address}", spouse2Address || "____")
    .replaceAll("{marriageDate}", marriageDate || "____")
    .replaceAll("{marriageLocation}", marriageLocation || "____")
    .replaceAll("{child1Name}", child1Name || "____")
    .replaceAll("{child1DOB}", child1DOB || "____")
    .replaceAll("{child2Name}", child2Name || "____")
    .replaceAll("{child2DOB}", child2DOB || "____")
    .replaceAll("{custodyArrangement}", custodyArrangement || "____")
    .replaceAll("{visitationSchedule}", visitationSchedule || "____")
    .replaceAll("{childSupport}", childSupport || "____")
    .replaceAll("{realPropertyDivision}", realPropertyDivision || "____")
    .replaceAll("{vehicleDivision}", vehicleDivision || "____")
    .replaceAll("{bankAccountDivision}", bankAccountDivision || "____")
    .replaceAll("{retirementAccountDivision}", retirementAccountDivision || "____")
    .replaceAll("{personalPropertyDivision}", personalPropertyDivision || "____")
    .replaceAll("{alimonyAmount}", alimonyAmount || "____")
    .replaceAll("{alimonyDuration}", alimonyDuration || "____")
    .replaceAll("{alimonyStartDate}", alimonyStartDate || "____")
    .replaceAll("{spouse1Name}", spouse1Name || "____")
    .replaceAll("{spouse1Debts}", spouse1Debts || "____")
    .replaceAll("{spouse2Name}", spouse2Name || "____")
    .replaceAll("{spouse2Debts}", spouse2Debts || "____")
    .replaceAll("{jurisdiction}", jurisdiction || "____")
    .replaceAll("{spouse1SignatureDate}", spouse1SignatureDate || "____")
    .replaceAll("{spouse2SignatureDate}", spouse2SignatureDate || "____")
    .replaceAll("{witnessSignatureDate}", witnessSignatureDate || "____")
    .replaceAll("{notarySignatureDate}", notarySignatureDate || "____");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Divorce Agreement Document</h1>

      {/* Display Editable Agreement */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
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
      </div>
    </div>
  );
};

export default DivorceAgreement;
