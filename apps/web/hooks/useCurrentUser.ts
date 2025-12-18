import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export function useCurrentUser() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        }).catch(err => {
            console.error('Auth check failed', err);
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
