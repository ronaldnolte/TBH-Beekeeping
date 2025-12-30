-- =====================================================
-- FIX DEV DATABASE POLICIES TO MATCH PRODUCTION
-- =====================================================
-- This script replaces incorrect policies with the exact
-- policies from production, including the check_hive_access function
-- 
-- Run this in: DEV Supabase SQL Editor ONLY
-- =====================================================

-- Step 1: Drop incorrect policies created earlier
DROP POLICY IF EXISTS "Users can all on own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Users manage hives in own apiaries" ON hives;
DROP POLICY IF EXISTS "Users manage snapshots in own hives" ON hive_snapshots;
DROP POLICY IF EXISTS "Users manage inspections in own hives" ON inspections;
DROP POLICY IF EXISTS "Users manage interventions in own hives" ON interventions;
DROP POLICY IF EXISTS "Users manage assigned tasks" ON tasks;

-- Step 2: Create the check_hive_access function (from production)
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

-- Step 3: Create policies matching production exactly
CREATE POLICY "Users can all on own apiaries"
ON apiaries FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage hives in own apiaries"
ON hives FOR ALL
USING (check_hive_access(id));

CREATE POLICY "Users manage snapshots in own hives"
ON hive_snapshots FOR ALL
USING (check_hive_access(hive_id));

CREATE POLICY "Users manage inspections in own hives"
ON inspections FOR ALL
USING (check_hive_access(hive_id));

CREATE POLICY "Users manage interventions in own hives"
ON interventions FOR ALL
USING (check_hive_access(hive_id));

CREATE POLICY "Users manage assigned tasks"
ON tasks FOR ALL
USING (
    -- User owns the apiary the task belongs to
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = tasks.apiary_id 
        AND apiaries.user_id = auth.uid()
    )
    -- OR task is assigned to user (for user-scoped tasks with null apiary_id)
    OR assigned_user_id = auth.uid()
)
WITH CHECK (
    -- Can create tasks for apiaries they own
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = tasks.apiary_id 
        AND apiaries.user_id = auth.uid()
    )
    -- OR can create user-scoped tasks (null apiary_id) if assigned to themselves
    OR (tasks.apiary_id IS NULL AND assigned_user_id = auth.uid())
);

-- =====================================================
-- DONE - Policies now match production
-- =====================================================

SELECT 'Dev policies fixed to match production!' as message;
