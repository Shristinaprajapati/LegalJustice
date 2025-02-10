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
  formTemplate: { 
    type: Object,
    validate: {
      validator: function(value) {
        // Only validate formOption if the category is 'documentation'
        if (this.category === 'documentation' && !value) {
          return false;  // Form template is required for 'documentation' category
        }
        return true;  // No validation for 'consulting' category
      },
      message: 'Form template is required for documentation services'
    }
  },
});

module.exports = mongoose.model('Service', serviceSchema);
