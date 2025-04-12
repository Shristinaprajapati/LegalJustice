const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminder');

// Get all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new reminder
router.post('/', async (req, res) => {
  const { title, date } = req.body;
  const reminder = new Reminder({ title, date });
  try {
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    const result = await Reminder.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ message: 'Reminder deleted' });
    } else {
      res.status(404).json({ message: 'Reminder not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
