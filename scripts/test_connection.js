const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

console.log('Testing connection to:', supabaseUrl);
console.log('Using key:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('hives').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Connection failed:', error.message);
            console.error('Error details:', error);
        } else {
            console.log('Connection successful!');
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

testConnection();
