-- ============================================
-- Gym Management System - Database Schema
-- ============================================
-- Version: 1.0.0
-- Date: 2026-02-13
-- Description: Complete database schema for gym management system
-- ============================================

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS ai_insights CASCADE;
DROP TABLE IF EXISTS ai_exercise_analysis CASCADE;
DROP TABLE IF EXISTS workout_log_sets CASCADE;
DROP TABLE IF EXISTS workout_logs CASCADE;
DROP TABLE IF EXISTS workout_program_exercises CASCADE;
DROP TABLE IF EXISTS workout_programs CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS attendance_logs CASCADE;
DROP TABLE IF EXISTS attendance_devices CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- ============================================
-- 1. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_organizations_email ON organizations(email);

COMMENT ON TABLE organizations IS 'Gym/Organization information';
COMMENT ON COLUMN organizations.id IS 'Primary key';
COMMENT ON COLUMN organizations.name IS 'Organization name';

-- ============================================
-- 2. USERS TABLE (Authentication)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'trainer', 'member')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    organization_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,
    avatar VARCHAR(255),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

COMMENT ON TABLE users IS 'User accounts with authentication';
COMMENT ON COLUMN users.role IS 'User role: super_admin, admin, trainer, member';
COMMENT ON COLUMN users.status IS 'Account status: active, inactive, suspended';

-- ============================================
-- 3. MEMBERS TABLE
-- ============================================
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_organization ON members(organization_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_name ON members(first_name, last_name);

COMMENT ON TABLE members IS 'Gym members information';

-- ============================================
-- 4. PLANS TABLE
-- ============================================
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL,
    features JSONB,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_organization ON plans(organization_id);
CREATE INDEX idx_plans_active ON plans(is_active);
CREATE INDEX idx_plans_price ON plans(price);

COMMENT ON TABLE plans IS 'Membership plans';
COMMENT ON COLUMN plans.duration IS 'Duration in days';
COMMENT ON COLUMN plans.features IS 'JSON array of plan features';

-- ============================================
-- 5. MEMBERSHIPS TABLE
-- ============================================
CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES plans(id) ON DELETE SET NULL,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'cancelled', 'renewed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memberships_member ON memberships(member_id);
CREATE INDEX idx_memberships_plan ON memberships(plan_id);
CREATE INDEX idx_memberships_organization ON memberships(organization_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_dates ON memberships(start_date, end_date);

COMMENT ON TABLE memberships IS 'Active memberships';
COMMENT ON COLUMN memberships.status IS 'Membership status: active, expired, suspended, cancelled, renewed';

-- ============================================
-- 6. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    membership_id INTEGER REFERENCES memberships(id) ON DELETE SET NULL,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('membership', 'renewal', 'upgrade', 'refund')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_member ON transactions(member_id);
CREATE INDEX idx_transactions_membership ON transactions(membership_id);
CREATE INDEX idx_transactions_organization ON transactions(organization_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);

COMMENT ON TABLE transactions IS 'Payment transactions';
COMMENT ON COLUMN transactions.type IS 'Transaction type: membership, renewal, upgrade, refund';

-- ============================================
-- 7. ATTENDANCE DEVICES TABLE
-- ============================================
CREATE TABLE attendance_devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    type VARCHAR(50),
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_devices_organization ON attendance_devices(organization_id);
CREATE INDEX idx_attendance_devices_active ON attendance_devices(is_active);

COMMENT ON TABLE attendance_devices IS 'Attendance tracking devices';

-- ============================================
-- 8. ATTENDANCE LOGS TABLE
-- ============================================
CREATE TABLE attendance_logs (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES attendance_devices(id) ON DELETE SET NULL,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP,
    duration INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_logs_member ON attendance_logs(member_id);
CREATE INDEX idx_attendance_logs_device ON attendance_logs(device_id);
CREATE INDEX idx_attendance_logs_organization ON attendance_logs(organization_id);
CREATE INDEX idx_attendance_logs_check_in ON attendance_logs(check_in_time);
CREATE INDEX idx_attendance_logs_date ON attendance_logs(DATE(check_in_time));

COMMENT ON TABLE attendance_logs IS 'Member attendance records';
COMMENT ON COLUMN attendance_logs.duration IS 'Duration in minutes';

-- ============================================
-- 9. PROGRESS TABLE
-- ============================================
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5, 2),
    body_fat_percentage DECIMAL(5, 2),
    muscle_mass DECIMAL(5, 2),
    bmi DECIMAL(5, 2),
    measurements JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_member ON progress(member_id);
CREATE INDEX idx_progress_organization ON progress(organization_id);
CREATE INDEX idx_progress_date ON progress(date);

COMMENT ON TABLE progress IS 'Member progress tracking';
COMMENT ON COLUMN progress.measurements IS 'JSON object with body measurements (chest, waist, hips, etc.)';

-- ============================================
-- 10. EXERCISES TABLE
-- ============================================
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    muscle_group VARCHAR(50),
    equipment VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    instructions JSONB,
    video_url VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_name ON exercises(name);

COMMENT ON TABLE exercises IS 'Exercise library';
COMMENT ON COLUMN exercises.instructions IS 'JSON array of step-by-step instructions';

-- ============================================
-- 11. WORKOUT PROGRAMS TABLE
-- ============================================
CREATE TABLE workout_programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    trainer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    goal TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_programs_member ON workout_programs(member_id);
CREATE INDEX idx_workout_programs_trainer ON workout_programs(trainer_id);
CREATE INDEX idx_workout_programs_organization ON workout_programs(organization_id);
CREATE INDEX idx_workout_programs_status ON workout_programs(status);

COMMENT ON TABLE workout_programs IS 'Workout programs assigned to members';

-- ============================================
-- 12. WORKOUT PROGRAM EXERCISES TABLE
-- ============================================
CREATE TABLE workout_program_exercises (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES workout_programs(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    sets INTEGER,
    reps INTEGER,
    target_weight DECIMAL(6, 2),
    rest_time INTEGER,
    day_of_week VARCHAR(20),
    order_index INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_program_exercises_program ON workout_program_exercises(program_id);
CREATE INDEX idx_workout_program_exercises_exercise ON workout_program_exercises(exercise_id);
CREATE INDEX idx_workout_program_exercises_day ON workout_program_exercises(day_of_week);

COMMENT ON TABLE workout_program_exercises IS 'Exercises in workout programs';
COMMENT ON COLUMN workout_program_exercises.rest_time IS 'Rest time in seconds';

-- ============================================
-- 13. WORKOUT LOGS TABLE
-- ============================================
CREATE TABLE workout_logs (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES workout_programs(id) ON DELETE SET NULL,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    duration INTEGER,
    notes TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_logs_member ON workout_logs(member_id);
CREATE INDEX idx_workout_logs_program ON workout_logs(program_id);
CREATE INDEX idx_workout_logs_organization ON workout_logs(organization_id);
CREATE INDEX idx_workout_logs_date ON workout_logs(date);

COMMENT ON TABLE workout_logs IS 'Workout session logs';
COMMENT ON COLUMN workout_logs.duration IS 'Duration in minutes';

-- ============================================
-- 14. WORKOUT LOG SETS TABLE
-- ============================================
CREATE TABLE workout_log_sets (
    id SERIAL PRIMARY KEY,
    workout_log_id INTEGER REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight DECIMAL(6, 2),
    rest_time INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workout_log_sets_workout_log ON workout_log_sets(workout_log_id);
CREATE INDEX idx_workout_log_sets_exercise ON workout_log_sets(exercise_id);

COMMENT ON TABLE workout_log_sets IS 'Individual sets in workout logs';
COMMENT ON COLUMN workout_log_sets.rest_time IS 'Rest time in seconds';

-- ============================================
-- 15. AI EXERCISE ANALYSIS TABLE
-- ============================================
CREATE TABLE ai_exercise_analysis (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    workout_log_id INTEGER REFERENCES workout_logs(id) ON DELETE SET NULL,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    video_url VARCHAR(255),
    analysis_data JSONB,
    form_score DECIMAL(5, 2),
    feedback TEXT,
    improvements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_exercise_analysis_member ON ai_exercise_analysis(member_id);
CREATE INDEX idx_ai_exercise_analysis_exercise ON ai_exercise_analysis(exercise_id);
CREATE INDEX idx_ai_exercise_analysis_workout_log ON ai_exercise_analysis(workout_log_id);
CREATE INDEX idx_ai_exercise_analysis_organization ON ai_exercise_analysis(organization_id);

COMMENT ON TABLE ai_exercise_analysis IS 'AI-powered exercise form analysis';
COMMENT ON COLUMN ai_exercise_analysis.form_score IS 'Form score out of 100';

-- ============================================
-- 16. AI INSIGHTS TABLE
-- ============================================
CREATE TABLE ai_insights (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(50),
    title VARCHAR(255),
    content TEXT,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    is_read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_insights_member ON ai_insights(member_id);
CREATE INDEX idx_ai_insights_organization ON ai_insights(organization_id);
CREATE INDEX idx_ai_insights_type ON ai_insights(type);
CREATE INDEX idx_ai_insights_priority ON ai_insights(priority);
CREATE INDEX idx_ai_insights_read ON ai_insights(is_read);

COMMENT ON TABLE ai_insights IS 'AI-generated insights and recommendations';

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_devices_updated_at BEFORE UPDATE ON attendance_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_logs_updated_at BEFORE UPDATE ON attendance_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_programs_updated_at BEFORE UPDATE ON workout_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_program_exercises_updated_at BEFORE UPDATE ON workout_program_exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_logs_updated_at BEFORE UPDATE ON workout_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_log_sets_updated_at BEFORE UPDATE ON workout_log_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_exercise_analysis_updated_at BEFORE UPDATE ON ai_exercise_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON ai_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

-- Active memberships view
CREATE OR REPLACE VIEW active_memberships AS
SELECT 
    m.id,
    m.member_id,
    mem.first_name || ' ' || mem.last_name AS member_name,
    m.plan_id,
    p.name AS plan_name,
    m.start_date,
    m.end_date,
    m.status,
    m.organization_id,
    o.name AS organization_name
FROM memberships m
JOIN members mem ON m.member_id = mem.id
JOIN plans p ON m.plan_id = p.id
JOIN organizations o ON m.organization_id = o.id
WHERE m.status = 'active' AND m.end_date >= CURRENT_DATE;

-- Member attendance summary view
CREATE OR REPLACE VIEW member_attendance_summary AS
SELECT 
    m.id AS member_id,
    m.first_name || ' ' || m.last_name AS member_name,
    m.organization_id,
    COUNT(al.id) AS total_visits,
    MAX(al.check_in_time) AS last_visit,
    AVG(al.duration) AS avg_duration
FROM members m
LEFT JOIN attendance_logs al ON m.id = al.member_id
GROUP BY m.id, m.first_name, m.last_name, m.organization_id;

-- ============================================
-- GRANTS (Optional - adjust based on your needs)
-- ============================================

-- Grant permissions to application user (uncomment and modify as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gym_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO gym_app_user;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 Total tables: 16';
    RAISE NOTICE '📈 Total indexes: 50+';
    RAISE NOTICE '🔄 Total triggers: 16';
    RAISE NOTICE '👁️ Total views: 2';
END $$;
