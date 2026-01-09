const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const fs = require('fs');
const path = require('path');

// Load .env manually to avoid dependency issues
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '..', '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split(/\r?\n/).forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // strip quotes
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.warn("⚠️  Could not load .env file");
    }
}

loadEnv();

const PROD_URL = process.env.PROD_DB_URL;
const DEV_URL = process.env.DEV_DB_URL;

if (!PROD_URL || !DEV_URL) {
    console.error("❌ Error: Missing PROD_DB_URL or DEV_DB_URL environment variables.");
    console.error("   Please ensure .env file exists in the root directory.");
    process.exit(1);
}

const NODE = 'node';

// Helper to run commands
function run(desc, cmd, args) {
    console.log(`\n---------------------------------------------------`);
    console.log(`⏳ STEP: ${desc}`);
    console.log(`   Running: ${cmd} ${args.join(' ')}`);

    try {
        const output = execSync(`${cmd} ${args.join(' ')}`, { encoding: 'utf8', stdio: 'inherit' });
        console.log(`✅ ${desc} Completed.`);
        return output;
    } catch (e) {
        console.error(`❌ ${desc} FAILED.`);
        process.exit(1);
    }
}

// Helper to find latest backup
function getLatestBackupDir() {
    const backupRoot = path.join(__dirname, '..', 'backups');
    const dirs = fs.readdirSync(backupRoot)
        .filter(f => fs.statSync(path.join(backupRoot, f)).isDirectory() && f.startsWith('production_'))
        .sort().reverse();

    if (dirs.length === 0) throw new Error("No backups found!");
    return path.join('backups', dirs[0]);
}

async function main() {
    console.log("🚀 STARTING PRODUCTION -> DEVELOPMENT CLONE 🚀");
    console.log("===================================================");
    console.log("PROD: " + PROD_URL.split('@')[1]); // Hide password
    console.log("DEV:  " + DEV_URL.split('@')[1]);
    console.log("===================================================");

    // 1. Snapshot Schema (Structure + Constraints + Functions)
    run("Snapshot Prod Schema", NODE, [
        '"scripts/snapshot_schema.js"',
        `"${PROD_URL}"`,
        '"temp_schema.sql"'
    ]);

    // 2. Clean Snapshot (Remove Extensions, Fix Newlines)
    run("Clean Snapshot SQL", NODE, [
        '"scripts/clean_snapshot.js"',
        '"temp_schema.sql"',
        '"temp_schema_clean.sql"'
    ]);
    run("Fix Newlines in SQL", NODE, [
        '"scripts/fix_newlines.js"',
        '"temp_schema_clean.sql"'
    ]);

    // 3. Backup Prod Data (Public Schema)
    run("Backup Prod Data", NODE, [
        '"scripts/backup_production.js"',
        `"${PROD_URL}"`,
        '"auto_sync_backup"'
    ]);
    // Note: backup_production appends timestamp to the folder name provided? 
    // Actually backup_production.js logic uses timestamp internally if arg is "prod_latest_backup" or generally.
    // Let's check logic: It creates `backups/production_${timestamp}`.
    // We will just find the latest one.

    const latestBackup = getLatestBackupDir();
    console.log(`   Using Backup: ${latestBackup}`);

    // 4. Backup Prod Auth Users
    run("Backup Prod Auth Users", NODE, [
        '"scripts/backup_auth_users.js"',
        `"${PROD_URL}"`,
        '"temp_auth_users.json"'
    ]);

    // 5. NUKE DEV (Reset Database)
    console.log("\n⚠️  WARNING: ERAZING DEVELOPMENT DATABASE IN 5 SECONDS...");
    await new Promise(r => setTimeout(r, 5000));

    run("Reset Dev Database", NODE, [
        '"scripts/reset_database.js"',
        `"${DEV_URL}"`
    ]);

    // 6. Restore Schema to Dev
    run("Apply Schema to Dev", NODE, [
        '"scripts/apply_migration_production.js"',
        `"${DEV_URL}"`,
        '"temp_schema_clean.sql"'
    ]);

    // 7. Sync Auth Users to Dev
    run("Restore Auth Users to Dev", NODE, [
        '"scripts/restore_auth_users.js"',
        `"${DEV_URL}"`,
        '"temp_auth_users.json"'
    ]);

    // 8. Restore Public Data to Dev
    run("Restore Data to Dev", NODE, [
        '"scripts/restore_production.js"',
        `"${DEV_URL}"`,
        `"${latestBackup}"` // Pass relative path (e.g. backups/production_...)
    ]);

    console.log("\n===================================================");
    console.log("🎉 SYNC COMPLETE! Development is now a clone of Production.");
}

main();
