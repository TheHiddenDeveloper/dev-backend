const express = require('express');
const meetingController = require('../controllers/meetingController');
const { meetingValidators } = require('../utils/validators');

const router = express.Router();

router.post('/', meetingValidators, meetingController.createMeeting);
router.put('/:meetingId', meetingValidators, meetingController.updateMeeting);
router.delete('/:meetingId', meetingController.deleteMeeting);

module.exports = router;