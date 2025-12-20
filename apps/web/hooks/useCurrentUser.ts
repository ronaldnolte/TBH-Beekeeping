import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

// Type declaration for React Native WebView
declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}


export function useCurrentUser() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Detect WebView
        const isWebView = typeof window !== 'undefined' && /TBHBeekeeperApp/.test(navigator.userAgent);
        console.log('[useCurrentUser] Is WebView:', isWebView);
        console.log('[useCurrentUser] User Agent:', typeof window !== 'undefined' ? navigator.userAgent : 'SSR');

        // 1. Get initial session
        supabase.auth.getSession()
            .then(({ data: { session }, error }) => {
                if (error) {
                    console.error('[useCurrentUser] Error getting session:', error);
                    if (isWebView && window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'auth_session_error',
                            error: error.message
                        }));
                    }
                }
                console.log('[useCurrentUser] Initial session:', session ? 'Found' : 'None');
                setSession(session);
                setLoading(false);
            })
            .catch(err => {
                console.error('[useCurrentUser] Auth check failed:', err);
                if (isWebView && window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'auth_check_failed',
                        error: err.message || err.toString()
                    }));
                }
                setLoading(false);
            });

        // 2. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        // For now, user object is just the session user. 
        // If we need a profile/user table again, we fetch it here.
        user: session?.user || null,
        userId: session?.user?.id,
        loading,
        isAuthenticated: !!session
    };
}
