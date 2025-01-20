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

// Güncelleme tarihini otomatik güncelle
componentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Component = mongoose.model('Component', componentSchema);
module.exports = Component;