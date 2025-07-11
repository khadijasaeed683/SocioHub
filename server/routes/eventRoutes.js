const express = require('express');
const router = express.Router({ mergeParams: true });
const { createEvent,
        updateEvent,
       getAllEvents,
       getEventById,
      } = require('../controllers/eventController');
const { protect , authAdmin} = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); 

// Route to create an event
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'poster', maxCount: 1 }
  ]),
  createEvent
);
router.patch(
  '/:id',
  protect,
  upload.fields([
    { name: 'poster', maxCount: 1 }
  ]),
  updateEvent
);
// Route to get all events for a society
router.get(
  '/',   
    protect,
    getAllEvents
);

router.get(
  '/:id',
  protect,
  getEventById
);  

module.exports = router;    