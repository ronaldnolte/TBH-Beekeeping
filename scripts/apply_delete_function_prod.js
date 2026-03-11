const { Client } = require('pg');
const fs = require('fs');

const client = new Client({ connectionString: 'postgres://postgres.ayeqrbcvihztxbrxmrth:Gb36F9mhIUCIqHpS@aws-1-us-east-2.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
    try {
        const sql = fs.readFileSync('scripts/create_delete_function.sql', 'utf8');
        await client.query(sql);
        console.log("Successfully created delete_user_entirely function on PRODUCTION");
    } catch (e) { console.error(e); }
    client.end();
});
