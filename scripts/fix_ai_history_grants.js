require('dotenv').config();
const { Client } = require('pg');

async function fixPermissions(dbUrl) {
    if (!dbUrl) {
        console.error("Missing DB URL");
        return;
    }

    const client = new Client({
        connectionString: dbUrl,
    });

    try {
        await client.connect();
        
        console.log(`Connected to: ${dbUrl.split('@')[1]}`);
        
        const res = await client.query(`
            GRANT ALL ON TABLE public.ai_qa_history TO anon;
            GRANT ALL ON TABLE public.ai_qa_history TO authenticated;
            GRANT ALL ON TABLE public.ai_qa_history TO service_role;
        `);
        
        console.log("Successfully granted permissions.");
    } catch (err) {
        console.error('Database Error:', err.message);
    } finally {
        await client.end();
    }
}

async function run() {
    console.log("Fixing DEV DB...");
    await fixPermissions(process.env.DEV_DB_URL);
    
    console.log("Fixing PROD DB...");
    await fixPermissions(process.env.PROD_DB_URL);
}

run();
