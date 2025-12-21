'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    userId: string | undefined;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    userId: undefined,
    loading: true,
    isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('[AuthProvider] Initializing...');

        // Get initial session from storage
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('[AuthProvider] Error getting initial session:', error);
            } else {
                console.log('[AuthProvider] Initial session:', session ? 'Found (User: ' + session.user.email + ')' : 'None');
            }
            setSession(session);
            setLoading(false);
        });

        // Listen for auth state changes (ONLY ONCE for the entire app)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[AuthProvider] Auth state changed:', event, session ? 'Session active' : 'No session');
            setSession(session);
            setLoading(false);
        });

        return () => {
            console.log('[AuthProvider] Cleaning up subscription');
            subscription.unsubscribe();
        };
    }, []);

    const value: AuthContextType = {
        session,
        user: session?.user || null,
        userId: session?.user?.id,
        loading,
        isAuthenticated: !!session,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
