const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🛠️ UNLOCKING MENTOR EMAILS...");

        console.log("1. Creating Policy 'Mentors emails are visible'...");

        await client.query(`
            DROP POLICY IF EXISTS "Mentors emails are visible" ON public.users;
            
            CREATE POLICY "Mentors emails are visible" ON public.users
            FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM mentor_profiles 
                    WHERE user_id = users.id
                )
            );
        `);
        console.log("   ✅ Policy created (Direct UUID comparison).");

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
