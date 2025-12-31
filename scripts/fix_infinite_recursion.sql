-- ==========================================================
-- FIX: INFINITE RECURSION IN ADMIN POLICY
-- ==========================================================
-- 1. Create a SECURITY DEFINER function to check admin status
--    bypassing RLS to avoid the loop.
-- 2. Update the policy to use this function.
-- ==========================================================

-- 1. The Helper Function (Bypasses RLS)
CREATE OR REPLACE FUNCTION auth.is_admin()
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

-- Grant execute to everyone (it only returns true/false for self)
GRANT EXECUTE ON FUNCTION auth.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION auth.is_admin TO service_role;


-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- 3. Create the Loop-Free Policy
CREATE POLICY "Admins can manage all roles" ON user_roles 
    FOR ALL USING (
        auth.is_admin()  -- Calls the secure function instead of self-referencing
    );

SELECT 'Infinite Recursion Fixed. Recursion loop broken via SECURITY DEFINER function.' as message;
