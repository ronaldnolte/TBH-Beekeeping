'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { navigateTo } from '../lib/navigation';

export default function FeedbackButton() {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [replyTo, setReplyTo] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [showPulse, setShowPulse] = useState(false);

    useEffect(() => {
        const hasSeenFeedback = localStorage.getItem('hasSeenFeedbackFeature');
        if (!hasSeenFeedback) {
            setShowPulse(true);
        }
    }, []);

    // Hide on login page and other auth pages
    if (pathname === '/' || pathname?.startsWith('/auth/')) {
        return null;
    }

    const handleOpen = () => {
        setIsOpen(true);
        if (showPulse) {
            setShowPulse(false);
            localStorage.setItem('hasSeenFeedbackFeature', 'true');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, replyTo }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorDetails(data.details || data.error || 'Failed to send');
                throw new Error(data.error || 'Failed to send');
            }

            setStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setMessage('');
                setReplyTo('');
                setStatus('idle');
                setErrorDetails(null);
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <>
            <style>{`
                @keyframes custom-pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .notification-pulse {
                    animation: custom-pulse 2s infinite;
                    border-radius: 50%;
                }
            `}</style>

            {/* Floating Button */}
            <button
                onClick={handleOpen}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'fixed',
                    bottom: '80px',
                    left: '20px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: isHovered ? '#D97706' : '#F5A623',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    cursor: 'pointer',
                    display: isOpen ? 'none' : 'flex', // Hide when modal is open
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    zIndex: 9999,
                }}
                title="Send Feedback"
                aria-label="Send Feedback"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>

                {/* Pulse Notification Dot */}
                {showPulse && (
                    <div
                        className="notification-pulse"
                        style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#ef4444',
                            borderRadius: '50%',
                            border: '2px solid white',
                            zIndex: 1,
                        }}
                    />
                )}
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="bg-[#F5A623] p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <span>📧</span> Send Feedback
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {status === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">✅</div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h4>
                                    <p className="text-gray-600">Thanks for your feedback.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* New Roadmap Link */}
                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                        <h4 className="font-bold text-amber-900 mb-1">Have a Feature Idea? 💡</h4>
                                        <p className="text-sm text-amber-800/80 mb-3">Vote on existing requests or submit your own ideas to our public roadmap.</p>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigateTo('/feedback');
                                            }}
                                            className="block w-full text-center bg-white border border-amber-300 text-amber-700 py-2 rounded-lg font-bold hover:bg-amber-100 transition-colors"
                                        >
                                            View Roadmap & Vote →
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">Or send a private message</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                                            <textarea
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="What's on your mind? Suggestions, bugs, or questions..."
                                                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] outline-none resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Your Email <span className="text-gray-400 font-normal">(Optional)</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={replyTo}
                                                onChange={(e) => setReplyTo(e.target.value)}
                                                placeholder="If you'd like a reply..."
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-[#F5A623] outline-none"
                                            />
                                        </div>

                                        {status === 'error' && (
                                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex flex-col gap-1">
                                                <div className="font-bold">Failed to send.</div>
                                                {errorDetails && <div className="text-xs opacity-80">{errorDetails}</div>}
                                                <div className="text-xs mt-1 italic">You can also email feedback@beektools.com</div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={status === 'sending' || !message.trim()}
                                                className="bg-[#8B4513] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#723910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {status === 'sending' ? (
                                                    <>
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>Send Feedback 🚀</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
