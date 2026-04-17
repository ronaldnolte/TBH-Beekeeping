'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface BetaSignup {
    id: string;
    email: string;
    created_at: string;
    approved: boolean;
    approved_at: string | null;
}

export async function getBetaSignups(): Promise<{ success: boolean; signups?: BetaSignup[]; error?: string }> {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
        .from('beta_signups')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching beta signups:', error);
        return { success: false, error: error.message };
    }

    return { success: true, signups: data };
}

export async function approveBetaTester(id: string, email: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update the record
    const { error } = await supabase
        .from('beta_signups')
        .update({ approved: true, approved_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error approving beta tester:', error);
        return { success: false, error: error.message };
    }

    // Send approval email via Resend
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'BeekTools <onboarding@resend.dev>',
                to: email,
                subject: '🐝 You\'re In! BeekTools Beta Access Approved',
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F59E0B, #EA580C); border-radius: 16px 16px 0 0;">
                            <div style="font-size: 48px; margin-bottom: 10px;">🐝</div>
                            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to the BeekTools Beta!</h1>
                        </div>
                        <div style="padding: 30px 20px; background: #FFFBEB; border: 1px solid #FDE68A; border-top: none; border-radius: 0 0 16px 16px;">
                            <p style="color: #4A3C28; font-size: 16px; line-height: 1.6;">
                                Great news — your beta access has been approved! You can now download and install BeekTools on your Android device.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="https://play.google.com/apps/testing/com.beektools.beekeeper"
                                   style="display: inline-block; background: #F59E0B; color: white; font-weight: bold; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
                                    📱 Install BeekTools from Google Play
                                </a>
                            </div>
                            <p style="color: #78716C; font-size: 14px; line-height: 1.5;">
                                <strong>How to get started:</strong>
                            </p>
                            <ol style="color: #78716C; font-size: 14px; line-height: 1.8;">
                                <li>Click the button above on your Android device</li>
                                <li>Accept the beta tester invite on Google Play</li>
                                <li>Install the app and create your account</li>
                                <li>Start managing your hives! 🍯</li>
                            </ol>
                            <hr style="border: none; border-top: 1px solid #FDE68A; margin: 20px 0;" />
                            <p style="color: #A8A29E; font-size: 12px; text-align: center;">
                                Questions? Reply to this email or visit <a href="https://beektools.com" style="color: #F59E0B;">beektools.com</a>
                            </p>
                        </div>
                    </div>
                `,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Resend error:', err);
            return { success: true, error: 'Approved but email failed to send. You may need to notify them manually.' };
        }
    } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        return { success: true, error: 'Approved but email failed to send. You may need to notify them manually.' };
    }

    return { success: true };
}
