import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Pick up any event that was captured before React hydrated
        const early = (window as any)._deferredPWAPrompt;
        if (early) {
            console.log('[PWA Hook] Found early-captured beforeinstallprompt event');
            setDeferredPrompt(early as BeforeInstallPromptEvent);
            setIsInstallable(true);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('[PWA Hook] beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
                console.log('[PWA Hook] SW Registration status:', reg ? 'Active' : 'Missing');
            });
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const triggerInstall = async () => {
        if (!deferredPrompt) {
            return;
        }
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsInstallable(false);

        return outcome;
    };

    return { isInstallable, triggerInstall };
}
