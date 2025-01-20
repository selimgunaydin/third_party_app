const express = require('express');
const Component = require('../models/Component');
const auth = require('../middleware/auth');
const router = express.Router();

// Özel route'lar için ayrı router
const specialRouter = express.Router();
router.use('/', specialRouter);

// Check selector - Özel router'da tanımla
specialRouter.get('/check-selector', auth, async (req, res) => {
  try {
    const { selector } = req.query;
    
    if (!selector) {
      return res.status(400).json({ 
        error: 'Selector parametresi gerekli',
        code: 'MISSING_SELECTOR'
      });
    }

    const existingComponent = await Component.findOne({
      userId: req.user._id,
      selector: selector
    });

    res.json({ 
      exists: !!existingComponent,
      message: existingComponent ? 'Bu selector zaten kullanımda' : null
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Selector kontrolü sırasında hata oluştu',
      code: 'CHECK_ERROR'
    });
  }
});

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
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Bu selector zaten kullanımda',
        code: 'DUPLICATE_SELECTOR'
      });
    }
    res.status(400).json({ 
      error: error.message,
      code: 'VALIDATION_ERROR'
    });
  }
});

// Get all components for user
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [components, total] = await Promise.all([
      Component.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Component.countDocuments({ userId: req.user._id })
    ]);

    res.json({
      components,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Componentler yüklenirken hata oluştu',
      code: 'FETCH_ERROR'
    });
  }
});

// Get single component
router.get('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!component) {
      return res.status(404).json({ 
        error: 'Component bulunamadı',
        code: 'NOT_FOUND'
      });
    }

    res.json(component);
  } catch (error) {
    res.status(500).json({ 
      error: 'Component yüklenirken hata oluştu',
      code: 'FETCH_ERROR'
    });
  }
});

// Update component
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'selector', 'position', 'html', 'css', 'javascript', 'isActive'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ 
        error: 'Geçersiz güncelleme alanları',
        code: 'INVALID_UPDATES'
      });
    }

    const component = await Component.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!component) {
      return res.status(404).json({ 
        error: 'Component bulunamadı',
        code: 'NOT_FOUND'
      });
    }
    
    res.json(component);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Bu selector zaten kullanımda',
        code: 'DUPLICATE_SELECTOR'
      });
    }
    res.status(400).json({ 
      error: error.message,
      code: 'UPDATE_ERROR'
    });
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
      return res.status(404).json({ 
        error: 'Component bulunamadı',
        code: 'NOT_FOUND'
      });
    }
    
    res.json({ 
      message: 'Component başarıyla silindi',
      component 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Component silinirken hata oluştu',
      code: 'DELETE_ERROR'
    });
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

module.exports = router; 