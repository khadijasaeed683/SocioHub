// routes/societyRoutes.js
const express = require('express');
const router = express.Router();
const { registerSociety, 
        getUserSocieties, 
        joinSociety, 
        getAllSocieties, 
        getJoinRequests,
        handleJoinRequest,
        getSocietyMembers,
        getSocietyById,
        updateSociety,
        removeMember
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

router.get(
  '/:id/requests',
  protect,
  getJoinRequests
);

router.post(
  '/:societyId/requests/:reqId/:action',
  protect,
  handleJoinRequest
);


router.get(
  '/:id/members',
  protect,
  upload.none(),  
  getSocietyMembers
);
router.delete(
  '/:societyId/members/:memberId',
  protect,
  removeMember
);

router.use('/:societyId/event', protect, eventRoutes);
module.exports = router;
