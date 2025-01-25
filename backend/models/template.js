const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Template Name
  content: { type: String, required: true }, // Template HTML content with placeholders
  category: { type: String, required: true }, // Category of the template
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
