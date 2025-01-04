const db = require('../config/database');
const { GET_AVAILABLE_SLOTS } = require('./queries/availabilityQueries');

class Availability {
  static async getUserAvailableSlots(userId, date) {
    const [rows] = await db.execute(
      GET_AVAILABLE_SLOTS,
      [userId, date, userId, userId, date]
    );
    return rows;
  }
}

module.exports = Availability;