const CREATE_MEETING = `
  INSERT INTO meetings (
    title, description, host_id, participant_id, 
    start_time, duration, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

const UPDATE_MEETING = 'UPDATE meetings SET {updates} WHERE id = ?';
const CANCEL_MEETING = 'UPDATE meetings SET status = ? WHERE id = ?';
const FIND_MEETING = 'SELECT * FROM meetings WHERE id = ?';

module.exports = {
  CREATE_MEETING,
  UPDATE_MEETING,
  CANCEL_MEETING,
  FIND_MEETING
};
