const express = require('express');
const router = express.Router();
const DivorceAgreement = require('../models/document');
const mongoose = require('mongoose');

// // Route to save the agreement content to the database
// router.post('/save', async (req, res) => {
//   const { clientId, clientName, title, agreementContent } = req.body;

//   // Validate required fields
//   if (!clientId || !clientName || !title || !agreementContent) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   // Validate clientId format
//   if (!mongoose.Types.ObjectId.isValid(clientId)) {
//     return res.status(400).json({ message: 'Invalid clientId format' });
//   }

//   try {
//     const newDocument = new DivorceAgreement({
//       clientId,
//       clientName,
//       title,
//       agreementContent
//     });

//     await newDocument.save();
//     res.status(201).json({ message: 'Document saved successfully!' });
//   } catch (error) {
//     console.error('Error saving document:', error);
//     res.status(500).json({ message: 'Failed to save the document.' });
//   }
// });




// Route to save the agreement content to the database
router.post('/save', async (req, res) => {
  const { clientId, clientName, title, agreementContent } = req.body;

  // Validate required fields
  if (!clientId || !clientName || !title || !agreementContent) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate clientId format
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid clientId format' });
  }

  try {
    // Check if a document already exists for the clientId, clientName, and title
    const existingDocument = await DivorceAgreement.findOne({ clientId, clientName, title });

    if (existingDocument) {
      // If the document exists with the same clientId, clientName, and title, update the agreementContent
      existingDocument.agreementContent = agreementContent;
      await existingDocument.save();
      return res.status(200).json({ message: 'Document updated successfully!' });
    } else {
      // If no document exists with the same clientId, clientName, and title, create a new one
      const newDocument = new DivorceAgreement({
        clientId,
        clientName,
        title,
        agreementContent
      });
      await newDocument.save();
      return res.status(201).json({ message: 'Document saved successfully!' });
    }
  } catch (error) {
    console.error('Error saving/updating document:', error);
    res.status(500).json({ message: 'Failed to save or update the document.' });
  }
});


// Count the number of divorce agreements
router.get('/count', async (req, res) => {
  try {
    const documentCount = await DivorceAgreement.countDocuments();
    return res.status(200).json({ documentCount });
  } catch (error) {
    console.error('Error counting documents:', error);
    return res.status(500).json({ message: 'Failed to count documents' });
  }
});


router.get('/:clientId', async (req, res) => {
  const { clientId } = req.params;

  // Validate clientId format
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid clientId format' });
  }

  try {
    // Fetch all agreements for the client
    const agreements = await DivorceAgreement.find({ clientId });

    if (!agreements.length) {
      return res.status(404).json({ message: 'No agreements found for this client' });
    }

    return res.status(200).json({ agreements });
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/', async (req, res) => {
  try {
    // Fetch all divorce agreements from the database
    const allAgreements = await DivorceAgreement.find();

    if (allAgreements.length === 0) {
      return res.status(404).json({ message: 'No divorce agreements found in the database' });
    }

    return res.status(200).json({ agreements: allAgreements });
  } catch (error) {
    console.error('Error fetching all agreements:', error);
    return res.status(500).json({ message: 'Failed to retrieve all agreements' });
  }
});


module.exports = router;
