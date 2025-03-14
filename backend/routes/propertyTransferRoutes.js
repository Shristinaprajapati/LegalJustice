const express = require('express');
const router = express.Router();
const PropertyTransferAgreement = require('../models/propertytransfer');

// POST route to handle form submission
router.post('/property-transfer-agreement', async (req, res) => {
  try {
    const newAgreement = new PropertyTransferAgreement(req.body);
    await newAgreement.save();
    res.status(201).json({ message: 'Property Transfer Agreement saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all property transfer agreements
router.get('/property-transfer-agreement', async (req, res) => {
  try {
    const agreements = await PropertyTransferAgreement.find();
    res.status(200).json(agreements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch property transfer agreements by clientId
router.get('/property-transfer-agreement/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const agreements = await PropertyTransferAgreement.find({ clientId });
    if (agreements.length === 0) {
      return res.status(404).json({ message: 'No agreements found for this client ID.' });
    }
    res.status(200).json(agreements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;