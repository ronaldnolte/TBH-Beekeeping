const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.argv[2];
const outputFile = process.argv[3] || 'auth_users_backup.json';

if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("💾 Backing up auth.users...");
        const res = await client.query(`
            SELECT 
                instance_id, id, aud, role, email, encrypted_password, 
                email_confirmed_at, invited_at, confirmation_token, 
                created_at, updated_at, phone, phone_confirmed_at, 
                confirmation_sent_at, is_super_admin, raw_app_meta_data, 
                raw_user_meta_data 
            FROM auth.users
        `);

        fs.writeFileSync(outputFile, JSON.stringify(res.rows, null, 2));
        console.log(`✅ Saved ${res.rows.length} users to ${outputFile}`);

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
