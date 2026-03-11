const { Client } = require('pg');
const fs = require('fs');

// USAGE: node scripts/apply_all_fixes.js "CONNECTION_STRING"

const connectionString = process.argv[2];

if (!connectionString) {
    console.error("❌ Error: Missing connection string.");
    process.exit(1);
}

const client = new Client({ connectionString });

const SCRIPTS_TO_RUN = [
    './scripts/fix_apiary_rls_for_sharing.sql',
    './scripts/fix_hives_rls_simple.sql',
    './scripts/fix_tasks_rls_for_sharing.sql',
    './scripts/add_snapshot_delete_update_policies.sql'
];

async function applyFixes() {
    try {
        console.log("🔌 Connecting to database...");
        await client.connect();

        for (const file of SCRIPTS_TO_RUN) {
            console.log(`\n📂 Reading file: ${file}`);
            if (fs.existsSync(file)) {
                const sql = fs.readFileSync(file, 'utf8');
                console.log(`🚀 Executing...`);
                await client.query(sql);
                console.log(`✅ Success for ${file}`);
            } else {
                console.warn(`⚠️ Warning: File not found ${file}`);
            }
        }

        console.log("\n✅ ALL FIXES APPLIED SUCCESSFULLY!");

    } catch (err) {
        console.error("❌ Migration Failed:", err);
    } finally {
        await client.end();
    }
}

applyFixes();
