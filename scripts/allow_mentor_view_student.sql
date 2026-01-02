-- =====================================================
-- FIX: ALLOW MENTORS TO VIEW STUDENT PROFILES
-- =====================================================
-- Problem: When a Mentor views a shared apiary, they see "From: Unknown" 
-- because they don't have permission to read the Student's (Owner's) user profile.

-- Solution: Add a policy to 'users' table allowing access if a share exists.

-- Add Policy to 'users' table (Additive)
CREATE POLICY "Mentors can view their students" ON users
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM apiary_shares
        WHERE owner_id = users.id    -- The target user is the Owner of a share
        AND viewer_id = auth.uid()   -- I am the Viewer of that share
    )
);

SELECT 'Fixed: Mentors can now view names of students who shared apiaries.' as message;
