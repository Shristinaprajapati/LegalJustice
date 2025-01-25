const express = require('express');
const router = express.Router();
const Template = require('../models/template'); // MongoDB model
const ReactDOMServer = require('react-dom/server');
const DivorceAgreementTemplate = require('../components/Admin/htmlTemplates/DivorceAgreementTemplate.jsx');
const RealEstateAgreementTemplate = require('../components/Admin/htmlTemplates/RealEstateAgreementTemplate.jsx');
const React = require('react');

// Route to render and save templates
router.post('/store-template', async (req, res) => {
  try {
    // Render the templates
    const divorceAgreementHtml = ReactDOMServer.renderToStaticMarkup(<DivorceAgreementTemplate />);
    const realEstateAgreementHtml = ReactDOMServer.renderToStaticMarkup(<RealEstateAgreementTemplate />);

    // Store in the database
    const templates = [
      { name: 'Divorce Agreement Template', content: divorceAgreementHtml, category: 'Family Law' },
      { name: 'Real Estate Agreement Template', content: realEstateAgreementHtml, category: 'Real Estate Documents' },
    ];

    await Template.insertMany(templates);

    res.status(200).json({ message: 'Templates rendered and stored successfully!' });
  } catch (error) {
    console.error('Error rendering or storing templates:', error);
    res.status(500).json({ message: 'Error rendering or storing templates' });
  }
});

module.exports = router;
