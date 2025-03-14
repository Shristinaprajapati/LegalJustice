const express = require('express');
const router = express.Router();
const MarriageProof = require('../models/marriageproof'); // Import the schema

// POST route to handle form submission
router.post('/marriage-proof', async (req, res) => {
  try {
    const newMarriageProof = new MarriageProof(req.body);
    await newMarriageProof.save();
    res.status(201).json({ message: 'Marriage proof document saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all marriage proof documents
router.get('/marriage-proofs', async (req, res) => {
  try {
    const marriageProofs = await MarriageProof.find();
    res.status(200).json(marriageProofs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch marriage proof documents by clientId
router.get('/marriage-proofs/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const marriageProofs = await MarriageProof.find({ clientId: clientId });
    if (marriageProofs.length === 0) {
      return res.status(404).json({ message: 'No marriage proof documents found for this client ID.' });
    }
    res.status(200).json(marriageProofs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;