-- =====================================================
-- MIGRATE RLS POLICIES TO MATCH PRODUCTION
-- =====================================================
-- This script drops the old granular policies and replaces
-- them with simpler ALL policies that match production
-- 
-- Run this in: DEV Supabase SQL Editor
-- =====================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users can insert own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users can update own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users can delete own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users can view hives in own apiaries" ON hives;
DROP POLICY IF EXISTS "Users can insert hives in own apiaries" ON hives;
DROP POLICY IF EXISTS "Users can update hives in own apiaries" ON hives;
DROP POLICY IF EXISTS "Users can delete hives in own apiaries" ON hives;
DROP POLICY IF EXISTS "Users can view snapshots of own hives" ON hive_snapshots;
DROP POLICY IF EXISTS "Users can insert snapshots for own hives" ON hive_snapshots;
DROP POLICY IF EXISTS "Users can update snapshots of own hives" ON hive_snapshots;
DROP POLICY IF EXISTS "Users can delete snapshots of own hives" ON hive_snapshots;
DROP POLICY IF EXISTS "Users can view inspections of own hives" ON inspections;
DROP POLICY IF EXISTS "Users can insert inspections for own hives" ON inspections;
DROP POLICY IF EXISTS "Users can update inspections of own hives" ON inspections;
DROP POLICY IF EXISTS "Users can delete inspections of own hives" ON inspections;
DROP POLICY IF EXISTS "Users can view interventions of own hives" ON interventions;
DROP POLICY IF EXISTS "Users can insert interventions for own hives" ON interventions;
DROP POLICY IF EXISTS "Users can update interventions of own hives" ON interventions;
DROP POLICY IF EXISTS "Users can delete interventions of own hives" ON interventions;
DROP POLICY IF EXISTS "Users can view tasks for own apiaries" ON tasks;
DROP POLICY IF EXISTS "Users can insert tasks for own apiaries" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks for own apiaries" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks for own apiaries" ON tasks;
DROP POLICY IF EXISTS "Users can view weather for own apiaries" ON weather_forecasts;
DROP POLICY IF EXISTS "Users can insert weather for own apiaries" ON weather_forecasts;

-- Create new ALL policies matching production

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
-- DONE! Policies now match production
-- =====================================================

SELECT 'RLS policies migrated to production format!' as message;
