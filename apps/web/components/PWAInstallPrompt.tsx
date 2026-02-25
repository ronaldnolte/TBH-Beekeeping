'use client';

import { useEffect, useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallPromptProps {
    variant?: 'floating' | 'header';
    theme?: 'white' | 'orange';
}

export default function PWAInstallPrompt({ variant = 'floating', theme = 'white' }: PWAInstallPromptProps) {
    const { isInstallable, triggerInstall, canInstall } = usePWAInstall();
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [isChromium, setIsChromium] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        // Detect iOS
        const ua = navigator.userAgent;
        const isIOSDevice = /iPad|iPhone|iPod/.test(ua) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIOS(isIOSDevice);

        // Detect Chromium-based browsers (Chrome, Edge, Brave, etc.)
        const isChrome = /Chrome/.test(ua) && !/Edge/.test(ua) && !/OPR/.test(ua);
        const isEdge = /Edg/.test(ua);
        const isChromiumBased = isChrome || isEdge || /Chromium/.test(ua);
        setIsChromium(isChromiumBased);

        // Check if already installed (standalone mode) OR running in native WebView
        const isWebView = ua.includes('TBHBeekeeperApp');
        const standalone = typeof window !== 'undefined' && (
            window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true
            || ua.includes('f-secure')
            || isWebView
        );
        setIsStandalone(standalone);

        // Check if permanently dismissed
        if (localStorage.getItem('pwa-install-dismissed') === 'true') {
            setDismissed(true);
        }

        // After a reload triggered by Install, show the confirmation modal
        if (sessionStorage.getItem('pwa-install-pending')) {
            sessionStorage.removeItem('pwa-install-pending');
            // Small delay to let beforeinstallprompt fire
            setTimeout(() => {
                setShowConfirmModal(true);
            }, 1000);
        }
    }, []);

    const handleInstallClick = async () => {
        // Check at click time
        if (canInstall()) {
            await triggerInstall();
            return;
        }

        // On Chromium: reload so Chrome re-evaluates installability with the active SW.
        // After reload, a confirmation modal will appear, and the user's click on
        // "Yes" provides the user gesture needed to trigger prompt().
        if (isChromium && !sessionStorage.getItem('pwa-install-pending')) {
            sessionStorage.setItem('pwa-install-pending', '1');
            location.reload();
            return;
        }

        // Fallback: show manual instructions (iOS, or prompt truly unavailable)
        sessionStorage.removeItem('pwa-install-pending');
        setShowTip(!showTip);
    };

    const handleConfirmInstall = async () => {
        setShowConfirmModal(false);
        if (canInstall()) {
            await triggerInstall();
        } else {
            // Prompt still didn't fire - show manual instructions
            setShowTip(true);
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Hide if already installed or permanently dismissed
    if (isStandalone || dismissed) {
        return null;
    }

    // Show on: iOS, Chromium browsers, or if install prompt is ready
    if (!isIOS && !isChromium && !isInstallable) {
        return null;
    }

    const isOrangeTheme = theme === 'orange';

    // Confirmation modal after reload
    const confirmModal = showConfirmModal ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 text-center border border-amber-200">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-lg font-bold text-[#8B4513] mb-2">Install BeekTools?</h3>
                <p className="text-sm text-gray-600 mb-5">
                    Add BeekTools to your device for quick access and offline use.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => setShowConfirmModal(false)}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Not now
                    </button>
                    <button
                        onClick={handleConfirmInstall}
                        className="px-5 py-2 rounded-lg bg-[#E67E22] text-white text-sm font-bold hover:bg-[#d35400] transition-colors shadow-md"
                    >
                        Yes, Install
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    if (variant === 'header') {
        return (
            <>
                <div className="relative inline-block">
                    <button
                        onClick={handleInstallClick}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors font-bold text-xs border ${isOrangeTheme
                            ? 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                            : 'bg-amber-50 hover:bg-amber-100 text-[#8B4513] border-amber-200'
                            }`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Install
                    </button>

                    {/* Instructions Tooltip */}
                    {showTip && (
                        <div className="absolute top-full right-0 mt-2 z-[200] w-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 text-sm text-gray-700">
                            {isIOS ? (
                                <>
                                    <div className="font-bold text-[#8B4513] mb-2">Install on iOS</div>
                                    <ol className="space-y-2 text-[10px] list-decimal list-inside">
                                        <li>Tap <strong>Share</strong> button <span className="inline-block text-base leading-none align-middle">⬆️</span></li>
                                        <li>Tap <strong>&quot;Add to Home Screen&quot;</strong></li>
                                    </ol>
                                </>
                            ) : (
                                <>
                                    <div className="font-bold text-[#8B4513] mb-2">Install Beektools</div>
                                    <div className="text-[10px] text-gray-600">
                                        <p className="mb-1.5">Close Chrome completely, reopen it, and visit this page again.</p>
                                        <p className="text-gray-400">The install option will appear automatically.</p>
                                    </div>
                                </>
                            )}
                            <button
                                onClick={() => setShowTip(false)}
                                className="mt-3 w-full text-center text-[10px] text-gray-400 hover:text-gray-600"
                            >
                                Got it
                            </button>
                            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45" />
                        </div>
                    )}
                </div>
                {confirmModal}
            </>
        );
    }

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-auto">
                <div className="relative">
                    {/* Install Button UI (Floating) */}
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-2 pl-4 rounded-full shadow-2xl border border-amber-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={handleInstallClick}
                            className="flex items-center gap-2 text-[#8B4513] hover:text-[#E67E22] text-xs font-black transition-all transform active:scale-95"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            INSTALL BEEKTOOLS
                        </button>
                        <div className="w-px h-4 bg-amber-200 mx-2"></div>
                        <button
                            onClick={handleDismiss}
                            className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                            aria-label="Dismiss"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Instructions Tooltip */}
                    {showTip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 text-sm text-gray-700 animate-in zoom-in-50 duration-200 origin-bottom">
                            {isIOS ? (
                                <>
                                    <div className="font-bold text-[#8B4513] mb-2">Install on iOS</div>
                                    <ol className="space-y-2 text-xs list-decimal list-inside">
                                        <li>Tap the <strong>Share</strong> button <span className="inline-block text-base leading-none align-middle">⬆️</span></li>
                                        <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></li>
                                    </ol>
                                </>
                            ) : (
                                <>
                                    <div className="font-bold text-[#8B4513] mb-2 text-center">Install Beektools</div>
                                    <div className="text-xs text-gray-600 text-center">
                                        <p className="mb-1.5">Close Chrome completely, reopen it, and come back to this page.</p>
                                        <p className="text-[10px] text-gray-400">The install option will appear automatically.</p>
                                    </div>
                                </>
                            )}
                            <button
                                onClick={() => setShowTip(false)}
                                className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 font-bold"
                            >
                                GOT IT
                            </button>
                            {/* Arrow */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
                        </div>
                    )}
                </div>
            </div>
            {confirmModal}
        </>
    );
}
