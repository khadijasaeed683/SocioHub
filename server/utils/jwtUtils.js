// utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const generateToken = (user) => {
  const token = jwt.sign(
  {
    id: user._id,
  },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

  return token;
};

module.exports = { generateToken };
