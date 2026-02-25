'use client';

import React from 'react';
import { navigateTo } from '../lib/navigation';
import PWAInstallPrompt from './PWAInstallPrompt';
import FeedbackButton from './FeedbackButton';

interface AppHeaderProps {
    title: string;
    subtitle?: string;
    backPath?: string;
    backLabel?: string;
    variant?: 'white' | 'orange';
    actions?: React.ReactNode;
    showPWAInstall?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    subtitle,
    backPath,
    backLabel = 'Back',
    variant = 'white',
    actions,
    showPWAInstall = true,
}) => {
    const isOrange = variant === 'orange';

    return (
        <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${isOrange
            ? 'bg-[#E67E22] text-white shadow-md'
            : 'bg-[#FFFBF0] border-b border-[#E6DCC3] text-gray-900 shadow-sm'
            }`}>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-2 sm:py-4">
                <div className="flex items-center justify-between w-full">
                    {/* Far Left: Back Button Space */}
                    <div className="flex justify-start items-center w-16 sm:w-24 shrink-0">
                        {backPath && (
                            <button
                                onClick={() => navigateTo(backPath)}
                                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm font-bold flex-shrink-0 ${isOrange
                                    ? 'bg-white/20 hover:bg-white/30 text-white'
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                                    }`}
                            >
                                <span>←</span>
                                <span className="hidden sm:inline">{backLabel}</span>
                            </button>
                        )}
                    </div>

                    {/* True Center: Group Logo, Title, and Feedback Together */}
                    <div className="flex-1 flex items-center justify-center gap-4 sm:gap-8 min-w-0">
                        {/* Anchor Left: Logo */}
                        <div className="flex justify-end items-center shrink-0">
                            <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center">
                                <img src="/icon-512.png" alt="BeekTools" className="w-full h-full object-contain scale-[1.5] origin-center" />
                            </div>
                        </div>

                        {/* Anchor Center: Title Block */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <h1 className={`text-[1.1rem] sm:text-2xl font-black leading-tight tracking-tight whitespace-nowrap overflow-hidden ${isOrange ? 'text-white' : 'text-[#8B4513]'
                                }`}>
                                {title}
                            </h1>
                            {subtitle && (
                                <p className={`text-[10px] sm:text-xs truncate opacity-90 font-medium w-full ${isOrange ? 'text-white/80' : 'text-[#8B4513]'
                                    }`}>
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Anchor Right: Feedback Button */}
                        <div className="flex justify-start items-center shrink-0">
                            <FeedbackButton inlineMode={true} />
                        </div>
                    </div>

                    {/* Far Right: Actions Space */}
                    <div className="flex justify-end items-center w-16 sm:w-24 shrink-0 gap-1.5 sm:gap-2">
                        {actions}
                    </div>
                </div>
            </div>
        </header>
    );
};
