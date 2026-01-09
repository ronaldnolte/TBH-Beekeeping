const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("1. Creating public.users table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.users (
                id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                email TEXT NOT NULL, -- auth.users has email, redundancy for easy access
                display_name TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        `);
        console.log("   ✅ Table created.");

        console.log("2. Creating policies for users...");
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
                    CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (id = auth.uid());
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
                    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (id = auth.uid());
                END IF;
            END
            $$;
        `);
        console.log("   ✅ Policies created.");

        console.log("3. Creating trigger to handle new users...");
        await client.query(`
            CREATE OR REPLACE FUNCTION public.handle_new_user() 
            RETURNS TRIGGER AS $$
            BEGIN
              INSERT INTO public.users (id, email, display_name)
              VALUES (
                NEW.id,
                NEW.email,
                NEW.raw_user_meta_data->>'display_name'
              )
              ON CONFLICT (id) DO NOTHING;
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;

            -- Drop trigger first to ensure clean state
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
            
            CREATE TRIGGER on_auth_user_created 
            AFTER INSERT ON auth.users 
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `);
        console.log("   ✅ Trigger created.");

        console.log("4. BACKFILLING existing users...");
        // Critical step: Import current users from auth.users to public.users
        const res = await client.query(`
            INSERT INTO public.users (id, email, display_name)
            SELECT 
                id, 
                email, 
                raw_user_meta_data->>'display_name'
            FROM auth.users
            ON CONFLICT (id) DO NOTHING;
        `);
        console.log(`   ✅ Backfill successful. Inserted/Ignored ${res.rowCount} rows.`);

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
