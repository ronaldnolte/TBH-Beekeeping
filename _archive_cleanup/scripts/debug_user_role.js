const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Checking columns in public.users...");
        const cols = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND table_schema = 'public'
        `);
        console.log("Columns:", cols.rows.map(r => r.column_name));

        const hasRole = cols.rows.some(r => r.column_name === 'role');
        const hasIsAdmin = cols.rows.some(r => r.column_name === 'is_admin');

        console.log(`\nHas 'role' column? ${hasRole}`);
        console.log(`Has 'is_admin' column? ${hasIsAdmin}`);

        if (hasRole || hasIsAdmin) {
            console.log("\n🔍 Checking Admin User Status...");
            const email = 'ron.nolte+admin@gmail.com';
            const res = await client.query(`SELECT * FROM public.users WHERE email = $1`, [email]);
            if (res.rows.length > 0) {
                console.log(res.rows[0]);
            } else {
                console.log("User not found!");
            }
        }

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
