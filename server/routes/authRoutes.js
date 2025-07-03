// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const upload = require('../middleware/multer');
router.post('/signup', signup);
router.post('/login', upload.none(), login);

module.exports = router;
