'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check if we have a session (handled automatically by Supabase client from URL hash)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Give it a moment, sometimes the hash processing takes a tick
                setTimeout(async () => {
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (!retrySession) {
                        setError('Auth session missing! The link may be invalid or expired. Try requesting a new one.');
                    }
                }, 1000);
            }
        };
        checkSession();

        // Also listen for the recovery event to be sure
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setError(''); // Clear error if we just recovered
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // Ensure we really have a session before calling update
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Auth session missing! Please click the link in your email again.');
            }

            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) {
                setError(error.message);
            } else {
                setMessage('Success! Your password has been updated.');
                setTimeout(() => {
                    router.push('/apiary-selection');
                }, 2000);
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
                    <div className="text-4xl mb-2">🔐</div>
                    <h1 className="text-2xl font-serif font-bold text-[#4A3C28]">Set New Password</h1>
                    <p className="text-sm text-gray-500 mt-2">Enter your new secure password below.</p>
                    <p className="text-xs text-amber-600 mt-1 bg-amber-50 p-2 rounded border border-amber-100">
                        Note: If you arrived here from an email link, you are temporarily logged in.
                    </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#4A3C28] mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-[#D1C4A9] rounded focus:ring-2 focus:ring-[#E67E22] outline-none"
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#4A3C28] mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full px-4 py-2 border border-[#D1C4A9] rounded focus:ring-2 focus:ring-[#E67E22] outline-none"
                            placeholder="Re-type password"
                        />
                    </div>

                    {error && <div className="text-red-600 text-sm font-bold bg-red-50 p-2 rounded">{error}</div>}
                    {message && <div className="text-green-600 text-sm font-bold bg-green-50 p-2 rounded">{message}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold rounded shadow transition-transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>

                    <div className="text-center mt-4">
                        <a href="/" className="text-sm text-gray-500 hover:text-[#E67E22] underline">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
