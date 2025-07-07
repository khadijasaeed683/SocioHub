// routes/societyRoutes.js
const express = require('express');
const router = express.Router();
const { registerSociety, 
        getUserSocieties, 
        joinSociety, 
        getAllSocieties, 
        approveSociety, 
        getJoinRequests,
        acceptJoinRequest,
        getSocietyMembers,
        getSocietyById,
        updateSociety
      } = require('../controllers/societyController');
const { protect , authAdmin} = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); 
const eventRoutes = require('./eventRoutes');

router.get(
  '/',
  getAllSocieties
);
// router.get(
//   '/user-societies',
//   protect,
//   getUserSocieties
// );
router.get(
  '/:id',
  getSocietyById
);

router.post(
  '/',
    protect,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]), 
  registerSociety
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  updateSociety
);

router.post(
  '/:id/join',
  protect,
  joinSociety
);

router.post(
  '/:id/approve',
  authAdmin,
  approveSociety
);

router.get(
  '/:id/requests',
  protect,
  getJoinRequests
);
router.post(
  '/:societyId/requests/:userId/accept',
  protect,
  acceptJoinRequest
);

router.get(
  '/:id/members',
  protect,
  upload.none(),  
  getSocietyMembers
);

router.use('/:societyId/event', protect, eventRoutes);
module.exports = router;
