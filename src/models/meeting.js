const db = require('../config/database');
const { 
  CREATE_MEETING, 
  UPDATE_MEETING, 
  CANCEL_MEETING, 
  FIND_MEETING 
} = require('./queries/meetingQueries');

class Meeting {
  static async create(meetingData) {
    const [result] = await db.execute(CREATE_MEETING, [
      meetingData.title,
      meetingData.description,
      meetingData.host_id,
      meetingData.participant_id,
      meetingData.start_time,
      meetingData.duration,
      'scheduled',
    ]);
    return result.insertId;
  }

  static async update(meetingId, updates) {
    const updateFields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(', ');
    const updateValues = Object.values(updates);

    const query = `UPDATE meetings SET ${updateFields} WHERE id = ?`;
    const [result] = await db.execute(query, [...updateValues, meetingId]);

    return result.affectedRows > 0;
  }

  static async delete(meetingId) {
    const [result] = await db.execute(CANCEL_MEETING, ['cancelled', meetingId]);
    return result.affectedRows > 0;
  }

  static async findById(meetingId) {
    const [rows] = await db.execute(FIND_MEETING, [meetingId]);
    return rows[0];
  }
}

module.exports = Meeting;
