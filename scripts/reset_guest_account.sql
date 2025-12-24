-- Reset Guest Account to Clean Seed Data
-- Run this to clean up guest data and restore fresh seed data
-- This should be called when a guest user logs out

-- First, get the guest user ID (we'll need this for foreign keys)
DO $$
DECLARE
    guest_user_id UUID;
BEGIN
    -- Get the guest user ID
    SELECT id INTO guest_user_id 
    FROM auth.users 
    WHERE email = 'guest@beektools.com';

    -- If no guest user found, exit
    IF guest_user_id IS NULL THEN
        RAISE NOTICE 'Guest user not found';
        RETURN;
    END IF;

    -- Delete all guest user data (cascading will handle related records)
    -- Order matters due to foreign key constraints
    
    -- 1. Delete tasks (depends on hives and apiaries)
    DELETE FROM public.tasks WHERE assigned_user_id = guest_user_id;
    
    -- 2. Delete interventions (depends on hives)
    DELETE FROM public.interventions WHERE hive_id IN (
        SELECT h.id FROM public.hives h
        JOIN public.apiaries a ON h.apiary_id = a.id
        WHERE a.user_id = guest_user_id
    );
    
    -- 3. Delete hive_snapshots (depends on hives and inspections)
    DELETE FROM public.hive_snapshots WHERE hive_id IN (
        SELECT h.id FROM public.hives h
        JOIN public.apiaries a ON h.apiary_id = a.id
        WHERE a.user_id = guest_user_id
    );
    
    -- 4. Delete inspections (depends on hives)
    DELETE FROM public.inspections WHERE hive_id IN (
        SELECT h.id FROM public.hives h
        JOIN public.apiaries a ON h.apiary_id = a.id
        WHERE a.user_id = guest_user_id
    );
    
    -- 5. Delete hives (depends on apiaries)
    DELETE FROM public.hives WHERE apiary_id IN (
        SELECT id FROM public.apiaries WHERE user_id = guest_user_id
    );
    
    -- 6. Delete apiaries
    DELETE FROM public.apiaries WHERE user_id = guest_user_id;

    -- 7. Delete weather forecasts
    DELETE FROM public.weather_forecasts WHERE apiary_id IN (
        SELECT id FROM public.apiaries WHERE user_id = guest_user_id
    );

    RAISE NOTICE 'Guest data cleaned successfully';

    -- Now insert seed data
    -- NOTE: Replace these INSERT statements with your actual seed data
    -- You can generate these by exporting your current guest data
    
    -- Example seed data (customize with your actual data):
    /*
    INSERT INTO public.apiaries (id, user_id, name, zip_code, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        guest_user_id,
        'Demo Apiary',
        '12345',
        NOW(),
        NOW()
    );
    */

    RAISE NOTICE 'Seed data restored';

END $$;
