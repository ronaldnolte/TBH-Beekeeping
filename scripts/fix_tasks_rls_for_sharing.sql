-- =====================================================
-- FIX: ALLOW MENTORS TO VIEW TASKS (SHARED APIARIES)
-- =====================================================
-- Problem: Mentors cannot see tasks in shared apiaries unless the task is explicitly assigned to them.
--          The current policy only checks Ownership or Direct Assignment.

-- Solution: Update 'tasks' policy to also check 'apiary_shares'.


DROP POLICY IF EXISTS "Users manage assigned tasks" ON tasks;

CREATE POLICY "Access tasks via apiary ownership, share, or assignment" ON tasks
FOR ALL
TO authenticated
USING (
    -- 1. Owner of the Apiary (Classic Owner)
    EXISTS (
        SELECT 1 FROM apiaries a
        WHERE a.id = tasks.apiary_id 
        AND a.user_id = auth.uid()
    )
    OR
    -- 2. Viewer of the Apiary (via Share)
    EXISTS (
        SELECT 1 FROM apiary_shares s
        WHERE s.apiary_id = tasks.apiary_id 
        AND s.viewer_id = auth.uid()
    )
    OR
    -- 3. Directly Assigned User (e.g. User Task or assigned by someone else)
    assigned_user_id = auth.uid()
);

SELECT 'Fixed: Tasks RLS now allows access for shared apiary viewers.' as message;
