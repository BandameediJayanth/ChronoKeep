const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // no duplicate usernames
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('User', UserSchema);