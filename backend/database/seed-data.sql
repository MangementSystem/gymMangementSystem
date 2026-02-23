-- ============================================
-- Gym Management System - Seed Data
-- ============================================
-- Version: 1.0.0
-- Date: 2026-02-13
-- Description: Sample data for testing and development
-- ============================================

-- Clear existing data (in reverse order of dependencies)
TRUNCATE TABLE ai_insights, ai_exercise_analysis, workout_log_sets, workout_logs, 
               workout_program_exercises, workout_programs, exercises, progress, 
               attendance_logs, attendance_devices, transactions, memberships, 
               plans, members, users, organizations RESTART IDENTITY CASCADE;

-- ============================================
-- 1. ORGANIZATIONS
-- ============================================
INSERT INTO organizations (name, address, phone, email, website, description) VALUES
('Fitness Pro Gym', '123 Main Street, New York, NY 10001', '+1-555-0101', 'info@fitnesspro.com', 'https://fitnesspro.com', 'Premium fitness center with state-of-the-art equipment'),
('PowerHouse Fitness', '456 Oak Avenue, Los Angeles, CA 90001', '+1-555-0102', 'contact@powerhouse.com', 'https://powerhouse.com', 'Strength training and bodybuilding specialist'),
('Yoga & Wellness Center', '789 Elm Street, Chicago, IL 60601', '+1-555-0103', 'hello@yogawellness.com', 'https://yogawellness.com', 'Holistic wellness and yoga studio');

-- ============================================
-- 2. USERS (Authentication)
-- ============================================
-- Password for all users: "Password123" (hashed with bcrypt)
-- Hash: $2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8

INSERT INTO users (email, password, first_name, last_name, phone, role, status, organization_id) VALUES
-- Super Admin
('admin@gym.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'Super', 'Admin', '+1-555-1001', 'super_admin', 'active', NULL),

-- Admins
('admin@fitnesspro.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'John', 'Smith', '+1-555-1002', 'admin', 'active', 1),
('admin@powerhouse.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'Sarah', 'Johnson', '+1-555-1003', 'admin', 'active', 2),

-- Trainers
('trainer1@fitnesspro.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'Mike', 'Wilson', '+1-555-1004', 'trainer', 'active', 1),
('trainer2@fitnesspro.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'Emily', 'Brown', '+1-555-1005', 'trainer', 'active', 1),
('trainer1@powerhouse.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'David', 'Lee', '+1-555-1006', 'trainer', 'active', 2),

-- Members
('member1@example.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'Alice', 'Anderson', '+1-555-2001', 'member', 'active', 1),
('member2@example.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'Bob', 'Martinez', '+1-555-2002', 'member', 'active', 1),
('member3@example.com', '$2b$10$rZ5YhkW8jJ5YhkW8jJ5YhOqK5YhkW8jJ5YhkW8jJ5YhkW8jJ5YhkW8', 'Carol', 'Davis', '+1-555-2003', 'member', 'active', 2);

-- ============================================
-- 3. MEMBERS
-- ============================================
INSERT INTO members (first_name, last_name, email, phone, date_of_birth, gender, address, emergency_contact, emergency_phone, organization_id, status) VALUES
('Alice', 'Anderson', 'alice.anderson@example.com', '+1-555-2001', '1990-05-15', 'female', '100 Park Ave, New York, NY', 'John Anderson', '+1-555-2011', 1, 'active'),
('Bob', 'Martinez', 'bob.martinez@example.com', '+1-555-2002', '1985-08-22', 'male', '200 Broadway, New York, NY', 'Maria Martinez', '+1-555-2012', 1, 'active'),
('Carol', 'Davis', 'carol.davis@example.com', '+1-555-2003', '1992-03-10', 'female', '300 Sunset Blvd, Los Angeles, CA', 'Tom Davis', '+1-555-2013', 2, 'active'),
('David', 'Wilson', 'david.wilson@example.com', '+1-555-2004', '1988-11-30', 'male', '400 Michigan Ave, Chicago, IL', 'Lisa Wilson', '+1-555-2014', 3, 'active'),
('Emma', 'Taylor', 'emma.taylor@example.com', '+1-555-2005', '1995-07-18', 'female', '500 Fifth Ave, New York, NY', 'James Taylor', '+1-555-2015', 1, 'active'),
('Frank', 'Moore', 'frank.moore@example.com', '+1-555-2006', '1987-12-05', 'male', '600 Hollywood Blvd, Los Angeles, CA', 'Nancy Moore', '+1-555-2016', 2, 'active'),
('Grace', 'White', 'grace.white@example.com', '+1-555-2007', '1993-09-25', 'female', '700 State St, Chicago, IL', 'Robert White', '+1-555-2017', 3, 'active'),
('Henry', 'Clark', 'henry.clark@example.com', '+1-555-2008', '1991-04-12', 'male', '800 Madison Ave, New York, NY', 'Susan Clark', '+1-555-2018', 1, 'active');

-- ============================================
-- 4. PLANS
-- ============================================
INSERT INTO plans (name, description, price, duration, features, organization_id, is_active) VALUES
-- Fitness Pro Gym Plans
('Basic Monthly', 'Access to gym equipment during off-peak hours', 29.99, 30, '["Gym access", "Locker room", "Off-peak hours"]', 1, true),
('Premium Monthly', 'Full access to all facilities and classes', 59.99, 30, '["24/7 gym access", "All classes", "Locker room", "Sauna", "Personal trainer consultation"]', 1, true),
('Annual Premium', 'Full year access with 2 months free', 599.99, 365, '["24/7 gym access", "All classes", "Locker room", "Sauna", "Monthly personal training session", "Nutrition consultation"]', 1, true),

-- PowerHouse Fitness Plans
('Strength Training', 'Focus on strength and muscle building', 49.99, 30, '["Gym access", "Strength training area", "Personal training session"]', 2, true),
('Elite Bodybuilding', 'Advanced bodybuilding program', 89.99, 30, '["24/7 access", "Personal trainer", "Nutrition plan", "Supplement discount"]', 2, true),

-- Yoga & Wellness Center Plans
('Yoga Basic', 'Unlimited yoga classes', 39.99, 30, '["Unlimited yoga classes", "Meditation sessions", "Locker room"]', 3, true),
('Wellness Complete', 'Complete wellness package', 79.99, 30, '["Unlimited classes", "Meditation", "Massage therapy", "Nutrition consultation"]', 3, true);

-- ============================================
-- 5. MEMBERSHIPS
-- ============================================
INSERT INTO memberships (member_id, plan_id, organization_id, start_date, end_date, status) VALUES
(1, 2, 1, '2024-01-01', '2024-01-31', 'active'),
(2, 1, 1, '2024-01-15', '2024-02-14', 'active'),
(3, 4, 2, '2024-01-10', '2024-02-09', 'active'),
(4, 6, 3, '2024-01-05', '2024-02-04', 'active'),
(5, 3, 1, '2024-01-01', '2024-12-31', 'active'),
(6, 5, 2, '2024-01-20', '2024-02-19', 'active'),
(7, 7, 3, '2024-01-12', '2024-02-11', 'active'),
(8, 2, 1, '2023-12-01', '2023-12-31', 'expired');

-- ============================================
-- 6. TRANSACTIONS
-- ============================================
INSERT INTO transactions (member_id, membership_id, organization_id, amount, type, status, payment_method, transaction_date) VALUES
(1, 1, 1, 59.99, 'membership', 'completed', 'credit_card', '2024-01-01 10:00:00'),
(2, 2, 1, 29.99, 'membership', 'completed', 'debit_card', '2024-01-15 14:30:00'),
(3, 3, 2, 49.99, 'membership', 'completed', 'credit_card', '2024-01-10 09:15:00'),
(4, 4, 3, 39.99, 'membership', 'completed', 'cash', '2024-01-05 11:45:00'),
(5, 5, 1, 599.99, 'membership', 'completed', 'credit_card', '2024-01-01 16:20:00'),
(6, 6, 2, 89.99, 'membership', 'completed', 'debit_card', '2024-01-20 13:00:00'),
(7, 7, 3, 79.99, 'membership', 'completed', 'credit_card', '2024-01-12 10:30:00'),
(8, 8, 1, 59.99, 'renewal', 'completed', 'credit_card', '2023-12-01 15:00:00');

-- ============================================
-- 7. ATTENDANCE DEVICES
-- ============================================
INSERT INTO attendance_devices (name, location, type, organization_id, is_active) VALUES
('Main Entrance Scanner', 'Main Entrance', 'RFID', 1, true),
('Gym Floor Scanner', 'Gym Floor', 'RFID', 1, true),
('Front Desk Terminal', 'Reception', 'Manual', 2, true),
('Locker Room Scanner', 'Locker Room', 'RFID', 2, true),
('Studio Entrance', 'Yoga Studio', 'QR Code', 3, true);

-- ============================================
-- 8. ATTENDANCE LOGS
-- ============================================
INSERT INTO attendance_logs (member_id, device_id, organization_id, check_in_time, check_out_time, duration) VALUES
(1, 1, 1, '2024-02-10 08:00:00', '2024-02-10 09:30:00', 90),
(1, 1, 1, '2024-02-11 08:15:00', '2024-02-11 09:45:00', 90),
(2, 1, 1, '2024-02-10 18:00:00', '2024-02-10 19:15:00', 75),
(2, 1, 1, '2024-02-12 18:30:00', '2024-02-12 19:45:00', 75),
(3, 3, 2, '2024-02-10 07:00:00', '2024-02-10 08:30:00', 90),
(3, 3, 2, '2024-02-11 07:15:00', '2024-02-11 09:00:00', 105),
(4, 5, 3, '2024-02-10 17:00:00', '2024-02-10 18:00:00', 60),
(5, 1, 1, '2024-02-10 06:00:00', '2024-02-10 07:30:00', 90),
(6, 3, 2, '2024-02-10 19:00:00', '2024-02-10 20:30:00', 90),
(7, 5, 3, '2024-02-10 10:00:00', '2024-02-10 11:00:00', 60);

-- ============================================
-- 9. PROGRESS
-- ============================================
INSERT INTO progress (member_id, organization_id, date, weight, body_fat_percentage, muscle_mass, bmi, measurements) VALUES
(1, 1, '2024-01-01', 65.5, 22.5, 48.2, 22.8, '{"chest": 90, "waist": 70, "hips": 95, "arms": 28}'),
(1, 1, '2024-02-01', 64.8, 21.8, 48.8, 22.5, '{"chest": 91, "waist": 68, "hips": 94, "arms": 29}'),
(2, 1, '2024-01-15', 82.0, 18.5, 65.5, 25.2, '{"chest": 105, "waist": 85, "hips": 100, "arms": 35}'),
(3, 2, '2024-01-10', 75.5, 25.0, 55.0, 24.8, '{"chest": 95, "waist": 80, "hips": 98, "arms": 32}'),
(4, 3, '2024-01-05', 58.0, 20.0, 45.0, 21.5, '{"chest": 85, "waist": 65, "hips": 90, "arms": 26}'),
(5, 1, '2024-01-01', 70.0, 19.5, 55.5, 23.5, '{"chest": 98, "waist": 75, "hips": 96, "arms": 30}');

-- ============================================
-- 10. EXERCISES
-- ============================================
INSERT INTO exercises (name, description, category, muscle_group, equipment, difficulty, instructions, video_url) VALUES
('Barbell Squat', 'Compound lower body exercise', 'Strength', 'Legs', 'Barbell', 'intermediate', '["Stand with feet shoulder-width apart", "Place barbell on upper back", "Lower body by bending knees", "Push through heels to return"]', 'https://example.com/squat.mp4'),
('Bench Press', 'Upper body pushing exercise', 'Strength', 'Chest', 'Barbell', 'intermediate', '["Lie on bench", "Grip barbell slightly wider than shoulders", "Lower bar to chest", "Press up to starting position"]', 'https://example.com/bench.mp4'),
('Deadlift', 'Full body compound exercise', 'Strength', 'Back', 'Barbell', 'advanced', '["Stand with feet hip-width apart", "Bend and grip barbell", "Keep back straight", "Lift by extending hips and knees"]', 'https://example.com/deadlift.mp4'),
('Pull-ups', 'Upper body pulling exercise', 'Strength', 'Back', 'Pull-up Bar', 'intermediate', '["Hang from bar with overhand grip", "Pull body up until chin over bar", "Lower with control"]', 'https://example.com/pullups.mp4'),
('Plank', 'Core stability exercise', 'Core', 'Abs', 'Bodyweight', 'beginner', '["Start in push-up position", "Lower to forearms", "Keep body straight", "Hold position"]', 'https://example.com/plank.mp4'),
('Running', 'Cardiovascular exercise', 'Cardio', 'Full Body', 'Treadmill', 'beginner', '["Start with warm-up walk", "Gradually increase speed", "Maintain steady pace", "Cool down with walk"]', 'https://example.com/running.mp4'),
('Dumbbell Shoulder Press', 'Shoulder strength exercise', 'Strength', 'Shoulders', 'Dumbbells', 'intermediate', '["Sit with back support", "Hold dumbbells at shoulder height", "Press overhead", "Lower with control"]', 'https://example.com/shoulder-press.mp4'),
('Leg Press', 'Lower body machine exercise', 'Strength', 'Legs', 'Leg Press Machine', 'beginner', '["Sit in machine", "Place feet on platform", "Push platform away", "Return with control"]', 'https://example.com/leg-press.mp4'),
('Bicep Curls', 'Arm isolation exercise', 'Strength', 'Arms', 'Dumbbells', 'beginner', '["Stand with dumbbells", "Keep elbows at sides", "Curl weights up", "Lower with control"]', 'https://example.com/bicep-curls.mp4'),
('Yoga Sun Salutation', 'Full body yoga flow', 'Flexibility', 'Full Body', 'Yoga Mat', 'beginner', '["Start in mountain pose", "Flow through poses", "Coordinate with breath", "Return to start"]', 'https://example.com/sun-salutation.mp4');

-- ============================================
-- 11. WORKOUT PROGRAMS
-- ============================================
INSERT INTO workout_programs (name, description, member_id, trainer_id, organization_id, start_date, end_date, status, goal) VALUES
('Beginner Strength Program', '8-week strength building program', 1, 4, 1, '2024-01-01', '2024-02-26', 'active', 'Build foundational strength'),
('Weight Loss Program', '12-week fat loss program', 2, 4, 1, '2024-01-15', '2024-04-08', 'active', 'Lose 10kg body fat'),
('Bodybuilding Bulk', 'Muscle mass building program', 3, 6, 2, '2024-01-10', '2024-04-10', 'active', 'Gain 5kg muscle mass'),
('Yoga Flexibility', '6-week flexibility improvement', 4, NULL, 3, '2024-01-05', '2024-02-16', 'active', 'Improve flexibility and balance'),
('Advanced Strength', 'Advanced powerlifting program', 5, 5, 1, '2024-01-01', '2024-03-31', 'active', 'Increase max lifts by 20%');

-- ============================================
-- 12. WORKOUT PROGRAM EXERCISES
-- ============================================
INSERT INTO workout_program_exercises (program_id, exercise_id, sets, reps, target_weight, rest_time, day_of_week, order_index) VALUES
-- Beginner Strength Program
(1, 1, 3, 10, 60.0, 90, 'Monday', 1),
(1, 2, 3, 10, 50.0, 90, 'Monday', 2),
(1, 5, 3, 30, 0, 60, 'Monday', 3),
(1, 3, 3, 8, 80.0, 120, 'Wednesday', 1),
(1, 4, 3, 8, 0, 90, 'Wednesday', 2),
(1, 8, 3, 12, 100.0, 60, 'Friday', 1),
(1, 9, 3, 12, 10.0, 60, 'Friday', 2),

-- Weight Loss Program
(2, 6, 1, 20, 0, 0, 'Monday', 1),
(2, 5, 3, 45, 0, 30, 'Monday', 2),
(2, 6, 1, 20, 0, 0, 'Wednesday', 1),
(2, 8, 3, 15, 80.0, 45, 'Wednesday', 2),
(2, 6, 1, 30, 0, 0, 'Friday', 1),

-- Bodybuilding Bulk
(3, 1, 5, 5, 120.0, 180, 'Monday', 1),
(3, 2, 5, 5, 100.0, 180, 'Wednesday', 1),
(3, 3, 5, 5, 140.0, 180, 'Friday', 1),

-- Yoga Flexibility
(4, 10, 3, 5, 0, 30, 'Tuesday', 1),
(4, 10, 3, 5, 0, 30, 'Thursday', 1),
(4, 10, 3, 5, 0, 30, 'Saturday', 1);

-- ============================================
-- 13. WORKOUT LOGS
-- ============================================
INSERT INTO workout_logs (member_id, program_id, organization_id, date, duration, notes, ai_summary) VALUES
(1, 1, 1, '2024-02-10', 60, 'Great workout, felt strong', 'Good form on squats, maintain depth'),
(1, 1, 1, '2024-02-12', 65, 'Increased weight on bench press', 'Excellent progression, keep it up'),
(2, 2, 1, '2024-02-10', 45, 'Cardio was tough today', 'Heart rate in optimal zone'),
(3, 3, 2, '2024-02-10', 90, 'Heavy lifting day', 'Strong performance on all lifts'),
(4, 4, 3, '2024-02-10', 60, 'Feeling more flexible', 'Noticeable improvement in poses'),
(5, 5, 1, '2024-02-10', 75, 'New PR on deadlift!', 'Excellent form and power');

-- ============================================
-- 14. WORKOUT LOG SETS
-- ============================================
INSERT INTO workout_log_sets (workout_log_id, exercise_id, set_number, reps, weight, rest_time) VALUES
-- Workout 1 (Member 1)
(1, 1, 1, 10, 60.0, 90),
(1, 1, 2, 10, 60.0, 90),
(1, 1, 3, 10, 60.0, 90),
(1, 2, 1, 10, 50.0, 90),
(1, 2, 2, 10, 50.0, 90),
(1, 2, 3, 9, 50.0, 90),

-- Workout 2 (Member 1)
(2, 2, 1, 10, 52.5, 90),
(2, 2, 2, 10, 52.5, 90),
(2, 2, 3, 10, 52.5, 90),

-- Workout 3 (Member 2)
(3, 6, 1, 20, 0, 0),

-- Workout 4 (Member 3)
(4, 1, 1, 5, 120.0, 180),
(4, 1, 2, 5, 120.0, 180),
(4, 1, 3, 5, 120.0, 180),
(4, 1, 4, 5, 120.0, 180),
(4, 1, 5, 5, 120.0, 180);

-- ============================================
-- 15. AI EXERCISE ANALYSIS
-- ============================================
INSERT INTO ai_exercise_analysis (member_id, exercise_id, workout_log_id, organization_id, form_score, feedback, improvements) VALUES
(1, 1, 1, 1, 85.5, 'Good squat depth and knee tracking. Keep chest up throughout the movement.', '["Maintain neutral spine", "Push knees out more", "Control descent speed"]'),
(1, 2, 2, 1, 90.0, 'Excellent bench press form. Bar path is optimal.', '["Maintain leg drive", "Keep shoulders retracted"]'),
(3, 1, 4, 2, 92.5, 'Outstanding squat form. Perfect depth and control.', '["Continue current form"]'),
(5, 3, 6, 1, 88.0, 'Strong deadlift. Minor rounding in lower back at max weight.', '["Engage core more", "Start with hips slightly higher"]');

-- ============================================
-- 16. AI INSIGHTS
-- ============================================
INSERT INTO ai_insights (member_id, organization_id, type, title, content, priority, is_read) VALUES
(1, 1, 'progress', 'Great Progress!', 'You have increased your squat weight by 15% this month. Keep up the excellent work!', 'high', false),
(1, 1, 'recommendation', 'Add Mobility Work', 'Consider adding hip mobility exercises to improve squat depth and prevent injury.', 'medium', false),
(2, 1, 'achievement', 'Consistency Streak', 'You have attended the gym 12 days in a row! Excellent consistency.', 'high', false),
(3, 2, 'progress', 'Strength Gains', 'Your deadlift has improved by 20kg in the last 4 weeks. Outstanding progress!', 'high', false),
(4, 3, 'recommendation', 'Try Advanced Poses', 'Based on your progress, you are ready to try intermediate yoga poses.', 'medium', false),
(5, 1, 'warning', 'Recovery Needed', 'You have trained 6 days straight. Consider taking a rest day to optimize recovery.', 'high', false);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
DECLARE
    org_count INTEGER;
    user_count INTEGER;
    member_count INTEGER;
    plan_count INTEGER;
    membership_count INTEGER;
    transaction_count INTEGER;
    exercise_count INTEGER;
    workout_program_count INTEGER;
    attendance_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO org_count FROM organizations;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO member_count FROM members;
    SELECT COUNT(*) INTO plan_count FROM plans;
    SELECT COUNT(*) INTO membership_count FROM memberships;
    SELECT COUNT(*) INTO transaction_count FROM transactions;
    SELECT COUNT(*) INTO exercise_count FROM exercises;
    SELECT COUNT(*) INTO workout_program_count FROM workout_programs;
    SELECT COUNT(*) INTO attendance_count FROM attendance_logs;
    
    RAISE NOTICE '✅ Seed data inserted successfully!';
    RAISE NOTICE '📊 Data Summary:';
    RAISE NOTICE '   - Organizations: %', org_count;
    RAISE NOTICE '   - Users: %', user_count;
    RAISE NOTICE '   - Members: %', member_count;
    RAISE NOTICE '   - Plans: %', plan_count;
    RAISE NOTICE '   - Memberships: %', membership_count;
    RAISE NOTICE '   - Transactions: %', transaction_count;
    RAISE NOTICE '   - Exercises: %', exercise_count;
    RAISE NOTICE '   - Workout Programs: %', workout_program_count;
    RAISE NOTICE '   - Attendance Logs: %', attendance_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Default Login Credentials:';
    RAISE NOTICE '   Super Admin: admin@gym.com / Password123';
    RAISE NOTICE '   Admin: admin@fitnesspro.com / Password123';
    RAISE NOTICE '   Trainer: trainer1@fitnesspro.com / Password123';
    RAISE NOTICE '   Member: member1@example.com / Password123';
END $$;
