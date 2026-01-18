const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
demoRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('DemoRequest', demoRequestSchema);
