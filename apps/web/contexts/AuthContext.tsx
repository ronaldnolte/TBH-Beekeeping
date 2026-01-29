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
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    userId: undefined,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('[AuthProvider] Initializing...');

        const checkAdminStatus = async (userId: string) => {
            const { data } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .eq('role', 'admin')
                .maybeSingle();
            setIsAdmin(!!data);
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('[AuthProvider] Error getting initial session:', error);
            }
            if (session?.user) {
                checkAdminStatus(session.user.id);
            }
            setSession(session);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[AuthProvider] Auth state changed:', event);
            setSession(session);
            if (session?.user) {
                checkAdminStatus(session.user.id);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value: AuthContextType = {
        session,
        user: session?.user || null,
        userId: session?.user?.id,
        loading,
        isAuthenticated: !!session,
        isAdmin,
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
