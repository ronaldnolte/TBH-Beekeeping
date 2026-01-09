const { Client } = require('pg');

const connectionString = process.argv[2];
if (!connectionString) process.exit(1);

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log("🔍 Inspecting users...");
        const users = await client.query('SELECT * FROM public.users ORDER BY email');
        console.log("\n--- USER LIST ---");
        users.rows.forEach(u => console.log(` - ${u.email} (ID: ${u.id})`));

        console.log("\n🔍 Analyzing Apiary Ownership...");
        const apiaries = await client.query(`
            SELECT u.email, count(a.id) as apiary_count
            FROM apiaries a
            LEFT JOIN public.users u ON a.user_id = u.id
            GROUP BY u.email
        `);

        console.log("\n--- OWNERSHIP SUMMARY ---");
        if (apiaries.rows.length === 0) {
            console.log("No apiaries found.");
        } else {
            apiaries.rows.forEach(row => {
                const email = row.email || "UNKNOWN_USER (ID mismatch!)";
                console.log(` - ${email}: ${row.apiary_count} apiaries`);
            });
        }

        console.log("\n🔍 Detailed List:");
        const details = await client.query(`
            SELECT a.name, u.email 
            FROM apiaries a
            LEFT JOIN public.users u ON a.user_id = u.id
            ORDER BY u.email, a.name
        `);
        details.rows.forEach(d => console.log(`   * ${d.name} -> ${d.email}`));

    } catch (err) {
        console.error("❌ FAILED:", err);
    } finally {
        await client.end();
    }
}

run();
