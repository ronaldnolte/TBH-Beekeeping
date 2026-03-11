const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Checking tables in 'public' schema...");
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log("Tables found:", res.rows.map(r => r.table_name));

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
