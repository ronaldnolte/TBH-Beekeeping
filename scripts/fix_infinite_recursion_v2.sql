-- ==========================================================
-- FIX: INFINITE RECURSION (PUBLIC SCHEMA VERSION)
-- ==========================================================
-- Previous attempt failed because we tried to write to 'auth' schema.
-- This version writes to 'public' schema which is allowed.
-- ==========================================================

-- 1. The Helper Function (Bypasses RLS)
-- Note: Created in 'public' schema this time
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to everyone
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO service_role;


-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- 3. Create the Loop-Free Policy
CREATE POLICY "Admins can manage all roles" ON user_roles 
    FOR ALL USING (
        public.is_admin()  -- Calls the secure function
    );

SELECT 'Infinite Recursion Fixed (Public Schema). Recursive loop broken.' as message;
