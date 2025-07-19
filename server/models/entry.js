const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // links to the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  unlockDate: {
    type: Date,
    required: true, // used to "time-lock" the entry
  },
}, { timestamps: true }); // adds createdAt and updatedAt fields

module.exports = mongoose.model('Entry', EntrySchema);