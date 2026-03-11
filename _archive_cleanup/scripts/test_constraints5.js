const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.wrdnwzgztwzoigkoebeq:0RFB9UDeqgsAA5ke@aws-0-us-west-2.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
    try {
        const res = await client.query(`
            SELECT
                tc.table_schema,
                tc.table_name, 
                kcu.column_name, 
                ccu.table_schema AS foreign_table_schema,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name,
                rc.delete_rule
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu USING (constraint_name)
                JOIN information_schema.constraint_column_usage AS ccu USING (constraint_name)
                JOIN information_schema.referential_constraints AS rc USING (constraint_name)
            WHERE tc.constraint_type = 'FOREIGN KEY' 
              AND ccu.table_schema = 'auth' 
              AND ccu.table_name = 'users';
        `);
        console.table(res.rows);
    } catch (e) { console.error(e); }
    client.end();
});
