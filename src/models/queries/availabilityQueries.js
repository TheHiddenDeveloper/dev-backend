const GET_AVAILABLE_SLOTS = `
  SELECT * FROM user_availability 
  WHERE user_id = ? 
  AND day_of_week = WEEKDAY(?)
  AND NOT EXISTS (
    SELECT 1 FROM meetings 
    WHERE (host_id = ? OR participant_id = ?)
    AND DATE(start_time) = DATE(?)
    AND status = 'scheduled'
  )
`;

module.exports = { GET_AVAILABLE_SLOTS };