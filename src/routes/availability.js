const express = require('express');
const availabilityController = require('../controllers/availabilityController');
const router = express.Router();

router.get('/users/:userId/available-slots', availabilityController.getAvailableSlots);

module.exports = router;