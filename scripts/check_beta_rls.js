const { Client } = require('pg');

const connectionString = 'postgres://postgres.ayeqrbcvihztxbrxmrth:F4TxUKcHiOJmFIBk@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
  try {
    await client.connect();
    console.log("Connected to production database successfully!");

    // Query columns of beta_signups table
    const columnsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'beta_signups';
    `);

    console.log("\n--- Columns in 'beta_signups' table ---");
    console.log(JSON.stringify(columnsRes.rows, null, 2));

    // Query policies on beta_signups table
    const policiesRes = await client.query(`
      SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
      FROM pg_policies 
      WHERE tablename = 'beta_signups';
    `);

    console.log("\n--- Policies on 'beta_signups' table ---");
    if (policiesRes.rows.length === 0) {
      console.log("No policies found (RLS might be disabled or all public access).");
    } else {
      console.log(JSON.stringify(policiesRes.rows, null, 2));
    }

    // Check if RLS is enabled
    const rlsRes = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relname = 'beta_signups';
    `);
    console.log("\n--- RLS Status ---");
    console.log(JSON.stringify(rlsRes.rows, null, 2));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
