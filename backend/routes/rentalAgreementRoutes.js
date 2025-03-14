const express = require('express');
const router = express.Router();
const RentalAgreement = require('../models/rentalagreement');

// POST route to handle form submission
router.post('/rental-agreement', async (req, res) => {
  try {
    const newRentalAgreement = new RentalAgreement(req.body);
    await newRentalAgreement.save();
    res.status(201).json({ message: 'Rental agreement saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all rental agreements
router.get('/rental-agreements', async (req, res) => {
  try {
    const rentalAgreements = await RentalAgreement.find();
    res.status(200).json(rentalAgreements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch rental agreements by clientId
router.get('/rental-agreements/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const rentalAgreements = await RentalAgreement.find({ clientId: clientId });
    if (rentalAgreements.length === 0) {
      return res.status(404).json({ message: 'No rental agreements found for this client ID.' });
    }
    res.status(200).json(rentalAgreements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;