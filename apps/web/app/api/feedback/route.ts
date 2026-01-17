import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { message, replyTo } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Check for credentials
        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;

        console.log('Available env keys:', Object.keys(process.env).filter(k => k.includes('GMAIL') || k.includes('SUPABASE')));
        console.log('Attempting to send feedback using user:', user ? `${user.substring(0, 3)}...` : 'undefined');

        if (!user || !pass) {
            console.error('Missing Gmail credentials in .env.local');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass,
            },
        });

        // Email content
        const mailOptions = {
            from: `TBH Beekeeper App <${user}>`,
            to: 'ron.nolte@gmail.com', // Always send to Ron
            replyTo: replyTo || user,   // Allow replying to user if provided
            subject: '🐝 App Feedback: TBH Beekeeper',
            text: `New feedback received:\n\n${message}\n\n---\nSent from TBH Beekeeper App\nReply-to: ${replyTo || 'Not provided'}`,
        };

        // Send email
        console.log('Sending email via nodemailer...');
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Nodemailer Error:', error.message || error);
        if (error.code) console.error('Error Code:', error.code);
        if (error.command) console.error('Failed Command:', error.command);
        return NextResponse.json(
            { error: 'Failed to send feedback', details: error.message },
            { status: 500 }
        );
    }
}
