// routes/publicEventRoutes.js
const express = require('express');
const router = express.Router();
const { registerForEvent, getPublicEvents } = require('../controllers/eventController');
const upload = require('../middleware/multer');

// Public RSVP route
router.post(
  '/:id/register',
  upload.none(),
  registerForEvent
);

router.get(
  '/',   
    getPublicEvents
);
module.exports = router;
