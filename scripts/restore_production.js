const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// USAGE: 
// node scripts/restore_production.js "postgres://..." "./backups/production_2026-..."

const connectionString = process.argv[2];
const backupDir = process.argv[3];

if (!connectionString || !backupDir) {
    console.error("❌ Error: Please provide connection string and backup directory.");
    console.log('Usage: node scripts/restore_production.js "CONNECTION_STRING" "./backups/YOUR_BACKUP_FOLDER"');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

// Order matters! Parent tables must be restored before children.
const RESTORE_ORDER = [
    'users',
    'apiaries',
    'hives',
    'hive_snapshots',
    'inspections',
    'interventions',
    'tasks',
    'weather_forecasts'
];

async function restore() {
    try {
        console.log("🔌 Connecting to database...");
        await client.connect();

        if (!fs.existsSync(backupDir)) {
            throw new Error(`Backup directory not found: ${backupDir}`);
        }

        console.log(`📂 Reading backup from: ${backupDir}`);

        // 1. Disable triggers to avoid conflicts (optional, but safer for full restore)
        // Note: You need superuser for 'SET session_replication_role', which you might not have on Supabase transaction pooler.
        // We will just proceed with standard inserts in order.

        for (const table of RESTORE_ORDER) {
            const filePath = path.join(backupDir, `${table}.json`);

            if (fs.existsSync(filePath)) {
                console.log(`\n🔄 Restoring table: ${table}...`);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const rows = JSON.parse(fileContent);

                if (rows.length === 0) {
                    console.log(`   - No records to restore for ${table}.`);
                    continue;
                }

                console.log(`   - Found ${rows.length} records.`);

                // Get columns from the first record
                const columns = Object.keys(rows[0]);
                const quotedColumns = columns.map(c => `"${c}"`).join(', ');

                let successCount = 0;
                let errorCount = 0;

                for (const row of rows) {
                    const values = columns.map(c => row[c]);
                    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

                    const query = `
                        INSERT INTO "${table}" (${quotedColumns}) 
                        VALUES (${placeholders})
                        ON CONFLICT (id) DO NOTHING; -- Skip if exists (or DO UPDATE based on needs)
                    `;

                    try {
                        await client.query(query, values);
                        successCount++;
                    } catch (entryErr) {
                        console.error(`   ❌ Failed to insert record ${row.id}:`, entryErr.message);
                        errorCount++;
                    }
                }
                console.log(`   ✅ Restored ${successCount} records (${errorCount} errors).`);
            } else {
                console.warn(`   ⚠️ Warning: Backup file not found for table ${table} (Skipping).`);
            }
        }

        console.log("\n✅ RESTORE PROCESS COMPLETE!");

    } catch (err) {
        console.error("❌ Restore Failed:", err);
    } finally {
        await client.end();
    }
}

restore();
