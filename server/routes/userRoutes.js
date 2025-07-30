const express = require('express');
const router = express.Router();
const { getUserSocieties, getUserEvents, unregisterEvent, getUsers,
  getProfile, getUserSocietyRegistrationRequests
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


router.get('/societies',protect,getUserSocieties);
router.get('/society-registration-requests',protect,getUserSocietyRegistrationRequests);
router.get('/profile', protect, getProfile);
router.get('/', getUsers);
router.get('/events', protect, getUserEvents);
router.delete('/events/:eventId', protect, unregisterEvent);

module.exports = router;