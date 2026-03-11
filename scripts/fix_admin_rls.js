const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🛠️ FIXING ADMIN RLS POLICIES...");

        // 1. Drop old restrictive policies if they exist (optional, but cleaner)
        // Actually, we can just ADD a new policy. RLS is OR-based (if ANY policy allows, it works).

        console.log("1. Adding Admin Policy for mentor_profiles...");
        await client.query(`
            DROP POLICY IF EXISTS "Admins can manage all mentor profiles" ON mentor_profiles;
            
            CREATE POLICY "Admins can manage all mentor profiles" ON mentor_profiles
            FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_roles 
                    WHERE user_id = auth.uid() 
                    AND role = 'admin'
                )
            );
        `);
        console.log("   ✅ Policy added.");

        // NOTE: If user_roles was also locked down, we'd need to fix that too.
        // But user_roles usually has strict policies. Let's make sure Admins can manage ROLES too.
        console.log("2. Adding Admin Policy for user_roles (just in case)...");
        await client.query(`
            DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

            CREATE POLICY "Admins can manage all roles" ON user_roles
            FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_roles 
                    WHERE user_id = auth.uid() 
                    AND role = 'admin'
                )
            );
        `);
        console.log("   ✅ Policy added.");

        console.log("\n✅ ADMIN PERMISSIONS FIXED.");

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();

