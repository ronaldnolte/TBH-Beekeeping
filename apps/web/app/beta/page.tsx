'use client';

import { useState } from 'react';
import { submitBetaSignup } from '../actions/beta';

// TODO: Replace this with your actual Play Console Closed Testing join URL
// Found at: Play Console → Closed testing → Alpha track → Testers tab → "How testers join your test"
const PLAY_CONSOLE_JOIN_URL = 'https://play.google.com/apps/testing/com.beektools.beekeeper';

export default function BetaPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const result = await submitBetaSignup(email);

        if (result.success) {
            setStatus('success');
        } else {
            setStatus('error');
            setMessage(result.error || 'Something went wrong.');
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center px-4 py-16">
            <div className="max-w-lg w-full">

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* Hero Banner */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-10 text-center text-white">
                        <div className="text-6xl mb-4">🐝</div>
                        <h1 className="text-3xl font-bold mb-2">Coming to Android</h1>
                        <p className="text-amber-100 text-lg">TBH Beekeeper is heading to Google Play</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8">
                        {status === 'success' ? (
                            /* Success State */
                            <div className="text-center py-4">
                                <div className="text-5xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">You're on the list!</h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    We'll add your email to the beta within <strong>24 hours</strong>. Once you've been added,
                                    tap the button below on your Android device to activate your access.
                                </p>
                                <a
                                    href={PLAY_CONSOLE_JOIN_URL}
                                    className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 text-center"
                                >
                                    📱 Join the Beta on Google Play
                                </a>
                                <p className="text-xs text-gray-400 mt-4">
                                    This link will work after your email has been added (usually within 24 hours).
                                </p>
                            </div>
                        ) : (
                            /* Sign Up Form */
                            <>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Join the Beta</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Be among the first Android users to try TBH Beekeeper. Enter your Gmail address below
                                    and we'll add you to our beta tester list within 24 hours.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="beta-email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Gmail Address
                                        </label>
                                        <input
                                            id="beta-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@gmail.com"
                                            required
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-red-500 text-sm">{message}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        id="beta-signup-submit"
                                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95"
                                    >
                                        {status === 'loading' ? 'Signing you up…' : '🚀 Request Beta Access'}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h3 className="font-semibold text-gray-700 mb-3">What you get as a beta tester:</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2"><span>🐝</span> Early access before public launch</li>
                                        <li className="flex items-start gap-2"><span>📋</span> Hive inspection tracking & history</li>
                                        <li className="flex items-start gap-2"><span>🔬</span> Varroa mite testing with HBHC standards</li>
                                        <li className="flex items-start gap-2"><span>🤖</span> AI-powered beekeeping assistant</li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Must have an Android device to participate in the beta.
                    Your email is only used for beta access — never shared.
                </p>
            </div>
        </main>
    );
}
