import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseAnonKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables');
}

console.log('Initializing Supabase Client with URL:', supabaseUrl);

// Detect WebView
const isWebView = typeof navigator !== 'undefined' && /TBHBeekeeperApp/.test(navigator.userAgent);
console.log('Is WebView:', isWebView);

// Create Supabase client with WebView-friendly configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Force storage to be synchronous and persistent
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'supabase.auth.token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Disable URL-based session detection in WebView
        flowType: 'pkce', // More secure flow type that works better with mobile
    },
});
