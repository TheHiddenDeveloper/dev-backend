const Meeting = require('../models/meeting');
const { validationResult } = require('express-validator');
const { handleError } = require('../utils/errorHandler');

exports.createMeeting = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const meetingId = await Meeting.create(req.body);
    const meeting = await Meeting.findById(meetingId);
    
    res.status(201).json(meeting);
  } catch (error) {
    handleError(res, error, 'Error creating meeting');
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const success = await Meeting.update(meetingId, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    const meeting = await Meeting.findById(meetingId);
    res.json(meeting);
  } catch (error) {
    handleError(res, error, 'Error updating meeting');
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const success = await Meeting.delete(meetingId);
    
    if (!success) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    res.json({ message: 'Meeting cancelled successfully' });
  } catch (error) {
    handleError(res, error, 'Error cancelling meeting');
  }
};