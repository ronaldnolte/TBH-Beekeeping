-- =====================================================
-- MIGRATION: ADD BANNED ROLE CHECK TO RLS POLICIES
-- =====================================================

-- 1. Helper Function to check if a user is banned
-- This avoids repeating the subquery in every policy
CREATE OR REPLACE FUNCTION public.is_banned()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'banned'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. UPDATE POLICIES
-- We drop and recreate policies to ensure they are updated cleanly.

-- --- APIARIES ---
DROP POLICY IF EXISTS "Users can all on own apiaries" ON public.apiaries;
CREATE POLICY "Users can all on own apiaries" ON public.apiaries FOR ALL
USING (
  auth.uid() = user_id 
  AND NOT public.is_banned()
)
WITH CHECK (
  auth.uid() = user_id 
  AND NOT public.is_banned()
);

-- --- HIVES ---
DROP POLICY IF EXISTS "Users manage hives in own apiaries" ON public.hives;
CREATE POLICY "Users manage hives in own apiaries" ON public.hives FOR ALL
USING (
  check_hive_access(id) 
  AND NOT public.is_banned()
)
WITH CHECK (
  check_hive_access(id) 
  AND NOT public.is_banned()
);

-- --- SNAPSHOTS ---
DROP POLICY IF EXISTS "Users manage snapshots in own hives" ON public.hive_snapshots;
CREATE POLICY "Users manage snapshots in own hives" ON public.hive_snapshots FOR ALL
USING (
  check_hive_access(hive_id) 
  AND NOT public.is_banned()
)
WITH CHECK (
  check_hive_access(hive_id) 
  AND NOT public.is_banned()
);

-- --- INSPECTIONS ---
DROP POLICY IF EXISTS "Users manage inspections in own hives" ON public.inspections;
CREATE POLICY "Users manage inspections in own hives" ON public.inspections FOR ALL
USING (
  check_hive_access(hive_id) 
  AND NOT public.is_banned()
)
WITH CHECK (
  check_hive_access(hive_id) 
  AND NOT public.is_banned()
);

-- --- INTERVENTIONS ---
DROP POLICY IF EXISTS "Users manage interventions in own hives" ON public.interventions;
CREATE POLICY "Users manage interventions in own hives" ON public.interventions FOR ALL
USING (
  check_hive_access(hive_id) 
  AND NOT public.is_banned()
)
WITH CHECK (
  check_hive_access(hive_id) 
  AND NOT public.is_banned()
);

-- --- TASKS ---
DROP POLICY IF EXISTS "Users manage assigned tasks" ON public.tasks;
CREATE POLICY "Users manage assigned tasks" ON public.tasks FOR ALL
USING (
  (
    EXISTS (SELECT 1 FROM apiaries WHERE apiaries.id = tasks.apiary_id AND apiaries.user_id = auth.uid()) 
    OR assigned_user_id = auth.uid()
  )
  AND NOT public.is_banned()
)
WITH CHECK (
  (
    EXISTS (SELECT 1 FROM apiaries WHERE apiaries.id = tasks.apiary_id AND apiaries.user_id = auth.uid()) -- Owner
    OR (tasks.apiary_id IS NULL AND assigned_user_id = auth.uid()) -- User Task
  )
  AND NOT public.is_banned()
);

-- --- WEATHER ---
DROP POLICY IF EXISTS "Users manage weather in own apiaries" ON public.weather_forecasts;
CREATE POLICY "Users manage weather in own apiaries" ON public.weather_forecasts FOR ALL
USING (
  EXISTS (SELECT 1 FROM apiaries WHERE apiaries.id = weather_forecasts.apiary_id AND apiaries.user_id = auth.uid())
  AND NOT public.is_banned()
);

-- --- MENTOR PROFILES ---
DROP POLICY IF EXISTS "Users manage own mentor profile" ON public.mentor_profiles;
CREATE POLICY "Users manage own mentor profile" ON public.mentor_profiles FOR ALL 
USING (
  auth.uid() = user_id
  AND NOT public.is_banned()
);

-- (Note: "Public can view mentor profiles" generally remains open, 
-- or we can choose to HIDE banned mentors from the public list too.
-- For now, we will HIDE them by updating the public view policy as well.)

DROP POLICY IF EXISTS "Public can view mentor profiles" ON public.mentor_profiles;
CREATE POLICY "Public can view mentor profiles" ON public.mentor_profiles FOR SELECT TO authenticated 
USING (
  -- Exclude profiles where the underlying user is banned
  NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = mentor_profiles.user_id 
    AND role = 'banned'
  )
);

SELECT 'Banned role checks applied successfully to all RLS policies.' as message;
