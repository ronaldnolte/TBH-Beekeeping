-- =====================================================
-- COMPLETE RESET & REBUILD OF DEV DATABASE
-- =====================================================
-- ⚠️ WARNING: THIS WILL DELETE ALL DATA IN THE DATABASE ⚠️
-- =====================================================
-- This script:
-- 1. Drops all existing tables and functions
-- 2. Recreates the schema with CORRECT definitions (including User Tasks)
-- 3. Applies the correct Production-style RLS policies
-- 
-- Run this in: DEV Supabase SQL Editor
-- =====================================================

-- 1. CLEANUP (Drop everything)
DROP TABLE IF EXISTS weather_forecasts CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS interventions CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS hive_snapshots CASCADE;
DROP TABLE IF EXISTS hives CASCADE;
DROP TABLE IF EXISTS apiaries CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS check_hive_access CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- 2. CREATE TABLES

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apiaries
CREATE TABLE apiaries (
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

-- Hives
CREATE TABLE hives (
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

-- Hive Snapshots
CREATE TABLE hive_snapshots (
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

-- Inspections
CREATE TABLE inspections (
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

-- Interventions
CREATE TABLE interventions (
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

-- Tasks (FIXED SCHEMA: Allows 'user' scope and NULL apiary_id)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope TEXT NOT NULL CHECK (scope IN ('hive', 'apiary', 'user')),
    apiary_id UUID REFERENCES apiaries(id) ON DELETE CASCADE, -- Nullable for user tasks
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

-- Weather Forecasts
CREATE TABLE weather_forecasts (
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

-- 3. ENABLE RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;
ALTER TABLE hive_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_forecasts ENABLE ROW LEVEL SECURITY;

-- 4. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION check_hive_access(hive_id_input uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM hives h
    JOIN apiaries a ON a.id = h.apiary_id
    WHERE h.id = hive_id_input
    AND a.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- 5. RLS POLICIES

-- Users
CREATE POLICY "Users can insert own profile on signup" ON users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid());

-- Apiaries
CREATE POLICY "Users can all on own apiaries" ON apiaries FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Hives
CREATE POLICY "Users manage hives in own apiaries" ON hives FOR ALL
USING (check_hive_access(id));

-- Snapshots
CREATE POLICY "Users manage snapshots in own hives" ON hive_snapshots FOR ALL
USING (check_hive_access(hive_id));

-- Inspections
CREATE POLICY "Users manage inspections in own hives" ON inspections FOR ALL
USING (check_hive_access(hive_id));

-- Interventions
CREATE POLICY "Users manage interventions in own hives" ON interventions FOR ALL
USING (check_hive_access(hive_id));

-- Tasks (FIXED POLICY: Supports user-scoped tasks)
CREATE POLICY "Users manage assigned tasks" ON tasks FOR ALL
USING (
    EXISTS (SELECT 1 FROM apiaries WHERE apiaries.id = tasks.apiary_id AND apiaries.user_id = auth.uid()) -- Owner
    OR assigned_user_id = auth.uid() -- Assigned User
)
WITH CHECK (
    EXISTS (SELECT 1 FROM apiaries WHERE apiaries.id = tasks.apiary_id AND apiaries.user_id = auth.uid()) -- Owner
    OR (tasks.apiary_id IS NULL AND assigned_user_id = auth.uid()) -- User Task
);

-- Weather
CREATE POLICY "Users manage weather in own apiaries" ON weather_forecasts FOR ALL
USING (EXISTS (SELECT 1 FROM apiaries WHERE apiaries.id = weather_forecasts.apiary_id AND apiaries.user_id = auth.uid()));

-- 6. TRIGGERS
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apiaries_updated_at BEFORE UPDATE ON apiaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hives_updated_at BEFORE UPDATE ON hives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hive_snapshots_updated_at BEFORE UPDATE ON hive_snapshots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- RESET COMPLETE
-- =====================================================
SELECT 'Dev database completely reset and rebuilt successfully!' as message;
