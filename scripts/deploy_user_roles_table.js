const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("1. Creating user_roles table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_roles (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                role TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, role)
            );
            ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
        `);
        console.log("   ✅ Table created.");

        console.log("2. Creating policies...");
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own roles') THEN
                    CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (user_id = auth.uid());
                END IF;
                -- Admin access usually requires a circular check or service role. 
                -- Ideally, auth context checks this on load.
            END
            $$;
        `);

        console.log("3. Assigning ADMIN role to ron.nolte+admin@gmail.com...");
        const email = 'ron.nolte+admin@gmail.com';

        // Find user ID
        const userRes = await client.query(`SELECT id FROM public.users WHERE email = $1`, [email]);

        if (userRes.rows.length === 0) {
            console.error(`❌ User ${email} not found!`);
            return;
        }

        const userId = userRes.rows[0].id;

        // Insert Role
        await client.query(`
            INSERT INTO user_roles (user_id, role)
            VALUES ($1, 'admin')
            ON CONFLICT (user_id, role) DO NOTHING;
        `, [userId]);

        console.log(`   ✅ Role 'admin' assigned to ${email} (ID: ${userId})`);

        // Grant permissions
        await client.query(`GRANT ALL ON user_roles TO authenticated;`);
        await client.query(`GRANT ALL ON user_roles TO service_role;`);

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
