-- =====================================================
-- DEV DATABASE SETUP SCRIPT
-- =====================================================
-- This script recreates your production database schema
-- in your new dev Supabase project
-- 
-- Run this in: DEV Supabase SQL Editor
-- Project: https://wrdnwzgztwzoigkoebeq.supabase.co
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apiaries table
CREATE TABLE IF NOT EXISTS apiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hives table
CREATE TABLE IF NOT EXISTS hives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apiary_id UUID NOT NULL REFERENCES apiaries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bar_count INTEGER NOT NULL DEFAULT 24,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    bars JSONB,
    last_inspection_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hive Snapshots table
CREATE TABLE IF NOT EXISTS hive_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    bars JSONB NOT NULL,
    inactive_bar_count INTEGER DEFAULT 0,
    active_bar_count INTEGER DEFAULT 0,
    empty_bar_count INTEGER DEFAULT 0,
    brood_bar_count INTEGER DEFAULT 0,
    resource_bar_count INTEGER DEFAULT 0,
    follower_board_position INTEGER,
    weather JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspections table
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    queen_status TEXT NOT NULL,
    brood_pattern TEXT,
    population_strength TEXT,
    temperament TEXT,
    honey_stores TEXT,
    pollen_stores TEXT,
    observations TEXT,
    snapshot_id UUID REFERENCES hive_snapshots(id) ON DELETE SET NULL,
    weather JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interventions table
CREATE TABLE IF NOT EXISTS interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    inspection_id UUID REFERENCES inspections(id) ON DELETE SET NULL,
    weather JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope TEXT NOT NULL CHECK (scope IN ('hive', 'apiary')),
    apiary_id UUID NOT NULL REFERENCES apiaries(id) ON DELETE CASCADE,
    hive_id UUID REFERENCES hives(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Weather Forecasts table (if used)
CREATE TABLE IF NOT EXISTS weather_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apiary_id UUID NOT NULL REFERENCES apiaries(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    temperature_high NUMERIC,
    temperature_low NUMERIC,
    conditions TEXT,
    wind_speed NUMERIC,
    precipitation_chance NUMERIC,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(apiary_id, forecast_date)
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_apiaries_user_id ON apiaries(user_id);
CREATE INDEX IF NOT EXISTS idx_hives_apiary_id ON hives(apiary_id);
CREATE INDEX IF NOT EXISTS idx_hive_snapshots_hive_id ON hive_snapshots(hive_id);
CREATE INDEX IF NOT EXISTS idx_hive_snapshots_timestamp ON hive_snapshots(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_hive_id ON inspections(hive_id);
CREATE INDEX IF NOT EXISTS idx_inspections_timestamp ON inspections(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_interventions_hive_id ON interventions(hive_id);
CREATE INDEX IF NOT EXISTS idx_interventions_timestamp ON interventions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_apiary_id ON tasks(apiary_id);
CREATE INDEX IF NOT EXISTS idx_tasks_hive_id ON tasks(hive_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_user ON tasks(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_weather_forecasts_apiary_id ON weather_forecasts(apiary_id);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;
ALTER TABLE hive_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_forecasts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES
-- =====================================================
-- These policies match production's approach using ALL operations
-- instead of separate SELECT/INSERT/UPDATE/DELETE policies

-- Apiaries policies
CREATE POLICY "Users can all on own apiaries"
ON apiaries FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Hives policies
CREATE POLICY "Users manage hives in own apiaries"
ON hives FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = hives.apiary_id 
        AND apiaries.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = hives.apiary_id 
        AND apiaries.user_id = auth.uid()
    )
);

-- Hive Snapshots policies
CREATE POLICY "Users manage snapshots in own hives"
ON hive_snapshots FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = hive_snapshots.hive_id
        AND a.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = hive_snapshots.hive_id
        AND a.user_id = auth.uid()
    )
);

-- Inspections policies
CREATE POLICY "Users manage inspections in own hives"
ON inspections FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = inspections.hive_id
        AND a.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = inspections.hive_id
        AND a.user_id = auth.uid()
    )
);

-- Interventions policies
CREATE POLICY "Users manage interventions in own hives"
ON interventions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = interventions.hive_id
        AND a.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = interventions.hive_id
        AND a.user_id = auth.uid()
    )
);

-- Tasks policies
CREATE POLICY "Users manage assigned tasks"
ON tasks FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = tasks.apiary_id 
        AND apiaries.user_id = auth.uid()
    )
    OR assigned_user_id = auth.uid()
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = tasks.apiary_id 
        AND apiaries.user_id = auth.uid()
    )
);

-- =====================================================
-- 5. CREATE UPDATED_AT TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apiaries_updated_at BEFORE UPDATE ON apiaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hives_updated_at BEFORE UPDATE ON hives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hive_snapshots_updated_at BEFORE UPDATE ON hive_snapshots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. AUTO-CREATE USER RECORD ON SIGNUP
-- =====================================================

-- Create function to handle new user signup
-- This automatically creates a record in public.users when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'display_name',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add policy to allow user creation on signup
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON users;
CREATE POLICY "Users can insert own profile on signup"
ON users FOR INSERT
WITH CHECK (id = auth.uid());

-- =====================================================
-- 7. INSERT TEST DATA (OPTIONAL)
-- =====================================================

-- Uncomment this section if you want some test data in dev

/*
-- Create test user
INSERT INTO users (id, email, display_name) VALUES 
('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User');

-- Create test apiary
INSERT INTO apiaries (id, user_id, name, zip_code) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Test Backyard', '12345');

-- Create test hive
INSERT INTO hives (id, apiary_id, name, bar_count) VALUES
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Hive 1', 24);
*/

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

SELECT 'Dev database schema setup complete!' as message;
