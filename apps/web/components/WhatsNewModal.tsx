'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';

export function WhatsNewModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('whats-new-seen-v1.2');
        if (!hasSeen) {
            // Delay slightly for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('whats-new-seen-v1.2', 'true');
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="What's New in BeekTools">
            <div className="space-y-6 py-2">
                {/* Feature 1: Standalone Forecast */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        ⛅
                    </div>
                    <div>
                        <h4 className="font-bold text-[#8B4513]">Standalone Forecast App</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Need a quick weather check without logging in? We've launched a lightweight standalone
                            forecast app at <a href="https://forecast.beektools.com" target="_blank" rel="noopener" className="text-amber-700 font-bold underline">forecast.beektools.com</a>.
                        </p>
                    </div>
                </div>

                {/* Feature 2: Global Support */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        🌍
                    </div>
                    <div>
                        <h4 className="font-bold text-[#8B4513]">Expanded Global Support</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Beekeeping is global! We've added support for 31 countries including all EU members,
                            Ghana, Norway, Switzerland, and New Zealand.
                        </p>
                    </div>
                </div>

                {/* Feature 3: PWA Enhancements */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        📱
                    </div>
                    <div>
                        <h4 className="font-bold text-[#8B4513]">Better App Installation</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Installing BeekTools to your home screen is now easier on iOS and Chromium browsers
                            with clearer instructions and better reliability.
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
