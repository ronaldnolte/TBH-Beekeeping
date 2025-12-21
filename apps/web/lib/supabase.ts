import { createClient } from '@supabase/supabase-js';
import { cookieStorage } from './cookieStorage';

// Use environment variables for better security and flexibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

console.log('[Supabase] Initializing client with URL:', supabaseUrl);

// Detect WebView environment
const isWebView = typeof navigator !== 'undefined' && /TBHBeekeeperApp/.test(navigator.userAgent);
console.log('[Supabase] Running in WebView:', isWebView);

// Create Supabase client with cookie-based storage for better WebView persistence
// Cookies persist more reliably than localStorage in WebView environments
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use cookie storage for session persistence
        // This works better in WebView environments than localStorage
        storage: typeof window !== 'undefined' ? cookieStorage : undefined,
        storageKey: 'supabase-auth-token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // Set token refresh threshold to 60 seconds before expiry
        flowType: 'pkce',
    },
});
