'use server';

import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../../lib/supabase-admin';
import { cookies } from 'next/headers';

// Initialize a standard client to check the current user's session
const createInternalClient = async () => {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('supabase-auth-token');

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        }
    );

    if (tokenCookie?.value) {
        try {
            const jsonStr = decodeURIComponent(tokenCookie.value);
            const session = JSON.parse(jsonStr);
            if (session.access_token && session.refresh_token) {
                await supabase.auth.setSession({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                });
            }
        } catch (e) {
            console.error('Error parsing session cookie:', e);
        }
    }

    return supabase;
};

// Check if current user is an admin
async function checkAdminAccess() {
    const supabase = await createInternalClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    // Verify role in user_roles table
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

    if (!roleData) {
        throw new Error('Forbidden: Admin access required');
    }

    return session.user;
}

export async function getUsers(page = 1, perPage = 50) {
    try {
        // 1. Verify Access
        await checkAdminAccess();

        // 2. Fetch Users via Admin API
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
            page: page,
            perPage: perPage,
        });

        if (error) throw error;

        return { success: true, users };
    } catch (error: any) {
        console.error('Error fetching users:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteUser(userId: string) {
    try {
        // 1. Verify Access
        const adminUser = await checkAdminAccess();

        // Prevent self-deletion
        if (userId === adminUser.id) {
            throw new Error('Cannot delete your own admin account.');
        }

        // 2. Delete User via Admin API
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) throw error;

        // 3. Explicitly delete from public.users if cascade fails or for safety (Optional, but cascade should handle it)
        // We rely on CASCADE constraints as per plan.

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return { success: false, error: error.message };
    }
}
