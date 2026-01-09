const { Client } = require('pg');

const connectionString = process.argv[2];
const OLD_EMAIL = 'admin@thenoltefamily.com';
const NEW_EMAIL = 'ron.nolte+admin@gmail.com';

if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log(`🔄 Transferring ownership from ${OLD_EMAIL} to ${NEW_EMAIL}...`);

        // Get IDs
        const oldUserRes = await client.query(`SELECT id FROM public.users WHERE email = $1`, [OLD_EMAIL]);
        const newUserRes = await client.query(`SELECT id FROM public.users WHERE email = $1`, [NEW_EMAIL]);

        if (oldUserRes.rows.length === 0) {
            console.error(`❌ Old user ${OLD_EMAIL} not found!`);
            return;
        }
        if (newUserRes.rows.length === 0) {
            console.error(`❌ New user ${NEW_EMAIL} not found!`);
            return;
        }

        const oldId = oldUserRes.rows[0].id;
        const newId = newUserRes.rows[0].id;

        console.log(`   - Map: ${oldId} -> ${newId}`);

        // Update Apiaries
        const res = await client.query(`
            UPDATE apiaries 
            SET user_id = $1 
            WHERE user_id = $2
            RETURNING name;
        `, [newId, oldId]);

        console.log(`✅ Transferred ${res.rowCount} apiaries:`);
        res.rows.forEach(r => console.log(`   - ${r.name}`));

        // Also update apiary_shares if they were the owner there (integrity)
        await client.query(`UPDATE apiary_shares SET owner_id = $1 WHERE owner_id = $2`, [newId, oldId]);
        // And viewer side? rare but possible
        await client.query(`UPDATE apiary_shares SET viewer_id = $1 WHERE viewer_id = $2`, [newId, oldId]);

        console.log("✅ Related shares updated.");

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
