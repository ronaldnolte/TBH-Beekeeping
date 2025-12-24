// Supabase Edge Function to reset guest account data
// Deploy this to Supabase Functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Create Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get the user from the request
        const authHeader = req.headers.get('Authorization')!
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // Check if this is the guest user
        if (user.email !== 'guest@beektools.com') {
            return new Response(
                JSON.stringify({ message: 'Not a guest user, no reset needed' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        console.log('Resetting guest account data...')

        // Get guest user ID from auth schema
        const { data: authUser } = await supabaseClient
            .from('auth.users')
            .select('id')
            .eq('email', 'guest@beektools.com')
            .single()

        if (!authUser) {
            throw new Error('Guest user not found')
        }

        const guestUserId = authUser.id

        // Delete all guest data in correct order (to respect foreign keys)

        // 1. Tasks
        await supabaseClient
            .from('tasks')
            .delete()
            .eq('assigned_user_id', guestUserId)

        // 2. Interventions
        const { data: hives } = await supabaseClient
            .from('hives')
            .select('id')
            .eq('user_id', guestUserId)

        const hiveIds = hives?.map(h => h.id) || []

        if (hiveIds.length > 0) {
            await supabaseClient
                .from('interventions')
                .delete()
                .in('hive_id', hiveIds)
        }

        // 3. Hive snapshots
        if (hiveIds.length > 0) {
            await supabaseClient
                .from('hive_snapshots')
                .delete()
                .in('hive_id', hiveIds)
        }

        // 4. Inspections
        if (hiveIds.length > 0) {
            await supabaseClient
                .from('inspections')
                .delete()
                .in('hive_id', hiveIds)
        }

        // 5. Hives
        await supabaseClient
            .from('hives')
            .delete()
            .eq('user_id', guestUserId)

        // 6. Apiaries
        await supabaseClient
            .from('apiaries')
            .delete()
            .eq('user_id', guestUserId)

        console.log('Guest data deleted, restoring seed data...')

        // TODO: Insert seed data here
        // This will be populated from export_guest_seed_data.sql output

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Guest account reset successfully'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
