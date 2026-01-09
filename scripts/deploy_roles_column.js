const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("1. Adding 'role' column to public.users...");
        await client.query(`
            ALTER TABLE public.users 
            ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' 
            CHECK (role IN ('user', 'mentor', 'admin'));
        `);
        console.log("   ✅ Column added.");

        console.log("2. Setting Admin Role...");
        const email = 'ron.nolte+admin@gmail.com';
        const res = await client.query(`
            UPDATE public.users 
            SET role = 'admin' 
            WHERE email = $1
            RETURNING email, role;
        `, [email]);

        if (res.rows.length > 0) {
            console.log(`   ✅ User ${res.rows[0].email} is now: ${res.rows[0].role}`);
        } else {
            console.error(`   ❌ User ${email} NOT FOUND!`);
        }

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
