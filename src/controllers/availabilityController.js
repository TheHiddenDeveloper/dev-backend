const Availability = require('../models/availability');
const { handleError } = require('../utils/errorHandler');


exports.getAvailableSlots = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const slots = await Availability.getUserAvailableSlots(userId, date);
    res.json(slots);
  } catch (error) {
    handleError(res, error, 'Error fetching available slots');
  }
};