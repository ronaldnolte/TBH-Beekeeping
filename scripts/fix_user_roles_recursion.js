const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🛠️ FIXING RECURSION...");

        // FORCE RESET ROLE (Pooler might have cached 'authenticated' from debug session)
        await client.query("RESET ROLE");

        // 1. DROP the recursive policy
        console.log("1. Dropping 'Admins can manage all roles'...");
        await client.query(`DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;`);
        console.log("   ✅ Dropped.");

        // 2. Ensure basic visibility exists
        console.log("2. Ensuring 'Users can view own roles' exists...");
        await client.query(`
            DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
            CREATE POLICY "Users can view own roles" ON user_roles
            FOR SELECT
            TO authenticated
            USING (user_id = auth.uid());
        `);
        console.log("   ✅ Basic visibility restored.");

        // 3. Add SAFER Admin Policy (Avoid recursion on SELECT)
        // We will separate INSERT/UPDATE/DELETE from SELECT.
        // For Admin check, we can use a helper function (security definer) to avoid recursion, 
        // OR simply trust that only Admins can write, but for now let's just restore ACCESS first.

        // Let's create a Security Definer function to check admin status safely
        console.log("3. Creating is_admin() safe function...");
        await client.query(`
            CREATE OR REPLACE FUNCTION public.is_admin()
            RETURNS boolean AS $$
            BEGIN
              RETURN EXISTS (
                SELECT 1 FROM user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'
              );
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER; 
            -- SECURITY DEFINER runs as owner (postgres), bypassing RLS on user_roles inside the function!
        `);
        console.log("   ✅ Function created.");

        // Now we can use is_admin() in policies without recursion
        console.log("4. creating Safe Admin Policy...");
        await client.query(`
            CREATE POLICY "Admins can manage all roles" ON user_roles
            FOR ALL
            TO authenticated
            USING (public.is_admin())
            WITH CHECK (public.is_admin());
        `);
        console.log("   ✅ Safe Policy created.");

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
