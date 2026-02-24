'use client';

import { useEffect, useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallPromptProps {
    variant?: 'floating' | 'header';
    theme?: 'white' | 'orange';
}

export default function PWAInstallPrompt({ variant = 'floating', theme = 'white' }: PWAInstallPromptProps) {
    const { isInstallable, triggerInstall } = usePWAInstall();
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [isChromium, setIsChromium] = useState(false);

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
            || ua.includes('f-secure') // Some security wrappers use standalone mode
            || isWebView
        );
        setIsStandalone(standalone);

        // Check if permanently dismissed
        if (localStorage.getItem('pwa-install-dismissed') === 'true') {
            setDismissed(true);
        }
    }, []);

    const handleInstallClick = async () => {
        console.log('[PWA] Launching install flow. isInstallable:', isInstallable);
        if (isInstallable) {
            // Native install prompt available — use it
            await triggerInstall();
            return;
        }

        // Fallback: show instructions
        setShowTip(!showTip);
    };

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Debugging logs
    useEffect(() => {
        console.log('[PWA] Status Check:', {
            isStandalone,
            dismissed,
            isIOS,
            isChromium,
            isInstallable,
            variant,
            theme,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
        });
    }, [isStandalone, dismissed, isIOS, isChromium, isInstallable, variant, theme]);

    // Hide if already installed or permanently dismissed
    if (isStandalone || dismissed) {
        return null;
    }

    // Show on: iOS, Chromium browsers, or if install prompt is ready
    if (!isIOS && !isChromium && !isInstallable) {
        return null;
    }

    const isOrangeTheme = theme === 'orange';

    if (variant === 'header') {
        return (
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
                                    <li>Tap <strong>"Add to Home Screen"</strong></li>
                                </ol>
                            </>
                        ) : (
                            <>
                                <div className="font-bold text-[#8B4513] mb-2">Install Beektools</div>
                                <div className="space-y-1.5 text-[10px]">
                                    <p>If you see a <strong>⬇</strong> icon in the address bar, click it to install.</p>
                                    <p className="text-gray-500 border-t border-gray-100 pt-1.5">
                                        <strong>Already installed before?</strong> Uninstall it first from Windows Start menu or <span className="font-mono">chrome://apps</span>, then revisit this page.
                                    </p>
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
        );
    }

    return (
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
                                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                                </ol>
                            </>
                        ) : (
                            <>
                                <div className="font-bold text-[#8B4513] mb-2 text-center">Install Beektools</div>
                                <div className="space-y-1.5 text-xs text-center">
                                    <p>Look for a <strong>⬇</strong> icon in the address bar and click it.</p>
                                    <p className="text-gray-500 text-[10px] border-t border-gray-100 pt-1.5">
                                        <strong>Installed before?</strong> Uninstall from the Windows Start menu or <span className="font-mono text-[9px]">chrome://apps</span> first, then come back here.
                                    </p>
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
    );
}
