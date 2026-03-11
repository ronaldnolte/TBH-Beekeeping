const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.ayeqrbcvihztxbrxmrth:Gb36F9mhIUCIqHpS@aws-1-us-east-2.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
    try {
        const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'mentor_students' AND table_schema = 'public'`);
        console.log('mentor_students columns: ' + res.rows.map(r => r.column_name).join(', '));
    } catch (e) { console.error('SQL Error:', e); }
    client.end();
});
