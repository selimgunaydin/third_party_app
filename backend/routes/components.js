const express = require('express');
const Component = require('../models/Component');
const auth = require('../middleware/auth');
const router = express.Router();

// Yeni component oluştur
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

// Kullanıcının tüm componentlerini getir
router.get('/', auth, async (req, res) => {
  try {
    const components = await Component.find({ userId: req.user._id });
    res.send(components);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Belirli bir componenti getir
router.get('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!component) {
      return res.status(404).send({ error: 'Component bulunamadı' });
    }
    
    res.send(component);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Componenti güncelle
router.patch('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!component) {
      return res.status(404).send({ error: 'Component bulunamadı' });
    }
    
    res.send(component);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Componenti sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!component) {
      return res.status(404).send({ error: 'Component bulunamadı' });
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
      return res.status(404).send({ error: 'Geçersiz API key' });
    }
    
    const components = await Component.find({ userId: user._id });
    res.send(components);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router; 