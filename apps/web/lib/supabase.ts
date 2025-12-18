import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseAnonKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables');
}

console.log('Initializing Supabase Client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
