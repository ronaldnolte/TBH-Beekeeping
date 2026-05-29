'use client';

import { useState } from 'react';
import { submitBetaSignup } from '../actions/beta';
import { ArrowLeft, Sparkles, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Play Console Closed Testing join URL
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
        <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF0] to-[#FFF6E5] text-[#2D2A26] flex flex-col justify-between font-sans selection:bg-[#F5A623]/30 selection:text-[#723910] relative overflow-x-hidden">
            
            {/* Dynamic Background Glows */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#F5A623]/5 to-transparent blur-3xl pointer-events-none z-0" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#E99B1A]/5 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute top-80 right-10 w-96 h-96 bg-[#F5B731]/5 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Header */}
            <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#F5A623]/10">
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F5A623] to-[#D97706] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#F5A623]/20">
                        <span className="text-xl">🐝</span>
                    </div>
                    <span className="text-xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#8B4513] to-[#C47F0A]">
                        BeekTools
                    </span>
                </Link>
                <Link 
                    href="/" 
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#7A7468] hover:text-[#8B4513] bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/85 shadow-sm transition-all"
                >
                    <ArrowLeft size={12} /> Back to Portal
                </Link>
            </header>

            {/* Main Form Area */}
            <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
                <div className="bg-white/70 backdrop-blur-sm border-2 border-[#E0D8C8]/40 p-6 sm:p-8 rounded-3xl shadow-xl overflow-hidden relative">
                    {/* Warm glow inside card */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F5A623]/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Card Title & Icon */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#F5A623] to-[#D97706] rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#F5A623]/10 mx-auto mb-4">
                            <Smartphone size={28} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#4A3C28] tracking-tight">
                            Android Closed Beta
                        </h1>
                        <p className="text-sm font-semibold text-[#7A7468] mt-2">
                            Get BeekTools Beekeeper early on Google Play
                        </p>
                    </div>

                    <div className="relative z-10">
                        {status === 'success' ? (
                            /* Success State */
                            <div className="text-center py-4">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                                    <CheckCircle size={24} />
                                </div>
                                <h2 className="text-xl font-black text-[#4A3C28] mb-3">You're on the whitelist!</h2>
                                <p className="text-sm font-medium text-[#7A7468] leading-relaxed mb-6">
                                    We'll add your email to our Google Play tester list within <strong>24 hours</strong>. Once authorized, tap the button below on your Android device to join and download.
                                </p>
                                <a
                                    href={PLAY_CONSOLE_JOIN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full justify-center bg-gradient-to-r from-[#8B4513] to-[#723910] hover:brightness-105 text-white font-black py-4 px-8 rounded-2xl shadow-md transition-all active:scale-95 text-center text-sm"
                                >
                                    📱 Join Beta on Google Play
                                </a>
                                <p className="text-[11px] text-[#A19B90] mt-4 font-bold uppercase tracking-wider">
                                    Access activates once your email is processed.
                                </p>
                            </div>
                        ) : (
                            /* Sign Up Form */
                            <>
                                <p className="text-sm font-medium text-[#7A7468] mb-6 leading-relaxed">
                                    Register your Google Account email address below. We'll whitelist your account and send you a welcome notification within 24 hours to download the native app.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="beta-email" className="block text-xs font-black uppercase tracking-wider text-[#7A7468] mb-1.5 pl-1">
                                            Google Account Email
                                        </label>
                                        <input
                                            id="beta-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your-google-email@example.com"
                                            required
                                            className="w-full bg-[#FFFBF0] border-2 border-[#E6DCC3] focus:border-[#F5A623] rounded-2xl px-4 py-3.5 text-sm text-[#4A3C28] font-semibold focus:outline-none transition-all placeholder:text-[#A19B90]"
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-xs font-semibold">
                                            <AlertCircle size={14} className="flex-shrink-0" />
                                            <span>{message}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        id="beta-signup-submit"
                                        className="w-full bg-gradient-to-r from-[#8B4513] to-[#723910] hover:brightness-105 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-md transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? 'Requesting Access...' : (
                                            <>🚀 Request Beta Access</>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-[#F5A623]/10">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#8B4513] mb-4 flex items-center gap-1.5">
                                        <Sparkles size={12} /> Beta Privileges
                                    </h3>
                                    <ul className="space-y-3.5 text-xs font-bold text-[#7A7468]">
                                        <li className="flex items-center gap-2.5">
                                            <span className="w-5 h-5 bg-[#FFFBF0] border border-[#E6DCC3] rounded-lg flex items-center justify-center text-[10px]">🐝</span>
                                            Full Top Bar & Langstroth hive tracker
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <span className="w-5 h-5 bg-[#FFFBF0] border border-[#E6DCC3] rounded-lg flex items-center justify-center text-[10px]">📅</span>
                                            Integrated forecast planner
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <span className="w-5 h-5 bg-[#FFFBF0] border border-[#E6DCC3] rounded-lg flex items-center justify-center text-[10px]">🔬</span>
                                            Varroa mite standard load calculation
                                        </li>
                                        <li className="flex items-center gap-2.5">
                                            <span className="w-5 h-5 bg-[#FFFBF0] border border-[#E6DCC3] rounded-lg flex items-center justify-center text-[10px]">🤖</span>
                                            AI-powered hive advisory
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-[11px] font-semibold text-[#A19B90] mt-6 leading-relaxed max-w-sm mx-auto">
                    An active Android device is required to install the beta build. 
                    We protect your data and only use this email to enable Google Play permissions.
                </p>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 border-t border-[#F5A623]/10 text-center text-xs font-black uppercase tracking-wider text-[#A19B90] flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    © 2026 BeekTools. All rights reserved.
                </div>
                <div className="flex justify-center gap-4">
                    <span>Smarter Apiary Management</span>
                    <span className="text-[#F5A623]">•</span>
                    <span>Android Closed Testing</span>
                </div>
            </footer>

        </div>
    );
}
