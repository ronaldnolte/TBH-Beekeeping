const { Client } = require('pg');
const fs = require('fs');

async function apply() {
    const client = new Client({ connectionString: 'postgres://postgres.ayeqrbcvihztxbrxmrth:Gb36F9mhIUCIqHpS@aws-1-us-east-2.pooler.supabase.com:6543/postgres' });
    try {
        await client.connect();

        const sql = `
-- Function to safely delete a user and all their associated data
CREATE OR REPLACE FUNCTION public.delete_user_entirely(target_user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Delete interventions (references hives)
    DELETE FROM public.interventions WHERE hive_id IN (
        SELECT id FROM public.hives WHERE apiary_id IN (
            SELECT id FROM public.apiaries WHERE user_id = target_user_id
        )
    );

    -- 2. Delete inspections (references hives)
    DELETE FROM public.inspections WHERE hive_id IN (
        SELECT id FROM public.hives WHERE apiary_id IN (
            SELECT id FROM public.apiaries WHERE user_id = target_user_id
        )
    );

    -- 3. Delete hive_snapshots (references hives)
    DELETE FROM public.hive_snapshots WHERE hive_id IN (
        SELECT id FROM public.hives WHERE apiary_id IN (
            SELECT id FROM public.apiaries WHERE user_id = target_user_id
        )
    );

    -- 4. Delete tasks
    DELETE FROM public.tasks 
    WHERE assigned_user_id = target_user_id 
       OR apiary_id IN (SELECT id FROM public.apiaries WHERE user_id = target_user_id);

    -- 5. Delete hives (references apiaries)
    DELETE FROM public.hives WHERE apiary_id IN (
        SELECT id FROM public.apiaries WHERE user_id = target_user_id
    );

    -- 6. Delete apiary_shares
    DELETE FROM public.apiary_shares WHERE viewer_id = target_user_id;
    DELETE FROM public.apiary_shares WHERE apiary_id IN (SELECT id FROM public.apiaries WHERE user_id = target_user_id);

    -- 7. Delete apiaries (references users)
    DELETE FROM public.apiaries WHERE user_id = target_user_id;
    
    -- 8. Delete feature_requests (references users)
    DELETE FROM public.feature_requests WHERE user_id = target_user_id;
    
    -- 9. Delete ai_qa_history (references users)
    DELETE FROM public.ai_qa_history WHERE user_id = target_user_id;
    
    -- 10. Delete user_roles
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    
    -- 11. Delete mentor_profiles
    DELETE FROM public.mentor_profiles WHERE user_id = target_user_id;

    -- 12. Delete from public.users
    DELETE FROM public.users WHERE id = target_user_id;

    -- 13. Finally, delete from auth.users
    DELETE FROM auth.users WHERE id = target_user_id;

    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error deleting user %: %', target_user_id, SQLERRM;
END;
$$;
        `;

        await client.query(sql);
        console.log('✅ Successfully re-applied delete_user_entirely to PRODUCTION');

    } catch (e) {
        console.error('❌ Error applying SQL:', e);
    } finally {
        await client.end();
    }
}

apply();
