require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chronokeep', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Entry schema
const entrySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  content: String,
  unlockAt: Date,
  createdAt: { type: Date, default: Date.now },
});
const Entry = mongoose.model('Entry', entrySchema);

// Auth middleware
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('No token');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
}

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();
  res.sendStatus(201);
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).send('Invalid credentials');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
  res.json({ token });
});

// Create entry
app.post('/api/entries', auth, async (req, res) => {
  const { content, unlockAt } = req.body;
  const entry = new Entry({ userId: req.user.id, content, unlockAt });
  await entry.save();
  res.status(201).json(entry);
});

// Get entries
app.get('/api/entries', auth, async (req, res) => {
  const entries = await Entry.find({ userId: req.user.id });
  const now = new Date();
  res.json(
    entries.map(e => {
      // Always parse unlockAt as a Date for comparison
      const unlockDate = new Date(e.unlockAt);
      const isUnlocked = now >= unlockDate;
      return {
        _id: e._id,
        content: isUnlocked ? e.content : `Locked until ${unlockDate.toLocaleString()}`,
        unlockAt: e.unlockAt,
        createdAt: e.createdAt,
        locked: !isUnlocked,
      };
    })
  );
});
// Basic test route
app.get('/', (req, res) => {
  res.send('ChronoKeep API is running!');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));