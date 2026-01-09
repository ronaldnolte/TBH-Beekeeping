const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🛠️ STARTING COMPREHENSIVE SYNC...");

        // 1. MENTOR PROFILES
        console.log("\n1. creating mentor_profiles...");
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
        // Policies
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
        // Trigger
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
        // Permissions
        await client.query(`GRANT ALL ON mentor_profiles TO authenticated;`);
        await client.query(`GRANT ALL ON mentor_profiles TO service_role;`);
        console.log("   ✅ mentor_profiles deployed.");


        // 2. WEATHER FORECASTS
        console.log("\n2. creating weather_forecasts...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS weather_forecasts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                apiary_id TEXT NOT NULL REFERENCES apiaries(id) ON DELETE CASCADE, -- Note: TEXT to match Prod schema drift
                forecast_date DATE NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(apiary_id, forecast_date)
            );
            ALTER TABLE weather_forecasts ENABLE ROW LEVEL SECURITY;
        `);
        // Policies
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view forecasts for their apiaries') THEN
                    CREATE POLICY "Users can view forecasts for their apiaries" ON weather_forecasts 
                    FOR SELECT TO authenticated 
                    USING (
                        EXISTS (
                            SELECT 1 FROM apiaries a 
                            WHERE a.id = weather_forecasts.apiary_id 
                            AND a.user_id = auth.uid()
                        )
                    );
                END IF;
            END
            $$;
        `);
        await client.query(`GRANT ALL ON weather_forecasts TO authenticated;`);
        await client.query(`GRANT ALL ON weather_forecasts TO service_role;`);
        console.log("   ✅ weather_forecasts deployed.");

        console.log("\n✅ SYNC COMPLETE.");

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
