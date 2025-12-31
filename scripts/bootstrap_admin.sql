-- ==========================================================
-- BOOTSTRAP ADMIN: PROMOTE USER TO ADMIN
-- ==========================================================
-- This script:
-- 1. Creates a 'user_roles' table (Safe, decoupled way to manage admins)
-- 2. Finds 'ron.nolte+admin@gmail.com' and makes them an Admin
-- 3. UPDATES 'mentor_profiles' policy to allow Admins to edit anyone
-- ==========================================================

-- 1. Create Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Promote the Specific User
-- We use a DO block to find the ID variable safely
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- FIND the ID based on email (from auth.users, synced to public.users)
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'ron.nolte+admin@gmail.com';

    IF target_user_id IS NOT NULL THEN
        -- Insert if not exists
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'User % successfully promoted to Admin.', target_user_id;
    ELSE
        RAISE EXCEPTION 'User ron.nolte+admin@gmail.com NOT FOUND. Please ensure account is created.';
    END IF;
END $$;


-- 3. Update Policy: Allow Admins to Manage Mentor Profiles
-- We drop the old "Self Only" policy and replace it with "Self OR Admin"
DROP POLICY IF EXISTS "Users manage own mentor profile" ON mentor_profiles;

CREATE POLICY "Users and Admins manage mentor profiles" ON mentor_profiles 
    FOR ALL USING (
        -- I can edit my own
        auth.uid() = user_id 
        OR 
        -- OR: I am an admin
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 4. Security for user_roles table itself
-- Only Admins can view/edit the roles table (prevents self-promotion hack)
CREATE POLICY "Admins manage roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Grant Permissions
GRANT ALL ON user_roles TO authenticated;
GRANT ALL ON user_roles TO service_role;

SELECT 'Admin Bootstrap Complete.' as message;
