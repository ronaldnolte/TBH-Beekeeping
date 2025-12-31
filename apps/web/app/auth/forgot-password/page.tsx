'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Determine the redirect URL dynamically based on current environment
            const redirectUrl = `${window.location.origin}/auth/update-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });

            if (error) {
                // Rate limit errors are common here
                setError(error.message);
            } else {
                setMessage(`If an account exists for ${email}, you will receive a password reset link shortly.`);
            }
        } catch (err: any) {
            setError('Unexpected error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DCC3] w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🔑</div>
                    <h1 className="text-2xl font-serif font-bold text-[#4A3C28]">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-2">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#4A3C28] mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-[#D1C4A9] rounded focus:ring-2 focus:ring-[#E67E22] outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    {error && <div className="text-red-600 text-sm font-bold bg-red-50 p-2 rounded">{error}</div>}
                    {message && <div className="text-green-600 text-sm font-bold bg-green-50 p-2 rounded border border-green-200">{message}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold rounded shadow transition-transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center mt-4">
                        <a href="/" className="text-sm text-gray-500 hover:text-[#E67E22] underline">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
