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
    default: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d407.60208671387477!2d85.330766!3d27.712094!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196de5da5741%3A0x652792640c70ede9!2sHerald%20College%20Kathmandu!5e1!3m2!1sen!2snp!4v1743589742398!5m2!1sen!2snp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
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



// const mongoose = require('mongoose');

// const SettingsSchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: [true, 'Company name is required'],
//     default: 'Legal Justice Pvt. Ltd.',
//     trim: true,
//     maxlength: [100, 'Company name cannot exceed 100 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     default: 'info@legaljustice.com',
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required'],
//     default: '+9779849388233',
//     trim: true,
//     match: [/^\+?[0-9\s\-\(\)]{7,}$/, 'Please fill a valid phone number']
//   },
//   address: {
//     type: String,
//     required: [true, 'Address is required'],
//     default: 'Naxal, Kathmandu, Nepal',
//     trim: true,
//     maxlength: [200, 'Address cannot exceed 200 characters']
//   },
//   mapEmbed: {
//     type: String,
//     required: [true, 'Map embed code is required'],
//     default: '!1m14!1m8!1m3!1d407.60208671387477!2d85.330766!3d27.712094!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196de5da5741%3A0x652792640c70ede9!2sHerald%20College%20Kathmandu!5e1!3m2!1sen!2snp!4v1743589742398!5m2!1sen!2snp',
//     trim: true
//   },
//   facebook: {
//     type: String,
//     required: [true, 'Facebook link is required'],
//     default: 'https://facebook.com/legaljustice',
//     trim: true,
//     match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please fill a valid URL']
//   },
//   instagram: {
//     type: String,
//     required: [true, 'Instagram link is required'],
//     default: 'https://instagram.com/legaljustice',
//     trim: true,
//     match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please fill a valid URL']
//   },
//   twitter: {
//     type: String,
//     required: [true, 'Twitter link is required'],
//     default: 'https://twitter.com/legaljustice',
//     trim: true,
//     match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please fill a valid URL']
//   },
//   linkedin: {
//     type: String,
//     required: [true, 'LinkedIn link is required'],
//     default: 'https://linkedin.com/company/legaljustice',
//     trim: true,
//     match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please fill a valid URL']
//   },
//   whatsapp: {
//     type: String,
//     required: [true, 'WhatsApp link is required'],
//     default: 'https://wa.me/9779849388233',
//     trim: true,
//     match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please fill a valid URL']
//   },
//   messenger: {
//     type: String,
//     required: [true, 'Messenger link is required'],
//     default: 'https://m.me/legaljustice',
//     trim: true,
//     match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please fill a valid URL']
//   }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtual for full map embed URL
// SettingsSchema.virtual('fullMapEmbed').get(function() {
//   return `https://www.google.com/maps/embed?pb=${this.mapEmbed}`;
// });

// // Pre-save hook to normalize URLs
// SettingsSchema.pre('save', function(next) {
//   // Ensure URLs are properly formatted
//   const urlFields = ['facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp', 'messenger'];
  
//   urlFields.forEach(field => {
//     if (this[field] && !this[field].startsWith('http')) {
//       this[field] = `https://${this[field]}`;
//     }
//   });

//   next();
// });

// module.exports = mongoose.model('Settings', SettingsSchema);