import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Webhook endpoint called by Supabase when a new user signs up
export async function POST(request: Request) {
    try {
        // Verify the webhook secret to prevent unauthorized calls
        const authHeader = request.headers.get('authorization');
        const webhookSecret = process.env.WEBHOOK_SECRET;

        if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await request.json();

        // Supabase webhook sends the record in the payload
        const record = payload.record || payload;
        const userEmail = record.email || 'Unknown email';
        const createdAt = record.created_at || new Date().toISOString();

        // Gmail credentials
        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;

        if (!user || !pass) {
            console.error('Missing Gmail credentials for signup notification');
            return NextResponse.json({ error: 'Missing email config' }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });

        await transporter.sendMail({
            from: `BeekTools <${user}>`,
            to: 'ron.nolte@gmail.com',
            subject: '🐝 New BeekTools User Signup',
            text: `A new user has signed up for BeekTools!\n\nEmail: ${userEmail}\nTime: ${new Date(createdAt).toLocaleString('en-US', { timeZone: 'America/Denver' })}\n\n---\nSent automatically by BeekTools`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
                    <h2 style="color: #4A3C28;">🐝 New BeekTools Signup</h2>
                    <div style="background: #FFFBF0; border: 1px solid #E6DCC3; border-radius: 8px; padding: 16px; margin: 16px 0;">
                        <p style="margin: 4px 0;"><strong>Email:</strong> ${userEmail}</p>
                        <p style="margin: 4px 0;"><strong>Time:</strong> ${new Date(createdAt).toLocaleString('en-US', { timeZone: 'America/Denver' })}</p>
                    </div>
                    <p style="color: #888; font-size: 12px;">Sent automatically by BeekTools</p>
                </div>
            `,
        });

        console.log(`Signup notification sent for: ${userEmail}`);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Signup notification error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
