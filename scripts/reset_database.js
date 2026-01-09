const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("💥 NUKING DATABASE SCHEMA...");
        // WARNING: This deletes EVERYTHING in public schema.

        await client.query('DROP SCHEMA public CASCADE;');
        await client.query('CREATE SCHEMA public;');
        await client.query('GRANT ALL ON SCHEMA public TO postgres;');
        await client.query('GRANT ALL ON SCHEMA public TO public;');

        // Ensure extensions are re-enabled if they were in public?
        // Usually UUID-OSSP is in extensions schema or public.
        // We captured extensions in the snapshot, so we are fine.

        console.log("✅ Database Nuked. Clean slate ready.");

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
