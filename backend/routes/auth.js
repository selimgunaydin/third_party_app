const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ error: 'Email address is already in use' });
    }
    res.status(400).send({ error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Create new API key
router.post('/api-key', auth, async (req, res) => {
  try {
    // Generate new API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    // Add to user
    const user = await User.findById(req.user._id);
    user.apiKeys.push(apiKey);
    await user.save();

    res.status(201).json({ apiKey });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

// Delete API key
router.delete('/api-key/:key', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // User must have at least one API key
    if (user.apiKeys.length <= 1) {
      return res.status(400).json({ error: 'You must have at least one API key' });
    }

    // Delete API key
    user.apiKeys = user.apiKeys.filter(key => key !== req.params.key);
    await user.save();

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

module.exports = router; 