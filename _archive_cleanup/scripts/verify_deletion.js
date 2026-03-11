const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.ayeqrbcvihztxbrxmrth:Gb36F9mhIUCIqHpS@aws-1-us-east-2.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
    try {
        const res = await client.query("SELECT email FROM auth.users WHERE email LIKE '%test2%'");
        console.log('--- Auth Users matching test2 ---');
        console.table(res.rows);

        const res2 = await client.query("SELECT email FROM public.users WHERE email LIKE '%test2%'");
        console.log('--- Public Users matching test2 ---');
        console.table(res2.rows);
    } catch (e) { console.error('SQL Error:', e); }
    client.end();
});
