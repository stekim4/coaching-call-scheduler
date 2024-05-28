const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');

router.post('/', 
  callController.createCall,
  (req, res) => res.status(200).json(res.locals.newCall)
);

router.get('/', 
  callController.getCalls,
  (req, res) => res.status(200).json(res.locals.calls)
);

router.put('/:callId', 
  callController.updateCall,
  (req, res) => res.status(200).json(res.locals.updatedCall)
);

module.exports = router;