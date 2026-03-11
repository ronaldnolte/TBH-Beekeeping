const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Checking policies on user_roles...");
        const res = await client.query(`
            SELECT policyname, cmd, roles, qual, with_check 
            FROM pg_policies 
            WHERE tablename = 'user_roles';
        `);

        res.rows.forEach(r => {
            console.log(`\nPolicy: ${r.policyname}`);
            console.log(`   Command: ${r.cmd}`);
            console.log(`   USING:   ${r.qual}`);
        });

        // Test visibility for the admin user
        const TEST_USER_ID = '3f5b23d0-8f24-4056-b53a-5f8242952b04'; // ron.nolte+admin ID

        console.log(`\n👤 Testing visibility for Admin ID: ${TEST_USER_ID}...`);

        // Simulate Session
        await client.query(`SET request.jwt.claims TO '{"sub": "${TEST_USER_ID}", "role": "authenticated"}'`);
        await client.query(`SET ROLE authenticated`);

        const rows = await client.query(`SELECT * FROM user_roles WHERE user_id = '${TEST_USER_ID}'`);
        console.log(`   - Rows visible: ${rows.rowCount}`);
        if (rows.rowCount > 0) {
            console.log(`   - Role: ${rows.rows[0].role}`);
        }

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
