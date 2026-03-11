const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.ayeqrbcvihztxbrxmrth:Gb36F9mhIUCIqHpS@aws-1-us-east-2.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
    try {
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name LIKE '%mentor%' OR table_name LIKE '%share%')");
        console.log('Relevant tables: ' + res.rows.map(r => r.table_name).join(', '));

        for (const table of res.rows.map(r => r.table_name)) {
            const cols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' AND table_schema = 'public'`);
            console.log(`${table} columns: ${cols.rows.map(c => c.column_name).join(', ')}`);
        }
    } catch (e) { console.error('SQL Error:', e); }
    client.end();
});
