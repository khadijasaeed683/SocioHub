// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');
const { authAdmin } = require('../middleware/authMiddleware');
const {getAllSocietyRegistrationRequests, handleSocietyRegistrationRequest, getAllSocieties,
    toggleSocietyActivation, deleteSociety, getSocietiesByApprovalStatus
} = require('../controllers/societyController');
const {getUsers} = require('../controllers/userController');

router.post('/login',loginAdmin);
router.get('/society/registration-requests', authAdmin, getAllSocietyRegistrationRequests);
router.post('/society/:societyId/:action', authAdmin, handleSocietyRegistrationRequest);
router.get('/society', authAdmin, getSocietiesByApprovalStatus);
router.patch('/society/:societyId/toggle-activation', authAdmin, toggleSocietyActivation);
router.delete('/society/:societyId', authAdmin, deleteSociety);
router.get('/users', authAdmin, getUsers);

module.exports = router;
