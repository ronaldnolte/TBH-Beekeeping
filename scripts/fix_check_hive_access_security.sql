-- Fix for: Function 'public.check_hive_access' has a role mutable search_path
-- This adds security settings to prevent SQL injection via search_path manipulation

-- Drop the existing function (we'll recreate it with proper security)
DROP FUNCTION IF EXISTS public.check_hive_access(uuid, uuid);

-- Recreate the function with security settings
CREATE OR REPLACE FUNCTION public.check_hive_access(
    p_hive_id uuid,
    p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Run with the permissions of the function owner
SET search_path = public, pg_temp -- Fixed search path prevents injection
STABLE -- Function doesn't modify database
AS $$
BEGIN
    -- Check if the user owns an apiary that contains this hive
    RETURN EXISTS (
        SELECT 1
        FROM public.hives h
        INNER JOIN public.apiaries a ON h.apiary_id = a.id
        WHERE h.id = p_hive_id
        AND a.user_id = p_user_id
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_hive_access(uuid, uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION public.check_hive_access(uuid, uuid) IS 
'Checks if a user has access to a specific hive by verifying apiary ownership. Security: Fixed search_path prevents SQL injection.';
