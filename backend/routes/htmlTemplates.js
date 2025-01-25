const express = require('express');
const Template = require('../models/template');
const router = express.Router();

// Route to store template
router.post('/store-template', async (req, res) => {
  try {
    console.log("POST request received at /store-template");
    const { name, content, category } = req.body;

    const template = new Template({ name, content, category });
    await template.save();

    res.status(200).json({ message: 'Template saved successfully!' });
  } catch (error) {
    console.error('Error saving template:', error);
    res.status(500).json({ message: 'Error saving template' });
  }
});

// Route to fetch templates by category
router.get('/templates/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const templates = await Template.find({ category });

    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    res.status(500).json({ message: 'Error fetching templates' });
  }
});

module.exports = router;
