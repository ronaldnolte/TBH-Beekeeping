const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Checking Owner...");
        const res = await client.query(`
            SELECT tableowner 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'user_roles'
        `);
        console.log(`Table Owner: ${res.rows[0]?.tableowner}`);

        console.log("\n🔍 Checking Current User...");
        const userRes = await client.query(`SELECT current_user`);
        console.log(`Current User: ${userRes.rows[0].current_user}`);

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
