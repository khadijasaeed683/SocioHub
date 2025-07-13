// models/Society.js
const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  description: String,
  logo: {
        type: String,
        required: true,
    },
  coverImage: String,
  website: String,
  name: {
        type: String,
        required: true,
        unique: true
    },
  socialLinks: {
    instagram: String,
    linkedin: String
  },
  contactEmail: {
    type: String, 
    required: true,
  },
  phone: {
    type: String, 
    required: true,
  },
  type: {
    type: String,
    default: 'other'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  pendingRequests: [{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  }
}],

  approved: { type: Boolean, default: false },
  description: { type: String, required: true },
  inductionsOpen: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);
