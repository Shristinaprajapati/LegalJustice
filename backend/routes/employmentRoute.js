const express = require('express');
const router = express.Router();
const EmploymentContract = require('../models/employment');

// POST route to handle form submission
router.post('/employment-contract', async (req, res) => {
  try {
    const newContract = new EmploymentContract(req.body);
    await newContract.save();
    res.status(201).json({ message: 'Employment Contract saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all employment contracts
router.get('/employment-contract', async (req, res) => {
  try {
    const contracts = await EmploymentContract.find();
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch employment contracts by clientId
router.get('/employment-contract/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const contracts = await EmploymentContract.find({ clientId });
    if (contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for this client ID.' });
    }
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;