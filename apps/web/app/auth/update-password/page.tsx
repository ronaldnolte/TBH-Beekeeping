'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import { navigateTo } from '../../../lib/navigation';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(true); // New state to hold off showing the form/error
    const [verifyingStatus, setVerifyingStatus] = useState('Verifying security link...');
    const router = useRouter();

    const exchangeAttempted = useRef(false);

    useEffect(() => {
        const checkSession = async () => {
            // Prevent double-invocation in Strict Mode
            if (exchangeAttempted.current) return;
            exchangeAttempted.current = true;

            // 1. Check immediate session
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setVerifying(false);
                return;
            }

            // 2. Check for PKCE Code in URL
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                console.log('PKCE code detected, attempting exchange...');
                setVerifyingStatus('Exchanging security code...');
                try {
                    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                    if (data.session) {
                        console.log('Session exchanged successfully');
                        setVerifying(false); // Success!
                        return;
                    }
                    if (error) {
                        console.error('Exchange error:', error);
                        // If code is invalid (e.g. reused), we might still have a session from before? 
                        // If not, we are stuck.
                    }
                } catch (e) {
                    console.error('Exchange exception:', e);
                }
            }

            // 3. If still no session, wait for auto-recovery events
            // Listen for the SIGNED_IN or PASSWORD_RECOVERY event
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                console.log('Auth Event:', event);
                if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
                    setVerifying(false);
                    setError('');
                }
            });

            // 4. Set fallback timeout (10 seconds)
            setTimeout(async () => {
                const { data: { session: finalSession } } = await supabase.auth.getSession();
                if (!finalSession) {
                    setVerifying(false);
                    setError('Unable to verify session. The link may have expired, or the connection is slow.');
                }
            }, 10000);

            return () => subscription.unsubscribe();
        };

        checkSession();
    }, []);

    const handleRetry = () => {
        window.location.reload();
    };

    // While verifying, show a loading spinner, NOT the form
    if (verifying) {
        return (
            <div className="min-h-screen honeycomb-bg flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="animate-pulse text-4xl mb-4">🔑</div>
                    <p className="text-gray-600 font-medium">{verifyingStatus}</p>
                    <p className="text-xs text-gray-400 mt-2">Please wait...</p>
                </div>
            </div>
        );
    }

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

                    {error && (
                        <div className="bg-red-50 p-3 rounded border border-red-100">
                            <div className="text-red-600 text-sm font-bold mb-2">{error}</div>
                            {error.includes('verify session') && (
                                <button
                                    type="button"
                                    onClick={handleRetry}
                                    className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-200 font-semibold"
                                >
                                    ↻ Retry Verification
                                </button>
                            )}
                        </div>
                    )}
                    {message && <div className="text-green-600 text-sm font-bold bg-green-50 p-2 rounded">{message}</div>}

                    <button
                        type="submit"
                        disabled={loading || !!error} // Disable if error (unless they retry)
                        className="w-full py-3 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold rounded shadow transition-transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>

                    <div className="text-center mt-4">
                        <button onClick={() => navigateTo('/')} className="text-sm text-gray-500 hover:text-[#E67E22] underline bg-transparent border-none cursor-pointer p-0">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
