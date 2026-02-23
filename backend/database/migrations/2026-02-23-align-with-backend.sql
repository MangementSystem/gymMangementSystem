-- Align existing database schema with current backend entities (non-destructive).
-- Date: 2026-02-23

BEGIN;

-- organizations
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS owner_id INTEGER;

-- members
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS join_date DATE,
  ADD COLUMN IF NOT EXISTS goal VARCHAR(255),
  ADD COLUMN IF NOT EXISTS weight NUMERIC,
  ADD COLUMN IF NOT EXISTS height NUMERIC,
  ADD COLUMN IF NOT EXISTS ai_profile JSONB;

UPDATE members
SET birth_date = date_of_birth
WHERE birth_date IS NULL
  AND date_of_birth IS NOT NULL;

-- plans
ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS duration_days INTEGER;

UPDATE plans
SET duration_days = duration
WHERE duration_days IS NULL
  AND duration IS NOT NULL;

-- memberships
ALTER TABLE memberships
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_amount NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC NOT NULL DEFAULT 0;

-- transactions
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS category VARCHAR(255),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS currency VARCHAR(16);

UPDATE transactions
SET description = notes
WHERE description IS NULL
  AND notes IS NOT NULL;

-- attendance_devices
ALTER TABLE attendance_devices
  ADD COLUMN IF NOT EXISTS serial_number VARCHAR(255),
  ADD COLUMN IF NOT EXISTS ip_address VARCHAR(255),
  ADD COLUMN IF NOT EXISTS status VARCHAR(64);

UPDATE attendance_devices
SET status = CASE
  WHEN is_active = TRUE THEN 'active'
  WHEN is_active = FALSE THEN 'inactive'
  ELSE status
END
WHERE status IS NULL;

-- attendance_logs
ALTER TABLE attendance_logs
  ADD COLUMN IF NOT EXISTS check_in TIMESTAMP,
  ADD COLUMN IF NOT EXISTS check_out TIMESTAMP,
  ADD COLUMN IF NOT EXISTS status VARCHAR(64);

UPDATE attendance_logs
SET check_in = check_in_time
WHERE check_in IS NULL
  AND check_in_time IS NOT NULL;

UPDATE attendance_logs
SET check_out = check_out_time
WHERE check_out IS NULL
  AND check_out_time IS NOT NULL;

-- progress
ALTER TABLE progress
  ADD COLUMN IF NOT EXISTS body_fat NUMERIC,
  ADD COLUMN IF NOT EXISTS ai_feedback TEXT;

UPDATE progress
SET body_fat = body_fat_percentage
WHERE body_fat IS NULL
  AND body_fat_percentage IS NOT NULL;

UPDATE progress
SET ai_feedback = notes
WHERE ai_feedback IS NULL
  AND notes IS NOT NULL;

-- exercises
ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- keep existing values but align expected type used by backend
ALTER TABLE exercises
  ALTER COLUMN instructions TYPE TEXT
  USING instructions::TEXT;

-- workout_log_sets
ALTER TABLE workout_log_sets
  ADD COLUMN IF NOT EXISTS rpe NUMERIC;

-- ai_exercise_analysis
ALTER TABLE ai_exercise_analysis
  ADD COLUMN IF NOT EXISTS posture_score NUMERIC,
  ADD COLUMN IF NOT EXISTS stability_score NUMERIC,
  ADD COLUMN IF NOT EXISTS movement_efficiency NUMERIC,
  ADD COLUMN IF NOT EXISTS risk_level VARCHAR(64),
  ADD COLUMN IF NOT EXISTS detected_errors JSONB,
  ADD COLUMN IF NOT EXISTS recommended_fix TEXT;

UPDATE ai_exercise_analysis
SET posture_score = form_score
WHERE posture_score IS NULL
  AND form_score IS NOT NULL;

UPDATE ai_exercise_analysis
SET detected_errors = analysis_data
WHERE detected_errors IS NULL
  AND analysis_data IS NOT NULL;

UPDATE ai_exercise_analysis
SET recommended_fix = feedback
WHERE recommended_fix IS NULL
  AND feedback IS NOT NULL;

-- ai_insights
ALTER TABLE ai_insights
  ADD COLUMN IF NOT EXISTS category VARCHAR(128),
  ADD COLUMN IF NOT EXISTS input_data JSONB,
  ADD COLUMN IF NOT EXISTS ai_recommendation TEXT,
  ADD COLUMN IF NOT EXISTS predicted_goal_date DATE,
  ADD COLUMN IF NOT EXISTS risk_alert TEXT;

UPDATE ai_insights
SET category = type
WHERE category IS NULL
  AND type IS NOT NULL;

UPDATE ai_insights
SET input_data = metadata
WHERE input_data IS NULL
  AND metadata IS NOT NULL;

UPDATE ai_insights
SET ai_recommendation = content
WHERE ai_recommendation IS NULL
  AND content IS NOT NULL;

COMMIT;
