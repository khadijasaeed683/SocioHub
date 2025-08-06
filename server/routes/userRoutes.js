const express = require('express');
const router = express.Router();
const { getUserSocieties, getUserEvents, unregisterEvent, getUsers,
  getProfile, getUserSocietyRegistrationRequests, updateUser, deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); 

router.put('/', protect, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateUser);
router.get('/societies',protect,getUserSocieties);
router.get('/society-registration-requests',protect,getUserSocietyRegistrationRequests);
router.get('/profile', protect, getProfile);
router.get('/', getUsers);
router.delete('/',protect, deleteUser);
router.get('/events', protect, getUserEvents);
router.delete('/events/:eventId', protect, unregisterEvent);

module.exports = router;