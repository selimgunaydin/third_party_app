const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Token oluşturma fonksiyonu
const generateToken = (userId) => {
  return jwt.sign(
    { _id: userId }, 
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // 7 gün geçerli token
  );
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Tüm alanlar zorunludur',
        code: 'MISSING_FIELDS'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Şifre en az 6 karakter olmalıdır',
        code: 'INVALID_PASSWORD'
      });
    }

    const user = new User({ name, email, password });
    await user.save();
    
    const token = generateToken(user._id);
    
    // Password'ü response'dan çıkar
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      user: userResponse, 
      token 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Bu email adresi zaten kullanımda',
        code: 'DUPLICATE_EMAIL'
      });
    }
    res.status(400).json({
      error: error.message,
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email ve şifre zorunludur',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        error: 'Geçersiz giriş bilgileri',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Geçersiz giriş bilgileri',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const token = generateToken(user._id);

    // Password'ü response'dan çıkar
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ 
      user: userResponse, 
      token 
    });
  } catch (error) {
    res.status(500).json({
      error: 'Giriş yapılırken hata oluştu',
      code: 'LOGIN_ERROR'
    });
  }
});

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'Kullanıcı bulunamadı',
        code: 'USER_NOT_FOUND'
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: 'Kullanıcı bilgileri alınırken hata oluştu',
      code: 'FETCH_ERROR'
    });
  }
});

// Create new API key
router.post('/api-key', auth, async (req, res) => {
  try {
    // 64 byte (512 bit) API key
    const apiKey = crypto.randomBytes(64).toString('hex');
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: 'Kullanıcı bulunamadı',
        code: 'USER_NOT_FOUND'
      });
    }

    user.apiKeys.push(apiKey);
    await user.save();

    res.status(201).json({ apiKey });
  } catch (error) {
    res.status(500).json({
      error: 'API key oluşturulurken hata oluştu',
      code: 'API_KEY_ERROR'
    });
  }
});

// Delete API key
router.delete('/api-key/:key', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: 'Kullanıcı bulunamadı',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // En az bir API key olmalı
    if (user.apiKeys.length <= 1) {
      return res.status(400).json({
        error: 'En az bir API key\'iniz olmak zorunda',
        code: 'MIN_API_KEY'
      });
    }

    // API key'i sil
    if (!user.apiKeys.includes(req.params.key)) {
      return res.status(404).json({
        error: 'API key bulunamadı',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    user.apiKeys = user.apiKeys.filter(key => key !== req.params.key);
    await user.save();

    res.json({ 
      message: 'API key başarıyla silindi',
      remainingKeys: user.apiKeys.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'API key silinirken hata oluştu',
      code: 'DELETE_ERROR'
    });
  }
});

module.exports = router; 