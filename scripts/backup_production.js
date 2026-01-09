const { Client } = require('pg');
const fs = require('fs');

// USAGE: 
// node scripts/backup_production.js "postgres://postgres:[PASSWORD]@[HOST]:5432/postgres"

const connectionString = process.argv[2];

if (!connectionString) {
    console.error("❌ Error: Please provide the connection string as an argument.");
    console.log('Usage: node scripts/backup_production.js "your-connection-string"');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function backup() {
    try {
        console.log("🔌 Connecting to database...");
        await client.connect();

        console.log("📋 Fetching list of tables...");
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);

        const tables = res.rows.map(row => row.table_name);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = `backups/production_${timestamp}`;

        if (!fs.existsSync('backups')) {
            fs.mkdirSync('backups');
        }
        fs.mkdirSync(backupDir);

        console.log(`📦 Found ${tables.length} tables. Starting dumps to ${backupDir}...`);

        for (const table of tables) {
            console.log(`   - Dumping table: ${table}...`);
            const tableData = await client.query(`SELECT * FROM "${table}"`);
            fs.writeFileSync(
                `${backupDir}/${table}.json`,
                JSON.stringify(tableData.rows, null, 2)
            );
        }

        console.log("\n✅ BACKUP SUCCESSFUL!");
        console.log(`📁 Data saved to directory: ${process.cwd()}\\${backupDir}`);
        console.log(`💾 Total tables backed up: ${tables.length}`);

    } catch (err) {
        console.error("❌ Backup Failed:", err);
    } finally {
        await client.end();
    }
}

backup();
