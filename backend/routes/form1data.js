const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Sample template with placeholders
const template = `
  <h2>Legal Contract Agreement</h2>
  <p>This Agreement is made on {{date}}, by and between:</p>
  <p><strong>Party A:</strong> {{partyA}}</p>
  <p><strong>Party B:</strong> {{partyB}}</p>
  <p><strong>Terms:</strong> {{terms}}</p>
  <p>By signing this document, both parties agree to the above terms and conditions.</p>
`;

// API endpoint to handle the form submission and generate the document
app.post("/api/submitForm", (req, res) => {
  const { partyA, partyB, date, terms } = req.body;

  // Replace placeholders in the template with actual form data
  let filledTemplate = template
    .replace("{{partyA}}", partyA)
    .replace("{{partyB}}", partyB)
    .replace("{{date}}", date)
    .replace("{{terms}}", terms);

  // Store the filled template or send it back to the client
  // For now, we'll just send it back to the client for demonstration
  res.json({ document: filledTemplate });
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
