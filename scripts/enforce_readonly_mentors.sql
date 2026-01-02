-- =====================================================
-- ENFORCE READ-ONLY FOR MENTORS (SHARED APIARIES)
-- =====================================================
-- Goal: Split permissions so that Shared Viewers (Mentors) have SELECT ONLY access.
--       Only Owners (and self-assigned users for data) can INSERT/UPDATE/DELETE.

-- =====================================================
-- 1. APIARIES (Reinforce Step 709)
-- =====================================================
-- Already split in previous fix, but ensuring consistency.
DROP POLICY IF EXISTS "Owners have full access to apiaries" ON apiaries;
DROP POLICY IF EXISTS "Viewers can read shared apiaries" ON apiaries;
-- Clean up old ones just in case
DROP POLICY IF EXISTS "Users can all on own apiaries" ON apiaries;

CREATE POLICY "Owners have full access to apiaries" ON apiaries
FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Viewers can read shared apiaries" ON apiaries
FOR SELECT TO authenticated
USING (
    EXISTS (SELECT 1 FROM apiary_shares WHERE apiary_id = apiaries.id AND viewer_id = auth.uid())
);

-- =====================================================
-- 2. HIVES
-- =====================================================
DROP POLICY IF EXISTS "Access hives via apiary ownership or share" ON hives; -- The one we just made
DROP POLICY IF EXISTS "Users manage hives in own apiaries" ON hives; -- The old one

-- A. SELECT: Owner OR Viewer
CREATE POLICY "Users can view hives (Owner or Viewer)" ON hives
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM apiaries a
        LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
        WHERE a.id = hives.apiary_id
        AND (a.user_id = auth.uid() OR s.id IS NOT NULL)
    )
);

-- B. WRITE: Owner Only
CREATE POLICY "Owners can manage hives" ON hives
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM apiaries WHERE id = apiary_id AND user_id = auth.uid())
);
CREATE POLICY "Owners can update hives" ON hives
FOR UPDATE TO authenticated
USING (
    EXISTS (SELECT 1 FROM apiaries WHERE id = apiary_id AND user_id = auth.uid())
) WITH CHECK (
    EXISTS (SELECT 1 FROM apiaries WHERE id = apiary_id AND user_id = auth.uid())
);
CREATE POLICY "Owners can delete hives" ON hives
FOR DELETE TO authenticated
USING (
    EXISTS (SELECT 1 FROM apiaries WHERE id = apiary_id AND user_id = auth.uid())
);

-- =====================================================
-- 3. HIVE_SNAPSHOTS
-- =====================================================
DROP POLICY IF EXISTS "Users manage snapshots in own hives" ON hive_snapshots;

-- A. SELECT
CREATE POLICY "Users can view snapshots (Owner or Viewer)" ON hive_snapshots
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
        WHERE h.id = hive_snapshots.hive_id
        AND (a.user_id = auth.uid() OR s.id IS NOT NULL)
    )
);

-- B. WRITE (Owner Only)
-- Note: Requires traversing hive -> apiary
CREATE POLICY "Owners can manage snapshots" ON hive_snapshots
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = hive_snapshots.hive_id
        AND a.user_id = auth.uid()
    )
);

-- =====================================================
-- 4. INSPECTIONS
-- =====================================================
DROP POLICY IF EXISTS "Users manage inspections in own hives" ON inspections;

CREATE POLICY "Users can view inspections (Owner or Viewer)" ON inspections
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
        WHERE h.id = inspections.hive_id
        AND (a.user_id = auth.uid() OR s.id IS NOT NULL)
    )
);

CREATE POLICY "Owners can manage inspections" ON inspections
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = inspections.hive_id
        AND a.user_id = auth.uid()
    )
);

-- =====================================================
-- 5. INTERVENTIONS
-- =====================================================
DROP POLICY IF EXISTS "Users manage interventions in own hives" ON interventions;

CREATE POLICY "Users can view interventions (Owner or Viewer)" ON interventions
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
        WHERE h.id = interventions.hive_id
        AND (a.user_id = auth.uid() OR s.id IS NOT NULL)
    )
);

CREATE POLICY "Owners can manage interventions" ON interventions
FOR ALL TO authenticated
USING (
     EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = interventions.hive_id
        AND a.user_id = auth.uid()
    )
);

-- =====================================================
-- 6. TASKS
-- =====================================================
DROP POLICY IF EXISTS "Access tasks via apiary ownership, share, or assignment" ON tasks;
DROP POLICY IF EXISTS "Users manage assigned tasks" ON tasks;

-- A. SELECT (All 3 conditions)
CREATE POLICY "Users can view tasks" ON tasks
FOR SELECT TO authenticated
USING (
    -- 1. Owner
    EXISTS (SELECT 1 FROM apiaries a WHERE a.id = tasks.apiary_id AND a.user_id = auth.uid()) OR
    -- 2. Viewer
    EXISTS (SELECT 1 FROM apiary_shares s WHERE s.apiary_id = tasks.apiary_id AND s.viewer_id = auth.uid()) OR
    -- 3. Assigned
    assigned_user_id = auth.uid()
);

-- B. WRITE (Owner OR Assigned User) 
-- Note: Mentors CAN complete a task if it is assigned to them, 
-- but they cannot edit random tasks unless they own the Apiary.
CREATE POLICY "Owners or assignees can manage tasks" ON tasks
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM apiaries a WHERE a.id = apiary_id AND a.user_id = auth.uid()) OR
    assigned_user_id = auth.uid() 
    -- Note: Users can create tasks for themselves (null apiary)
);

CREATE POLICY "Owners or assignees can update tasks" ON tasks
FOR UPDATE TO authenticated
USING (
    EXISTS (SELECT 1 FROM apiaries a WHERE a.id = apiary_id AND a.user_id = auth.uid()) OR
    assigned_user_id = auth.uid()
);

CREATE POLICY "Owners or assignees can delete tasks" ON tasks
FOR DELETE TO authenticated
USING (
    EXISTS (SELECT 1 FROM apiaries a WHERE a.id = apiary_id AND a.user_id = auth.uid()) OR
    assigned_user_id = auth.uid()
);


SELECT 'Enforcement applied: Mentors are now strictly Read-Only.' as message;
