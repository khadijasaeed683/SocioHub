// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const upload = require('../middleware/multer');
router.post('/signup', signup);
router.post('/login', upload.none(), login);
router.post('/logout', upload.none(), logout);

module.exports = router;
