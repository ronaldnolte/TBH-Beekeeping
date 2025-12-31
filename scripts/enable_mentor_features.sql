-- ==========================================================
-- MIGRATION: ENABLE MENTOR FEATURES (SHARED APIARIES)
-- ==========================================================
-- This script:
-- 1. Adds 'is_mentor' and profile fields to 'users'
-- 2. Creates the 'apiary_shares' table
-- 3. UPDATES the secure 'check_hive_access' function to allow Mentors
-- 4. ADDS security policies for finding Mentors
-- ==========================================================

-- 1. Update Users Table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mentor_location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mentor_bio TEXT;

-- 2. Create Shares Table
CREATE TABLE IF NOT EXISTS apiary_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apiary_id UUID NOT NULL REFERENCES apiaries(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(apiary_id, viewer_id) -- Prevent duplicate entries
);

-- Enable RLS on the new table
ALTER TABLE apiary_shares ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies for 'apiary_shares'
-- Rule: You can see the record if you are the Owner OR the Viewer
CREATE POLICY "Users can manage their own shares" ON apiary_shares 
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Viewers can see shares shared with them" ON apiary_shares 
    FOR SELECT USING (auth.uid() = viewer_id);

-- 4. UPDATE 'check_hive_access' Function
-- This is the KEY to the entire security model.
-- We update this ONE function, and Hives/Inspections/Tasks automatically become securely shared.
CREATE OR REPLACE FUNCTION check_hive_access(hive_id_input uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM hives h
    JOIN apiaries a ON a.id = h.apiary_id
    LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
    WHERE h.id = hive_id_input
    AND (
        a.user_id = auth.uid()       -- I am the Owner
        OR 
        s.id IS NOT NULL             -- OR: It is shared with me
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. NEW Security Policy for Finding Mentors
-- We need to check if a policy already exists to avoid errors on re-runs
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view mentors" ON users;
    
    CREATE POLICY "Public can view mentors" ON users FOR SELECT
    USING (
        id = auth.uid()        -- I can always see myself
        OR 
        is_mentor = true       -- I can see anyone flagged as a mentor
    );
END
$$;

-- 6. Helper Function: Get Apiary Access Level
-- Use this in the UI to know if you are 'owner' or 'viewer' (to hide Edit buttons)
CREATE OR REPLACE FUNCTION get_apiary_role(apiary_id_input uuid)
RETURNS text AS $$
DECLARE
    is_owner boolean;
    is_shared boolean;
BEGIN
    SELECT EXISTS(SELECT 1 FROM apiaries WHERE id = apiary_id_input AND user_id = auth.uid()) INTO is_owner;
    IF is_owner THEN RETURN 'owner'; END IF;
    
    SELECT EXISTS(SELECT 1 FROM apiary_shares WHERE apiary_id = apiary_id_input AND viewer_id = auth.uid()) INTO is_shared;
    IF is_shared THEN RETURN 'viewer'; END IF;
    
    RETURN 'none';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant permissions (Standard Supabase Setup)
GRANT ALL ON apiary_shares TO authenticated;
GRANT ALL ON apiary_shares TO service_role;

SELECT 'Mentor features enabled successfully.' as message;
