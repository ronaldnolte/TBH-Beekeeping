const { Client } = require('pg');

const connectionString = process.argv[2];
const TEST_USER_ID = 'e4f5029b-49da-44cb-9b5e-74a2bb91d704'; // ron.nolte@gmail.com ID from previous output

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        // 1. Check as Superuser (bypass RLS)
        console.log("👮 Checking as Superuser...");
        const resRoot = await client.query(`SELECT count(*) FROM apiaries WHERE user_id = '${TEST_USER_ID}'`);
        console.log(`   - Superuser sees ${resRoot.rows[0].count} apiaries for this user.`);

        // 2. Check as Authenticated User (Apply RLS)
        console.log(`\n👤 Checking as User ${TEST_USER_ID}...`);

        // Simulate Supabase Auth
        await client.query(`SET request.jwt.claims TO '{"sub": "${TEST_USER_ID}", "role": "authenticated"}'`);
        await client.query(`SET ROLE authenticated`); // Switch directly to authenticated role

        // Try to read
        const resUser = await client.query(`SELECT count(*) FROM apiaries`);
        console.log(`   - User sees ${resUser.rows[0].count} apiaries.`);

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
