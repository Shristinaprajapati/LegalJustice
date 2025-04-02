const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../middleware/settingsController');

// @route   GET api/settings
// @desc    Get current settings
// @access  Private (add authentication middleware later)
router.get('/', getSettings);

// @route   PUT api/settings
// @desc    Update settings
// @access  Private
router.put('/', updateSettings);

module.exports = router;