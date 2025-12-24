-- Export Guest Account Data as Seed Data
-- Run this script in Supabase to generate INSERT statements for your seed data
-- Copy the output and add it to reset_guest_account.sql

DO $$
DECLARE
    guest_user_id UUID;
    apiary_record RECORD;
    hive_record RECORD;
    inspection_record RECORD;
    task_record RECORD;
    intervention_record RECORD;
BEGIN
    -- Get the guest user ID
    SELECT id INTO guest_user_id 
    FROM auth.users 
    WHERE email = 'guest@beektools.com';

    IF guest_user_id IS NULL THEN
        RAISE NOTICE 'Guest user not found!';
        RETURN;
    END IF;

    RAISE NOTICE '-- ============================================';
    RAISE NOTICE '-- SEED DATA FOR GUEST ACCOUNT';
    RAISE NOTICE '-- Generated: %', NOW();
    RAISE NOTICE '-- ============================================';
    RAISE NOTICE '';
    
    -- Export Apiaries
    RAISE NOTICE '-- APIARIES';
    FOR apiary_record IN 
        SELECT * FROM public.apiaries WHERE user_id = guest_user_id ORDER BY created_at
    LOOP
        RAISE NOTICE 'INSERT INTO public.apiaries (id, user_id, name, zip_code, latitude, longitude, notes, created_at, updated_at) VALUES (''%'', guest_user_id, ''%'', ''%'', %, %, ''%'', ''%'', ''%'');',
            apiary_record.id,
            apiary_record.name,
            apiary_record.zip_code,
            COALESCE(apiary_record.latitude::text, 'NULL'),
            COALESCE(apiary_record.longitude::text, 'NULL'),
            COALESCE(apiary_record.notes, ''),
            apiary_record.created_at,
            apiary_record.updated_at;
    END LOOP;
    RAISE NOTICE '';

    -- Export Hives
    RAISE NOTICE '-- HIVES';
    FOR hive_record IN 
        SELECT h.* FROM public.hives h
        JOIN public.apiaries a ON h.apiary_id = a.id
        WHERE a.user_id = guest_user_id
        ORDER BY h.created_at
    LOOP
        RAISE NOTICE 'INSERT INTO public.hives (id, apiary_id, name, bar_count, notes, created_at, updated_at, last_inspection_date) VALUES (''%'', ''%'', ''%'', %, ''%'', ''%'', ''%'', %);',
            hive_record.id,
            hive_record.apiary_id,
            hive_record.name,
            hive_record.bar_count,
            COALESCE(hive_record.notes, ''),
            hive_record.created_at,
            hive_record.updated_at,
            COALESCE('''' || hive_record.last_inspection_date || '''', 'NULL');
    END LOOP;
    RAISE NOTICE '';

    -- Export Inspections
    RAISE NOTICE '-- INSPECTIONS';
    FOR inspection_record IN 
        SELECT i.* FROM public.inspections i
        JOIN public.hives h ON i.hive_id = h.id
        JOIN public.apiaries a ON h.apiary_id = a.id
        WHERE a.user_id = guest_user_id
        ORDER BY i.created_at
        LIMIT 10  -- Limit to prevent too much data
    LOOP
        RAISE NOTICE 'INSERT INTO public.inspections (id, hive_id, brood_pattern, honey_stores, pollen_presence, queen_seen, queen_cells, swarm_cells, temperament, notes, inspection_date, created_at, updated_at) VALUES (''%'', ''%'', ''%'', ''%'', ''%'', %, %, %, ''%'', ''%'', ''%'', ''%'', ''%'');',
            inspection_record.id,
            inspection_record.hive_id,
            COALESCE(inspection_record.brood_pattern, ''),
            COALESCE(inspection_record.honey_stores, ''),
            COALESCE(inspection_record.pollen_presence, ''),
            inspection_record.queen_seen,
            inspection_record.queen_cells,
            inspection_record.swarm_cells,
            COALESCE(inspection_record.temperament, ''),
            COALESCE(inspection_record.notes, ''),
            inspection_record.inspection_date,
            inspection_record.created_at,
            inspection_record.updated_at;
    END LOOP;
    RAISE NOTICE '';

    -- Export Tasks
    RAISE NOTICE '-- TASKS';
    FOR task_record IN 
        SELECT * FROM public.tasks 
        WHERE assigned_user_id = guest_user_id
        ORDER BY created_at
        LIMIT 5  -- Limit to prevent too much data
    LOOP
        RAISE NOTICE 'INSERT INTO public.tasks (id, hive_id, apiary_id, assigned_user_id, description, due_date, completed, completed_at, created_at, updated_at) VALUES (''%'', %, %, guest_user_id, ''%'', ''%'', %, %, ''%'', ''%'');',
            task_record.id,
            COALESCE('''' || task_record.hive_id || '''', 'NULL'),
            COALESCE('''' || task_record.apiary_id || '''', 'NULL'),
            task_record.description,
            task_record.due_date,
            task_record.completed,
            COALESCE('''' || task_record.completed_at || '''', 'NULL'),
            task_record.created_at,
            task_record.updated_at;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE '-- ============================================';
    RAISE NOTICE '-- END SEED DATA';
    RAISE NOTICE '-- ============================================';

END $$;
