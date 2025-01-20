const express = require('express');
const Component = require('../models/Component');
const auth = require('../middleware/auth');
const router = express.Router();

// Create new component
router.post('/', auth, async (req, res) => {
  try {
    const component = new Component({
      ...req.body,
      userId: req.user._id
    });
    await component.save();
    res.status(201).send(component);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all components for user
router.get('/', auth, async (req, res) => {
  try {
    const components = await Component.find({ userId: req.user._id });
    res.send(components);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get specific component
router.get('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!component) {
      return res.status(404).send({ error: 'Component not found' });
    }
    
    res.send(component);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update component
router.patch('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!component) {
      return res.status(404).send({ error: 'Component not found' });
    }
    
    res.send(component);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete component
router.delete('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!component) {
      return res.status(404).send({ error: 'Component not found' });
    }
    
    res.send(component);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Public widget endpoint
router.get('/widget/:apiKey', async (req, res) => {
  try {
    const user = await User.findOne({ apiKey: req.params.apiKey });
    if (!user) {
      return res.status(404).send({ error: 'Invalid API key' });
    }
    
    const components = await Component.find({ userId: user._id });
    res.send(components);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Check selector
router.get('/check-selector', auth, async (req, res) => {
  try {
    const { selector } = req.query;
    
    if (!selector) {
      return res.status(400).json({ error: 'Selector parameter is required' });
    }

    // Search among user's components
    const existingComponent = await Component.findOne({
      userId: req.user._id,
      selector: selector
    });

    res.json({ 
      exists: !!existingComponent,
      message: existingComponent ? 'This selector is already in use' : null
    });
  } catch (error) {
    console.error('Selector check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 