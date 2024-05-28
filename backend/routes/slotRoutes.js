const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/', 
  slotController.createSlot,
  (req, res) => res.status(200).json(res.locals.newSlot)
);

router.get('/coach/:coachId', 
  slotController.getCoachSlots,
  (req, res) => res.status(200).json(res.locals.slots)
);

module.exports = router;