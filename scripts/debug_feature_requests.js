const { createClient } = require('@supabase/supabase-js');

// Using the CORRECT verified credentials
const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
    console.log('Checking feature_requests table on:', supabaseUrl);

    // Try to select
    const { data, error } = await supabase.from('feature_requests').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error accessing feature_requests table:');
        console.error(JSON.stringify(error, null, 2));
        if (error.code === '42P01') {
            console.error('--> CONCLUSION: The table "feature_requests" DOES NOT EXIST. Please run the migration script.');
        }
    } else {
        console.log('Success! Table "feature_requests" exists and is accessible.');
        console.log('Row count:', data); // data is null for head:true usually, count is in count property
    }
}

checkTable();
