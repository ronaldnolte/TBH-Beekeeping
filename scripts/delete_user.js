const { Client } = require('pg');

const connectionString = process.argv[2];
const emailToDelete = process.argv[3];

if (!connectionString || !emailToDelete) {
    console.error("Usage: node scripts/delete_user.js <connection_string> <email>");
    process.exit(1);
}

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log(`🔍 Searching for user: ${emailToDelete}...`);

        // Check if user exists
        const checkRes = await client.query('SELECT id, email FROM auth.users WHERE email = $1', [emailToDelete]);

        if (checkRes.rowCount === 0) {
            console.error(`❌ User not found: ${emailToDelete}`);
            process.exit(1);
        }

        const userId = checkRes.rows[0].id;
        console.log(`✅ Found user: ${emailToDelete} (ID: ${userId})`);

        console.log(`🗑️  Deleting user from auth.users...`);
        // Delete from auth.users (Cascades to public tables)
        const deleteRes = await client.query('DELETE FROM auth.users WHERE id = $1', [userId]);

        console.log(`✅ Successfully deleted user ${emailToDelete}.`);
        console.log(`   (Cascade should have removed related data in public.users, apiaries, hives, etc.)`);

    } catch (err) {
        console.error("❌ FAILED:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

run();
