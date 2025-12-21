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
// Custom Cookie Storage Adapter for better WebView persistence
const cookieStorage = {
    getItem: (key: string) => {
        if (typeof document === 'undefined') return null;
        const name = key + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    },
    setItem: (key: string, value: string) => {
        if (typeof document === 'undefined') return;
        // Set cookie for 1 year
        document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax; Secure`;
        // Also sync to localStorage so the Mobile Bridge can pick it up
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
        }
    },
    removeItem: (key: string) => {
        if (typeof document === 'undefined') return;
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(key);
        }
    }
};

// Create Supabase client with WebView-friendly configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use custom storage that syncs both Cookies and LocalStorage
        storage: typeof window !== 'undefined' ? cookieStorage : undefined,
        storageKey: 'supabase.auth.token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
