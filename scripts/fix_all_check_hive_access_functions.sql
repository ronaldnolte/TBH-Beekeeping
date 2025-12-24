-- Fix both overloaded versions of check_hive_access
-- This ensures both functions have the security settings
-- Note: Using CREATE OR REPLACE instead of DROP because RLS policies depend on these functions

-- Fix version 1: check_hive_access(text)
-- This version uses auth.uid() to get the current user
CREATE OR REPLACE FUNCTION public.check_hive_access(hive_id text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $function$
  select exists (
    select 1 from public.hives h
    join public.apiaries a on h.apiary_id = a.id
    where h.id = hive_id
    and a.user_id = auth.uid()
  );
$function$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_hive_access(text) TO authenticated;

COMMENT ON FUNCTION public.check_hive_access(text) IS 
'Checks if the current authenticated user has access to a hive. Security: Fixed search_path.';

-- ========================================

-- Fix version 2: check_hive_access(uuid, uuid)
-- This version takes both hive_id and user_id as parameters
CREATE OR REPLACE FUNCTION public.check_hive_access(
    p_hive_id uuid,
    p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $function$
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
$function$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_hive_access(uuid, uuid) TO authenticated;

COMMENT ON FUNCTION public.check_hive_access(uuid, uuid) IS 
'Checks if a specific user has access to a hive. Security: Fixed search_path.';

-- ========================================
-- Verification query (optional - run after to confirm)
-- SELECT proname, prosrc FROM pg_proc WHERE proname = 'check_hive_access';
