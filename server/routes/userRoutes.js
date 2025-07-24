const express = require('express');
const router = express.Router();
const { getUserSocieties,getUserEvents, unregisterEvent, getUsers, getCurrentUser} = require('../controllers/userController');
const { protect , authAdmin} = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); 
const eventRoutes = require('./eventRoutes');


router.get(  '/:id/societies',
  protect,
  getUserSocieties
);
router.get('/current', getCurrentUser);
router.get('/', getUsers);
router.get('/:id/events', protect, getUserEvents);
router.delete('/:userId/events/:eventId', protect, unregisterEvent);

module.exports = router;