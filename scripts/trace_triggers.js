const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.ayeqrbcvihztxbrxmrth:Gb36F9mhIUCIqHpS@aws-1-us-east-2.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
    try {
        console.log('--- PUBLIC TRIGGERS ---');
        const resPublic = await client.query("SELECT trigger_name, event_manipulation, event_object_table, action_statement FROM information_schema.triggers WHERE event_object_schema = 'public'");
        console.table(resPublic.rows);
        
        console.log('--- AUTH TRIGGERS ---');
        const resAuth = await client.query("SELECT trigger_name, event_manipulation, event_object_table, action_statement FROM information_schema.triggers WHERE event_object_schema = 'auth'");
        console.table(resAuth.rows);
    } catch(e) { console.error('SQL Error:', e); }
    client.end();
});
