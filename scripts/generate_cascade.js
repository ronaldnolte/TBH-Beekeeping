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

        const targets = res.rows.filter(r =>
            r.foreign_table_name === 'users' ||
            r.foreign_table_name === 'apiaries' ||
            r.foreign_table_name === 'hives'
        );

        const sql = targets.map(r => `
ALTER TABLE public.${r.table_name} DROP CONSTRAINT "${r.constraint_name}";
ALTER TABLE public.${r.table_name} ADD CONSTRAINT "${r.constraint_name}" FOREIGN KEY (${r.column_name}) REFERENCES public.${r.foreign_table_name}(${r.foreign_column_name}) ON DELETE CASCADE;
`).join('');
        const fs = require('fs');
        fs.writeFileSync('scripts/fix_cascade_rules.sql', sql);
        console.log("Wrote mapping to scripts/fix_cascade_rules.sql");
    } catch (e) { console.error(e); }
    client.end();
});
