-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS job_platform;
USE job_platform;

-- Drop tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS user_availability;


-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    user_type ENUM('client', 'freelancer') NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    host_id INT NOT NULL,
    participant_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    status ENUM('scheduled', 'cancelled', 'completed') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(id),
    FOREIGN KEY (participant_id) REFERENCES users(id),
    CONSTRAINT different_participants CHECK (host_id != participant_id),
    CONSTRAINT valid_duration CHECK (duration >= 15 AND duration <= 180)
);

-- User availability table
CREATE TABLE IF NOT EXISTS user_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    day_of_week TINYINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Create index for common queries
CREATE INDEX idx_meeting_participants ON meetings(host_id, participant_id);
CREATE INDEX idx_meeting_status ON meetings(status);
CREATE INDEX idx_user_availability ON user_availability(user_id, day_of_week);

-- Function to check meeting conflicts
DELIMITER //
CREATE FUNCTION check_meeting_conflict(
    p_user_id INT,
    p_start_time DATETIME,
    p_duration INT
) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE conflict_exists BOOLEAN;
    
    SELECT EXISTS (
        SELECT 1 FROM meetings
        WHERE (host_id = p_user_id OR participant_id = p_user_id)
        AND status = 'scheduled'
        AND (
            (start_time BETWEEN p_start_time AND DATE_ADD(p_start_time, INTERVAL p_duration MINUTE))
            OR
            (DATE_ADD(start_time, INTERVAL duration MINUTE) 
             BETWEEN p_start_time AND DATE_ADD(p_start_time, INTERVAL p_duration MINUTE))
        )
    ) INTO conflict_exists;
    
    RETURN conflict_exists;
END //
DELIMITER ;

-- Trigger to prevent meeting conflicts
DELIMITER //
CREATE TRIGGER before_meeting_insert
BEFORE INSERT ON meetings
FOR EACH ROW
BEGIN
    IF check_meeting_conflict(NEW.host_id, NEW.start_time, NEW.duration) OR
       check_meeting_conflict(NEW.participant_id, NEW.start_time, NEW.duration) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Meeting time conflicts with existing schedule';
    END IF;
END //

CREATE TRIGGER before_meeting_update
BEFORE UPDATE ON meetings
FOR EACH ROW
BEGIN
    IF NEW.status = 'scheduled' AND (
        check_meeting_conflict(NEW.host_id, NEW.start_time, NEW.duration) OR
        check_meeting_conflict(NEW.participant_id, NEW.start_time, NEW.duration)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Meeting time conflicts with existing schedule';
    END IF;
END //
DELIMITER ;

-- Instert sample data
INSERT INTO users (email, full_name, user_type, timezone) VALUES
    ('qjw9P@example.com', 'John Doe', 'freelancer', 'UTC'),
    ('0M4Y8@example.com', 'Jane Smith', 'client', 'UTC'),
    ('lWg9d@example.com', 'Bob Johnson', 'freelancer', 'UTC'),    
    ('yCgYR@example.com', 'Alice Brown', 'client', 'UTC');

-- Select Tables
SELECT * from users;
SELECT * from user_availability;
SELECT * from meetings;

-- Delete Meeting
DELETE FROM meetings WHERE title='Project Discussion';

-- Update Meeting
UPDATE meetings SET title='Project Discussion', description='Initial meeting to discuss project requirements', host_id=1, participant_id=2, start_time='2024-01-15 10:00:00', duration=30 WHERE id=1;

-- Delete User
DELETE FROM users WHERE email='qjw9P@example.com';
