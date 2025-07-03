// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');
const { protect, allowRoles, authAdmin } = require('../middleware/authMiddleware');

router.post(
  '/login',
  loginAdmin
  );


module.exports = router;
