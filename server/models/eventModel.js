// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
        type: String,
        required: true,
    },
    poster: {
        type: String,
    },
  description: String,
  startTime:{
        type: String,
        required: true
    },
    endTime:{
        type: String,
        required: true
    },
  location: {
        type: String,
        required: true
    },
  date: {
        type: Date,
        required: true
    },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society'
  },
  tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }],
  isPublic: { type: Boolean, default: true },
  participants: [{
    name: String,
  email: String,
  phone: String,
  isGuest: { type: Boolean, default: false }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
