'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';

export function WhatsNewModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('whats-new-seen-v1.4');
        if (!hasSeen) {
            // Delay slightly for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('whats-new-seen-v1.4', 'true');
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="What's New in BeekTools">
            <div className="space-y-6 py-2">
                {/* Feature 1: Varroa Mite History */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        🔬
                    </div>
                    <div>
                        <h4 className="font-bold text-[#8B4513]">Varroa Mite History — HBHC Standards</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Track your mite counts over time with a new detailed history view. Results are plotted
                            against <strong>Honey Bee Health Coalition</strong> seasonal thresholds so you can see
                            exactly where your hives stand — period by period.
                        </p>
                    </div>
                </div>

                {/* Feature 2: Ask AI */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        🤖
                    </div>
                    <div>
                        <h4 className="font-bold text-[#8B4513]">Ask the Beekeeping AI</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Have a beekeeping question? Tap <strong>Ask AI</strong> on your apiary screen for
                            instant, season- and location-aware advice powered by Google Gemini.
                        </p>
                    </div>
                </div>

                {/* Feature 3: Coming to Google Play */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        📱
                    </div>
                    <div>
                        <h4 className="font-bold text-[#8B4513]">Coming Soon to Google Play</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            TBH Beekeeper is getting an official Android app! Soon you'll be able to download it directly from the Google Play Store for an even smoother beekeeping experience.
                        </p>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleClose}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </Modal>
    );
}
