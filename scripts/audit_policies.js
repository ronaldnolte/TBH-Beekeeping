const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.argv[2];
const outputFile = process.argv[3];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Reading Policies...");
        const res = await client.query(`
            SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
            FROM pg_policies
            WHERE schemaname = 'public'
            ORDER BY tablename, policyname;
        `);

        fs.writeFileSync(outputFile, JSON.stringify(res.rows, null, 2));
        console.log(`✅ Policies dumped to ${outputFile}`);

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
