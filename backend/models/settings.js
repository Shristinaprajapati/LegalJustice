const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    default: 'Legal Justice Pvt. Ltd.'
  },
  email: {
    type: String,
    required: true,
    default: 'info@legaljustice.com'
  },
  phone: {
    type: String,
    required: true,
    default: '+9779849388233'
  },
  address: {
    type: String,
    required: true,
    default: 'Naxal, Kathmandu, Nepal'
  },
  mapEmbed: {
    type: String,
    required: true,
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2936324072097!2d85.3206670753238!3d27.7130!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196de5da5741%3A0x652792640c70ede9!2sLegal%20Justice!5e0!3m2!1sen!2snp!4v1234567890!5m2!1sen!2snp' 
  },
  facebook: {
    type: String,
    required: true,
    default: 'https://facebook.com/legaljustice'
  },
  instagram: {
    type: String,
    required: true,
    default: 'https://instagram.com/legaljustice'
  },
  twitter: {
    type: String,
    required: true,
    default: 'https://twitter.com/legaljustice'
  },
  linkedin: {
    type: String,
    required: true,
    default: 'https://linkedin.com/company/legaljustice'
  },
  whatsapp: {
    type: String,
    required: true,
    default: 'https://whatsapp.com/9779849388233'
  },
  messenger: {
    type: String,
    required: true,
    default: 'https://messenger.me/legaljustice'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);