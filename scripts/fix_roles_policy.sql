-- ==========================================================
-- FIX: ALLOW USERS TO READ THEIR OWN ROLES
-- ==========================================================
-- The previous policy was too strict (chicken-and-egg).
-- We need to let any user check "Do I have a role?"
-- ==========================================================

-- 1. Drop the strict policy
DROP POLICY IF EXISTS "Admins manage roles" ON user_roles;

-- 2. Create "Read Own" Policy
-- Users can see their own rows (to know if they are admin)
CREATE POLICY "Users can read own roles" ON user_roles 
    FOR SELECT USING (auth.uid() = user_id);

-- 3. Create "Admins Manage All" Policy
-- Admins can do everything (insert/update/delete) on everyone
CREATE POLICY "Admins can manage all roles" ON user_roles 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

SELECT 'User Roles Policy Fixed. You should now be able to see the Admin Button.' as message;
