const mongoose = require('mongoose');
const { type } = require('os');
const { title } = require('process');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    pfp:{
        type: String
    },
    role: {
        type: String,
        default: 'guest', 
    },
    societies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society',
    }],
    registeredEvents: [{
        type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);