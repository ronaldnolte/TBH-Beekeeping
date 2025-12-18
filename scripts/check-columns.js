const { createClient } = require('@supabase/supabase-js');
const dns = require('dns');

// DNS Fix for Node 18+
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

// Config
const supabaseUrl = 'https://ayeqrbcvnhztxbnxmrth.supabase.co';
const supabaseAnonKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
    console.log('Inspecting "hives" table columns...');

    // Attempt to select 'bars'
    const { data: dataBars, error: errorBars } = await supabase.from('hives').select('bars').limit(1);

    if (!errorBars) {
        console.log('✅ Column "bars" exists and is accessible!');
    } else {
        console.log('❌ Error accessing "bars":', errorBars.message);
    }

    // Attempt to select 'raw_bars'
    const { data: dataRaw, error: errorRaw } = await supabase.from('hives').select('raw_bars').limit(1);

    if (!errorRaw) {
        console.log('✅ Column "raw_bars" exists and is accessible!');
    } else {
        console.log('❌ Error accessing "raw_bars":', errorRaw.message);
    }

    if (errorBars && errorRaw) {
        console.log('⚠️ Neither column seems accessible. Check table permissions or existence.');
    }
}

checkColumns();
