// controllers/adminController.js
const Society = require('../models/societyModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); 
const dashboard = async (req, res) => {
  return res.status(404).json({ message: 'admin logged in' });
};
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PWD) 
    {
      const token =jwt.sign(email + password, process.env.JWT_SECRET);
      return res.status(200).json({token, message: 'admin logged in successfully'});
    }
    else
    {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { loginAdmin };
