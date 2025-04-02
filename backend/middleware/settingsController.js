const Settings = require('../models/settings.js');

// Get current settings
exports.getSettings = async (req, res) => {
  try {
    // There should only be one settings document
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    // There should only be one settings document
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        { $set: req.body },
        { new: true }
      );
    }
    
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};