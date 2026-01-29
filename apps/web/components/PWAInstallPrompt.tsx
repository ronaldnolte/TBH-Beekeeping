'use client';

import { useEffect, useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PWAInstallPrompt() {
    const { isInstallable, triggerInstall } = usePWAInstall();
    const [isDismissed, setIsDismissed] = useState(false);
    const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);

    useEffect(() => {
        // Check for service worker support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((err) => {
                    console.error('Service Worker registration failed:', err);
                });
        }

        // Check if user has permanently dismissed the prompt
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed === 'true') {
            setIsPermanentlyDismissed(true);
        }
    }, []);

    const handleInstallClick = async () => {
        await triggerInstall();
        // After install outcome, we can choose to dismiss or keep it open if failed. 
        // Usually, the prompt itself handles the flow. 
        // If installed, isInstallable will become false via the hook's logic.
    };

    const handleDismiss = () => {
        setIsDismissed(true);
    };

    const handleDontShowAgain = () => {
        setIsDismissed(true);
        setIsPermanentlyDismissed(true);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Only show if:
    // 1. The browser says it's installable
    // 2. It hasn't been dismissed in this session
    // 3. It hasn't been permanently dismissed
    if (!isInstallable || isDismissed || isPermanentlyDismissed) {
        return null;
    }

    return (
        <>
            {/* 
        Fixed top floating pill over logo area.
        Z-index high to be above other content.
      */}
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9000] w-auto max-w-sm animate-in zoom-in duration-300">
                <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 shadow-2xl rounded-xl p-3 flex flex-col items-center text-center gap-2 text-white">

                    <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm">Install TBH Beekeeper</span>
                        <p className="text-xs text-slate-300">
                            Quick access from your home screen
                        </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <button
                            onClick={handleInstallClick}
                            className="bg-[#F5A623] text-black py-1 px-3 rounded text-xs font-bold hover:bg-[#D99015] transition-colors"
                        >
                            Install
                        </button>
                        <button
                            onClick={handleDontShowAgain}
                            className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
                        >
                            Don't show
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="text-slate-400 hover:text-white p-1 transition-colors"
                            aria-label="Close"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
