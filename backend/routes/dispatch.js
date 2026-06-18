const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dispatchController');

router.get('/', ctrl.listDispatches);
router.post('/', ctrl.createDispatch);
router.get('/:id', ctrl.getDispatch);
router.put('/:id/assign', ctrl.assignAmbulance);
router.post('/:id/notify', ctrl.notifyDonors);

module.exports = router;
