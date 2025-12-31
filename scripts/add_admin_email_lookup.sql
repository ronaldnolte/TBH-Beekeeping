-- ==========================================================
-- ADMIN HELPER: RESOLVE EMAIL TO ID
-- ==========================================================
-- This script creates a secure function that allows Admins
-- to look up a User ID by Email.
-- ==========================================================

CREATE OR REPLACE FUNCTION get_user_by_email_for_admin(email_input text)
RETURNS uuid AS $$
DECLARE
    found_id uuid;
    is_admin boolean;
BEGIN
    -- 1. Security Check: Is the caller an Admin?
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    ) INTO is_admin;

    IF NOT is_admin THEN
        RAISE EXCEPTION 'Access Denied: Only admins can perform user lookups.';
    END IF;

    -- 2. Perform the Lookup
    SELECT id INTO found_id FROM auth.users WHERE email = email_input;

    RETURN found_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant Execute Permission
GRANT EXECUTE ON FUNCTION get_user_by_email_for_admin TO authenticated;

SELECT 'Admin Email Lookup Function Created Successfully.' as message;
