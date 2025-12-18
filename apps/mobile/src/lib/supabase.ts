import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: null, // React Native Async Storage is usually recommended here, but for now we skip persistence or add it later if needed for auth.
        autoRefreshToken: true,
        persistSession: true, // We need an adapter for this to work in RN. For now, basic fetch is priority.
        detectSessionInUrl: false,
    },
});
