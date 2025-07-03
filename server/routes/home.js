const express = require('express');
const router = express.Router();

// GET /api/home
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Home Page API!' });
});

module.exports = router;
