const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.argv[2];
const inputFile = process.argv[3];

if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔄 Restoring auth.users...");
        const users = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

        for (const u of users) {
            // Remove instance_id generally (as it might differ, but in Supabase cloud it's usually '00000000-0000-0000-0000-000000000000')
            // We use simple INSERT ON CONFLICT
            // Note: Triggers on auth.users might run! 
            // e.g. handle_new_user might try to insert into public.users. 
            // Since we flushed public.users, that is GOOD.

            try {
                // Force sync: Delete by email to allow new ID insertion
                await client.query('DELETE FROM auth.users WHERE email = $1', [u.email]);

                await client.query(`
                    INSERT INTO auth.users (
                        id, aud, role, email, encrypted_password, 
                        email_confirmed_at, invited_at, confirmation_token, 
                        created_at, updated_at, phone, phone_confirmed_at, 
                        confirmation_sent_at, is_super_admin, raw_app_meta_data, 
                        raw_user_meta_data
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
                    )
                    ON CONFLICT (id) DO NOTHING;
                `, [
                    u.id, u.aud, u.role, u.email, u.encrypted_password,
                    u.email_confirmed_at, u.invited_at, u.confirmation_token,
                    u.created_at, u.updated_at, u.phone, u.phone_confirmed_at,
                    u.confirmation_sent_at, u.is_super_admin, u.raw_app_meta_data,
                    u.raw_user_meta_data
                ]);
                console.log(`   - Imported ${u.email}`);
            } catch (e) {
                console.error(`   ❌ Failed ${u.email}:`, e.message);
            }
        }

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
