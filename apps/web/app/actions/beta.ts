'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function submitBetaSignup(email: string): Promise<{ success: boolean; error?: string }> {
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for duplicate
    const { data: existing } = await supabase
        .from('beta_signups')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

    if (existing) {
        return { success: false, error: 'This email is already on the list!' };
    }

    const { error } = await supabase
        .from('beta_signups')
        .insert({ email: email.toLowerCase().trim() });

    if (error) {
        console.error('Beta signup error:', error);
        return { success: false, error: 'Something went wrong. Please try again.' };
    }

    // Send email notification (fire-and-forget — don't block the user)
    try {
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'BeekTools Beta <onboarding@resend.dev>',
                to: 'ron.nolte@gmail.com',
                subject: '🐝 New Beta Tester Signup!',
                html: `<p>A new user has requested beta access:</p><p><strong>${email.toLowerCase().trim()}</strong></p><p>Add them to your <a href="https://play.google.com/console">Play Console</a> testers list.</p>`,
            }),
        });
    } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
    }

    return { success: true };
}
