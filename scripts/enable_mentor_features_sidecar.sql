-- ==========================================================
-- MIGRATION: ENABLE MENTOR FEATURES (SIDECAR APPROACH)
-- ==========================================================
-- This script:
-- 1. Creates 'mentor_profiles' (Publicly visible sidecar table)
-- 2. Creates 'apiary_shares' (Links User -> Apiary -> Mentor)
-- 3. UPDATES security logic to allow shared access
-- ==========================================================

-- 1. Create Mentor Profiles (The "Sidecar" Table)
-- This table is safe to be public because it ONLY contains public info.
-- It links 1-to-1 with the users table.
CREATE TABLE IF NOT EXISTS mentor_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    location TEXT,
    bio TEXT,
    is_accepting_students BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create Shares Table (The Link)
CREATE TABLE IF NOT EXISTS apiary_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apiary_id UUID NOT NULL REFERENCES apiaries(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_level TEXT DEFAULT 'read-only', -- Prepared for future 'edit' rights
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(apiary_id, viewer_id) -- Prevent duplicate entries
);

-- Enable RLS on shares
ALTER TABLE apiary_shares ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies for 'mentor_profiles'
-- Rule A: Public (Authenticated) users can VIEW all mentor profiles.
CREATE POLICY "Public can view mentor profiles" ON mentor_profiles 
    FOR SELECT TO authenticated USING (true);

-- Rule B: Users can only UPDATE their OWN profile.
CREATE POLICY "Users manage own mentor profile" ON mentor_profiles 
    FOR ALL USING (auth.uid() = user_id);

-- 4. Security Policies for 'apiary_shares'
-- Rule: You can see the record if you are the Owner OR the Viewer
CREATE POLICY "Users can manage their own shares" ON apiary_shares 
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Viewers can see shares shared with them" ON apiary_shares 
    FOR SELECT USING (auth.uid() = viewer_id);

-- 5. UPDATE 'check_hive_access' Function
-- This remains the Magic Key. It checks both Ownership AND Sharing.
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


-- 6. Helper Function: Get Apiary Role
-- Used by UI to determine if "Edit" button should be shown
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

-- 7. Trigger to Auto-Update Timestamp
CREATE TRIGGER update_mentor_profiles_updated_at 
    BEFORE UPDATE ON mentor_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Grant permissions
GRANT ALL ON mentor_profiles TO authenticated;
GRANT ALL ON mentor_profiles TO service_role;
GRANT ALL ON apiary_shares TO authenticated;
GRANT ALL ON apiary_shares TO service_role;

SELECT 'Mentor features (Sidecar) enabled successfully.' as message;
