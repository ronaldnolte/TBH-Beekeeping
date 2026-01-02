-- =====================================================
-- MIGRATION: ALLOW MENTOR EMAIL LOOKUP
-- =====================================================
-- Goal: Allow regular users to search for mentors by email.
-- Problem: 'users' table RLS currently only allows users to see their own row.
-- Solution: Add a policy allowing read access to 'users' rows IF that user is a mentor.

-- 1. Add Policy to 'users' table
-- Note: Policies are additive (OR). This adds to the existing "Users can view own profile".

DROP POLICY IF EXISTS "Public can view mentor details" ON users;

CREATE POLICY "Public can view mentor details" ON users
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM mentor_profiles 
        WHERE user_id = users.id 
        AND is_accepting_students = true
    )
);

SELECT 'Migration: Mentor email lookup policy applied.' as message;
