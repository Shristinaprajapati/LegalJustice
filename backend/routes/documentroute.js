const express = require('express');
const router = express.Router();
const DivorceAgreement = require('../models/document');
const mongoose = require('mongoose');

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
    const newDocument = new DivorceAgreement({
      clientId,
      clientName,
      title,
      agreementContent
    });

    await newDocument.save();
    res.status(201).json({ message: 'Document saved successfully!' });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ message: 'Failed to save the document.' });
  }
});

// Route to fetch the agreement content for a specific client
router.get('/:clientId', async (req, res) => {
  const { clientId } = req.params;

  // Validate clientId format
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid clientId format' });
  }

  try {
    // Fetch the agreement for the client
    const agreement = await DivorceAgreement.findOne({ clientId });

    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found for this client' });
    }

    return res.status(200).json({ agreement });
  } catch (error) {
    console.error('Error fetching agreement:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
