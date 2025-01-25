const express = require('express');
const router = express.Router();
const DivorceAgreement = require('../models/divorseagreement');
const { check, validationResult } = require('express-validator'); // For validation

// @route POST /api/divorce-agreements
// @desc Submit a divorce agreement form
// @access Public
router.post(
  '/',
  [
    check('clientName', 'Client name is required').notEmpty(),
    check('clientId', 'Client ID is required').notEmpty(),
    check('spouse1', 'Spouse1 name is required').notEmpty(),
    check('spouse2', 'Spouse2 name is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      clientName,
      clientId,
      spouse1,
      spouse2,
      children,
      propertyDivision,
      alimony,
    } = req.body;

    try {
      const newAgreement = new DivorceAgreement({
        clientName,
        clientId,
        spouse1,
        spouse2,
        children,
        propertyDivision,
        alimony,
      });

      const savedAgreement = await newAgreement.save();

      res.status(201).json({
        message: 'Form submitted successfully',
        data: savedAgreement,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error submitting the form',
        error: error.message,
      });
    }
  }
);

// @route GET /api/divorce-agreements/:clientId
// @desc Get divorce agreements by clientId
// @access Public
router.get('/:clientId', async (req, res) => {
    const { clientId } = req.params;
  
    try {
      // Find all agreements matching the provided clientId
      const agreements = await DivorceAgreement.find({ clientId });
  
      if (!agreements || agreements.length === 0) {
        return res.status(404).json({
          message: 'No agreements found for the given Client ID',
        });
      }
  
      res.status(200).json({
        message: 'Agreements retrieved successfully',
        data: agreements,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving agreements',
        error: error.message,
      });
    }
  });
  
  
// @route GET /api/divorce-agreements
// @desc Get all divorce agreements
// @access Public
router.get('/', async (req, res) => {
    try {
      // Fetch all records from the DivorceAgreement collection
      const agreements = await DivorceAgreement.find();
  
      // Check if any records are found
      if (!agreements || agreements.length === 0) {
        return res.status(404).json({
          message: 'No divorce agreements found.',
        });
      }
  
      // Return the retrieved records
      res.status(200).json({
        message: 'Divorce agreements retrieved successfully',
        data: agreements,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving divorce agreements',
        error: error.message,
      });
    }
  });
  

  
  
module.exports = router;
