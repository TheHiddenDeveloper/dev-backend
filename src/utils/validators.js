const { body } = require('express-validator');

const meetingValidators = [
  body('title').notEmpty().trim(),
  body('host_id').isInt().notEmpty(),
  body('participant_id').isInt().notEmpty(),
  body('start_time').isISO8601(),
  body('duration').isInt({ min: 15, max: 180 })
];

module.exports = { meetingValidators };