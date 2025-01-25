const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const DivorceAgreement = require('../models/form1'); // Import the model

// Serve static files from the 'generated-documents' directory
router.use('/generated-documents', express.static(path.join(__dirname, '../generated-documents')));

// Backend route to fetch DivorceAgreement by ID and generate HTML content
router.get('/generate-divorce-agreement/:id', async (req, res) => {
  try {
    const divorceAgreement = await DivorceAgreement.findById(req.params.id);

    if (!divorceAgreement) {
      return res.status(404).json({ message: 'Divorce Agreement not found' });
    }

    // Ensure children is an array and join it into a string
    const childrenList = Array.isArray(divorceAgreement.children) ? divorceAgreement.children.join(', ') : divorceAgreement.children;

    // Generate HTML content (this can be a simple template)
    const htmlContent = `
      <h2>Divorce Agreement</h2>
      <p><strong>Spouse 1:</strong> ${divorceAgreement.spouse1}</p>
      <p><strong>Spouse 2:</strong> ${divorceAgreement.spouse2}</p>
      <p><strong>Children:</strong> ${childrenList}</p>
      <p><strong>Property Division:</strong> ${divorceAgreement.propertyDivision}</p>
      <p><strong>Alimony:</strong> ${divorceAgreement.alimony}</p>
    `;

    // Send the HTML content back
    res.json({ htmlContent });
  } catch (error) {
    console.error('Error generating Divorce Agreement:', error);
    res.status(500).json({ message: 'Error generating Divorce Agreement' });
  }
});

// Handle POST request to generate Divorce Agreement
router.post('/generate-divorce-agreement', async (req, res) => {
  const { spouse1, spouse2, children, propertyDivision, alimony } = req.body;

  try {
    // 1. Save the form data to the database
    const divorceAgreement = new DivorceAgreement({
      spouse1,
      spouse2,
      children,
      propertyDivision,
      alimony,
    });

    await divorceAgreement.save();

    // 2. Load the HTML template for Divorce Agreement
    fs.readFile(path.join(__dirname, '../templates/template1.html'), 'utf8', (err, data) => {
      if (err) {
        console.error("Error loading template:", err);  // Log error
        return res.status(500).json({ message: 'Error loading template' });
      }

      // 3. Replace placeholders in the template with actual form data
      let documentContent = data;
      documentContent = documentContent.replace('[Spouse 1 Name]', spouse1);
      documentContent = documentContent.replace('[Spouse 2 Name]', spouse2);
      documentContent = documentContent.replace('[Children\'s Names]', Array.isArray(children) ? children.join(', ') : children);
      documentContent = documentContent.replace('[Property Division Details]', propertyDivision);
      documentContent = documentContent.replace('[Alimony Details]', alimony);

      // 4. Save the generated document
      const documentName = `divorce-agreement-${divorceAgreement._id}.html`;
      const documentPath = path.join(__dirname, '../generated-documents', documentName);
      fs.writeFile(documentPath, documentContent, (err) => {
        if (err) {
          console.error("Error saving document:", err);  // Log error
          return res.status(500).json({ message: 'Error saving document' });
        }

        // 5. Respond with the URL to the generated document
        const documentUrl = `/generated-documents/${documentName}`;
        res.json({ message: 'Divorce Agreement generated successfully', documentUrl });
      });
    });

  } catch (err) {
    console.error("Error saving data to database:", err);  // Log error
    res.status(500).json({ message: 'Error saving data to database' });
  }
});

module.exports = router;
