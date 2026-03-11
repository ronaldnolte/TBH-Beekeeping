const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Checking ALL users in auth and public...");

        // Join auth.users and public.users to see discrepancies
        const res = await client.query(`
            SELECT 
                au.id as auth_id, 
                au.email as auth_email,
                pu.id as public_id,
                pu.email as public_email
            FROM auth.users au
            FULL OUTER JOIN public.users pu ON au.id = pu.id
            ORDER BY au.email
        `);

        console.log("\n--- USER DATABASE STATUS ---");
        res.rows.forEach(r => {
            const email = r.auth_email || r.public_email;
            let status = "✅ OK";
            if (!r.auth_id) status = "❌ Ghost (In public but not auth)";
            else if (!r.public_id) status = "⚠️ MISSING PROFILE (In auth but not public)";

            console.log(`${status} | ${email} | ID: ${r.auth_id || r.public_id}`);
        });

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
