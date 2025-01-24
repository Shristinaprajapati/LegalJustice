const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['consulting', 'documentation'],  // Ensure the category is either 'consulting' or 'documentation'
    required: true 
  },
});

module.exports = mongoose.model('Service', serviceSchema);
