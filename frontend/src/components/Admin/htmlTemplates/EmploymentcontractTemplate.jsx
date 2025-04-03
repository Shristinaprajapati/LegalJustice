import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

const EmploymentContract = ({
  clientName,
  clientId,
  employerName,
  employeeName,
  jobTitle,
  startDate,
  endDate,
  salary,
  paymentFrequency,
  workHours,
  workLocation,
  probationPeriod,
  benefits,
  terminationConditions,
  confidentialityAgreement,
  nonCompeteAgreement,
  jurisdiction,
  employerSignatureDate,
  employeeSignatureDate,
  witnessSignatureDate,
  notarySignatureDate,
}) => {
  const editor = useRef(null);
  const title = "Employment Contract";

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
  <h2>EMPLOYMENT CONTRACT</h2>

  <p>This Employment Contract is entered into on <b>{startDate}</b>, by and between <b>{employerName}</b>, hereinafter referred to as the "Employer," and <b>{employeeName}</b>, hereinafter referred to as the "Employee." The Employer agrees to employ the Employee, and the Employee agrees to accept employment under the terms and conditions set forth in this Contract.</p>

  <h3>1. Position and Duties</h3>
  <p><b>Job Title:</b> {jobTitle}</p>
  <p><b>Work Hours:</b> {workHours}</p>
  <p><b>Work Location:</b> {workLocation}</p>
  <p>The Employee agrees to perform the duties and responsibilities associated with the position of <b>{jobTitle}</b> to the best of their ability and in accordance with the Employer's policies and procedures.</p>

  <h3>2. Compensation</h3>
  <p><b>Salary:</b> {salary}</p>
  <p><b>Payment Frequency:</b> {paymentFrequency}</p>
  <p>The Employee will be compensated with a salary of <b>{salary}</b>, payable <b>{paymentFrequency}</b>. The Employer reserves the right to adjust the salary in accordance with applicable laws and company policies.</p>

  <h3>3. Probation Period</h3>
  <p><b>Probation Period:</b> {probationPeriod || "Not applicable"}</p>
  <p>During the probation period, the Employee's performance will be evaluated to determine suitability for continued employment. The probation period will last for <b>{probationPeriod}</b>.</p>

  <h3>4. Benefits</h3>
  <p><b>Benefits:</b> {benefits || "No additional benefits"}</p>
  <p>The Employee is entitled to the following benefits: <b>{benefits}</b>.</p>

  <h3>5. Termination</h3>
  <p><b>Termination Conditions:</b> {terminationConditions || "Either party may terminate this Contract with 30 days written notice."}</p>
  <p>This Contract may be terminated under the following conditions: <b>{terminationConditions}</b>.</p>

  <h3>6. Confidentiality and Non-Compete</h3>
  <p><b>Confidentiality Agreement:</b> {confidentialityAgreement || "The Employee agrees not to disclose any confidential information during or after employment."}</p>
  <p><b>Non-Compete Agreement:</b> {nonCompeteAgreement || "The Employee agrees not to work for a competitor for 1 year after leaving the company."}</p>

  <h3>7. Jurisdiction</h3>
  <p>This Contract shall be governed by and construed in accordance with the laws of <b>{jurisdiction}</b>. Any disputes arising under this Contract shall be resolved in the courts of <b>{jurisdiction}</b>.</p>

  <h3>8. Signatures</h3>
  <p>IN WITNESS WHEREOF, the parties have executed this Contract as of the dates set forth below:</p>
  <br>
  <p><b>{employerName}:______________________________</b> Signed on <b>{employerSignatureDate}</b></p>
  <br>
  <p><b>{employeeName}:______________________________</b> Signed on <b>{employeeSignatureDate}</b></p>
  <br>
  <p><b>Witness:</b> ______________________________Signed on <b>{witnessSignatureDate}</b></p>
  <br>
  <p><b>Notary:</b> ______________________________Signed on <b>{notarySignatureDate}</b></p>
</div>
`;

  const filledAgreement = template
    .replaceAll("{clientName}", clientName ?? "____")
    .replaceAll("{clientId}", clientId ?? "____")
    .replaceAll("{employerName}", employerName ?? "____")
    .replaceAll("{employeeName}", employeeName ?? "____")
    .replaceAll("{jobTitle}", jobTitle ?? "____")
    .replaceAll("{startDate}", startDate ?? "____")
    .replaceAll("{endDate}", endDate ?? "____")
    .replaceAll("{salary}", salary ?? "____")
    .replaceAll("{paymentFrequency}", paymentFrequency ?? "____")
    .replaceAll("{workHours}", workHours ?? "____")
    .replaceAll("{workLocation}", workLocation ?? "____")
    .replaceAll("{probationPeriod}", probationPeriod ?? "____")
    .replaceAll("{benefits}", benefits ?? "____")
    .replaceAll("{terminationConditions}", terminationConditions ?? "____")
    .replaceAll("{confidentialityAgreement}", confidentialityAgreement ?? "____")
    .replaceAll("{nonCompeteAgreement}", nonCompeteAgreement ?? "____")
    .replaceAll("{jurisdiction}", jurisdiction ?? "____")
    .replaceAll("{employerSignatureDate}", employerSignatureDate ?? "____")
    .replaceAll("{employeeSignatureDate}", employeeSignatureDate ?? "____")
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

export default EmploymentContract;