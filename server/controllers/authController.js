const validator = require( 'validator');
const { generateToken } = require('../utils/jwtUtils');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// POST /api/auth/signup

const signup = (async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'This email is already registered' });

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing details' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({
      message: 'Signup successful',
      user: { username: newUser.username, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', { email, password });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'There is no account registered with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };