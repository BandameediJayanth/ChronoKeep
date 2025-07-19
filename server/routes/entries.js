const express = require('express');
const Entry = require('../models/entry');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/entries
// @desc    Create a new entry (locked until unlockDate)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content, unlockDate } = req.body;

  try {
    const newEntry = new Entry({
      user: req.user, // set by auth middleware
      title,
      content,
      unlockDate,
    });

    const savedEntry = await newEntry.save();
    res.json(savedEntry);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/entries
// @desc    Get all unlocked entries for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({
      user: req.user,
      unlockDate: { $lte: new Date() }, // only return entries that are unlocked
    }).sort({ unlockDate: -1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// (Optional) @route GET /api/entries/:id
// @desc    Get one entry if it's unlocked
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    if (new Date(entry.unlockDate) > new Date()) {
      return res.status(403).json({ msg: 'This entry is locked until ' + entry.unlockDate });
    }

    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;