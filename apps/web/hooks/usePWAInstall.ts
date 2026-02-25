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

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const triggerInstall = async () => {
        // Read directly from global at click time - more reliable than state
        const prompt = deferredPrompt || (window as any)._deferredPWAPrompt;
        if (!prompt) {
            return false;
        }
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        setDeferredPrompt(null);
        setIsInstallable(false);
        (window as any)._deferredPWAPrompt = null;
        return outcome;
    };

    // Live check so components can test installability at click time
    const canInstall = () => !!(deferredPrompt || (window as any)._deferredPWAPrompt);

    return { isInstallable, triggerInstall, canInstall };
}
