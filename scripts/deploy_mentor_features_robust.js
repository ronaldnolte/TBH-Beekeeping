const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("1. Adding columns to users...");
        await client.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT false;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS mentor_location TEXT;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS mentor_bio TEXT;
        `);
        console.log("   ✅ Columns added.");

        console.log("2. Creating apiary_shares table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS apiary_shares (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                apiary_id TEXT NOT NULL REFERENCES apiaries(id) ON DELETE CASCADE,
                owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(apiary_id, viewer_id)
            );
            ALTER TABLE apiary_shares ENABLE ROW LEVEL SECURITY;
        `);
        console.log("   ✅ Table apiary_shares created.");

        console.log("3. Creating policies for apiary_shares...");
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own shares') THEN
                    CREATE POLICY "Users can manage their own shares" ON apiary_shares FOR ALL USING (auth.uid() = owner_id);
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Viewers can see shares shared with them') THEN
                    CREATE POLICY "Viewers can see shares shared with them" ON apiary_shares FOR SELECT USING (auth.uid() = viewer_id);
                END IF;
            END
            $$;
        `);
        console.log("   ✅ Policies created.");

        console.log("4. Updating check_hive_access function...");
        await client.query(`
            CREATE OR REPLACE FUNCTION check_hive_access(hive_id_input uuid)
            RETURNS boolean AS $$
            BEGIN
              RETURN EXISTS (
                SELECT 1 FROM hives h
                JOIN apiaries a ON a.id = h.apiary_id
                LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
                WHERE h.id = hive_id_input
                AND (
                    a.user_id = auth.uid()
                    OR 
                    s.id IS NOT NULL
                )
              );
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);
        console.log("   ✅ Function updated.");

        console.log("5. Granting permissions...");
        await client.query(`
            GRANT ALL ON apiary_shares TO authenticated;
            GRANT ALL ON apiary_shares TO service_role;
        `);
        console.log("   ✅ Permissions granted.");

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
