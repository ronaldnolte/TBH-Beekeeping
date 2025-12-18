import { useState, useEffect } from 'react';
import { database } from '../lib/database';
import { User } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safety timeout
        const safetyTimer = setTimeout(() => {
            console.warn('User auth/sync timed out, forcing load completion');
            setLoading(false);
        }, 5000);

        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setSession(session);
                // Don't wait for this promise for the loading state if it hangs
                syncUserToLocalDB(session.user.id, session.user.email)
                    .then(() => clearTimeout(safetyTimer));
            } else {
                setSession(null);
                setLoading(false);
                clearTimeout(safetyTimer);
            }
        }).catch(err => {
            console.error('Auth check failed', err);
            setLoading(false);
            clearTimeout(safetyTimer);
        });

        // 2. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                syncUserToLocalDB(session.user.id, session.user.email);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, []);

    // Ensure local DB has a User record matching the Auth ID
    const syncUserToLocalDB = async (authId: string, email?: string) => {
        try {
            const usersCollection = database.collections.get<User>('users');

            // Check if user exists locally
            const localUser = await usersCollection.find(authId).catch(() => null);

            if (localUser) {
                setUser(localUser);
            } else {
                // Create local user stub
                await database.write(async () => {
                    const newUser = await usersCollection.create(user => {
                        user._raw.id = authId; // IMPORTANT: Force ID match
                        user.email = email || '';
                        user.displayName = email?.split('@')[0] || 'Beekeeper';
                    });
                    setUser(newUser);
                });
            }
        } catch (error) {
            console.error('Failed to sync user to local DB:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        userId: session?.user?.id, // Return actual auth ID
        loading,
        isAuthenticated: !!session
    };
}
