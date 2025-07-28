const express = require('express');
const router = express.Router();
const { getUserSocieties, getUserEvents, unregisterEvent, getUsers, getCurrentUser,
  getProfile
} = require('../controllers/userController');
const { protect, authAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const eventRoutes = require('./eventRoutes');


router.get('/societies',protect,getUserSocieties);
router.get('/profile', protect, getProfile);
router.get('/', getUsers);
router.get('/events', protect, getUserEvents);
router.delete('/:userId/events/:eventId', protect, unregisterEvent);

module.exports = router;