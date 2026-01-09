const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.argv[2];
const outputFile = process.argv[3];

if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Reading Schema...");

        // Get all tables and columns
        const res = await client.query(`
            SELECT 
                table_name, 
                column_name, 
                data_type, 
                is_nullable,
                column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        `);

        // Group by table
        const schema = {};
        res.rows.forEach(row => {
            if (!schema[row.table_name]) {
                schema[row.table_name] = [];
            }
            schema[row.table_name].push({
                name: row.column_name,
                type: row.data_type,
                nullable: row.is_nullable,
                default: row.column_default
            });
        });

        fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));
        console.log(`✅ Schema dumped to ${outputFile}`);
        console.log("Tables found:", Object.keys(schema).join(", "));

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
