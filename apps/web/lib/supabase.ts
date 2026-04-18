import { createClient } from '@supabase/supabase-js';

// Use environment variables for better security and flexibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

console.log('[Supabase] Initializing client with URL:', supabaseUrl);

// Use default localStorage for session storage.
// Previously used a custom cookieStorage adapter, but document.cookie writes
// with SameSite=None cause Android WebView's native CookieManager to crash
// when navigation occurs immediately after cookie writes.
// localStorage works reliably with domStorageEnabled={true} and incognito={false}
// set on the WebView.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use a custom key to hide from the buggy native session-syncing script
        storageKey: 'bt_session',
        // Use default localStorage — works in both browsers and WebViews
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // Use implicit flow — PKCE can trigger redirects that crash WebViews
        flowType: 'implicit',
    },
});
