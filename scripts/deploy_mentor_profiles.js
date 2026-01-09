const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("1. Creating mentor_profiles table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS mentor_profiles (
                user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
                display_name TEXT NOT NULL,
                location TEXT,
                bio TEXT,
                is_accepting_students BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
        `);
        console.log("   ✅ Table created.");

        console.log("2. Creating policies...");
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view mentor profiles') THEN
                    CREATE POLICY "Public can view mentor profiles" ON mentor_profiles FOR SELECT TO authenticated USING (true);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own mentor profile') THEN
                    CREATE POLICY "Users manage own mentor profile" ON mentor_profiles FOR ALL USING (auth.uid() = user_id);
                END IF;
            END
            $$;
        `);

        // Function to auto-update timestamp
        await client.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            DROP TRIGGER IF EXISTS update_mentor_profiles_updated_at ON mentor_profiles;
            CREATE TRIGGER update_mentor_profiles_updated_at 
                BEFORE UPDATE ON mentor_profiles 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log("3. Granting permissions...");
        await client.query(`GRANT ALL ON mentor_profiles TO authenticated;`);
        await client.query(`GRANT ALL ON mentor_profiles TO service_role;`);

        console.log("4. Assigning MENTOR to ron.nolte@gmail.com...");
        const email = 'ron.nolte@gmail.com';

        // Find user ID
        const userRes = await client.query(`SELECT id, display_name FROM public.users WHERE email = $1`, [email]);

        if (userRes.rows.length === 0) {
            console.error(`❌ User ${email} not found!`);
            return;
        }

        const u = userRes.rows[0];

        // Create Profile
        await client.query(`
            INSERT INTO mentor_profiles (user_id, display_name, location, bio)
            VALUES ($1, $2, 'Tijeras, NM', 'Experienced Beekeeper')
            ON CONFLICT (user_id) DO NOTHING;
        `, [u.id, u.display_name || 'Ron Nolte']);

        console.log(`   ✅ Mentor Profile created for ${email}`);

        // Also add to user_roles for consistency
        await client.query(`
            INSERT INTO user_roles (user_id, role)
            VALUES ($1, 'mentor')
            ON CONFLICT (user_id, role) DO NOTHING;
        `, [u.id]);
        console.log(`   ✅ Role 'mentor' added to user_roles.`);

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
