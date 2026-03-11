const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.wrdnwzgztwzoigkoebeq:0RFB9UDeqgsAA5ke@aws-0-us-west-2.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
    try {
        const res = await client.query(`
            SELECT
                tc.table_name, 
                tc.constraint_name,
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name,
                rc.delete_rule
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu USING (constraint_name)
                JOIN information_schema.constraint_column_usage AS ccu USING (constraint_name)
                JOIN information_schema.referential_constraints AS rc USING (constraint_name)
            WHERE tc.constraint_type = 'FOREIGN KEY' AND rc.delete_rule != 'CASCADE';
        `);
        console.table(res.rows.filter(r =>
            r.foreign_table_name === 'users' ||
            r.foreign_table_name === 'apiaries' ||
            r.foreign_table_name === 'hives'
        ));
    } catch (e) { console.error(e); }
    client.end();
});
