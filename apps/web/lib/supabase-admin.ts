import { createClient } from '@supabase/supabase-js';

// Use environment variables for better security
// Note: This file should ONLY be used on the server-side as it requires the SERVICE_ROLE_KEY
// which has full admin access to the database.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wrdnwzgztwzoigkoebeq.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
    // We don't throw here to allow building, but admin functions will fail if key is missing
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Admin functions will not work.');
}

// Create Supabase Admin client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
