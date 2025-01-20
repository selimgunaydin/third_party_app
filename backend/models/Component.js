const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  selector: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    enum: ['before', 'after'],
    default: 'after'
  },
  html: {
    type: String,
    required: true
  },
  css: {
    type: String,
    default: ''
  },
  javascript: {
    type: String,
    default: ''
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Selector ve userId için compound unique index
componentSchema.index({ selector: 1, userId: 1 }, { unique: true });

// Güncelleme tarihini otomatik güncelle
componentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Duplicate key error için özel hata mesajı
componentSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Bu selector zaten kullanımda'));
  } else {
    next(error);
  }
});

const Component = mongoose.model('Component', componentSchema);
module.exports = Component;