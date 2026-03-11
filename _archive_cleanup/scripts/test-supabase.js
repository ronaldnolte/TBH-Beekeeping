const { createClient } = require('@supabase/supabase-js');
const dns = require('node:dns');
const util = require('node:util');

const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseAnonKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';
const lookup = util.promisify(dns.lookup);

console.log('Testing connection to:', supabaseUrl);

async function testConnection() {
    try {
        console.log('Resolving DNS...');
        const hostname = 'ayeqrbcvihztxbrxmrth.supabase.co';
        const { address, family } = await lookup(hostname);
        console.log(`✅ DNS Resolved: ${address} (IPv${family})`);

        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('Attempting to fetch session...');
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('❌ Connection Failed:', error.message);
        } else {
            console.log('✅ Connection Successful!');
        }
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testConnection();
