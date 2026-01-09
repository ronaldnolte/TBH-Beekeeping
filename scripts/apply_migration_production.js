const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// USAGE: 
// node scripts/apply_migration_production.js "postgres://..." "./scripts/your_migration.sql"

const connectionString = process.argv[2];
const migrationFile = process.argv[3];

if (!connectionString || !migrationFile) {
    console.error("❌ Error: Missing arguments.");
    console.log('Usage: node scripts/apply_migration_production.js "CONNECTION_STRING" "PATH_TO_SQL_FILE"');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function runMigration() {
    try {
        console.log("🔌 Connecting to database...");
        await client.connect();

        console.log(`📂 Reading migration file: ${migrationFile}`);
        const sql = fs.readFileSync(migrationFile, 'utf8');

        console.log("🚀 Executing migration...");
        await client.query(sql);

        console.log("\n✅ MIGRATION SUCCESSFUL!");
        console.log(`   Applied: ${path.basename(migrationFile)}`);

    } catch (err) {
        console.error("❌ Migration Failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
