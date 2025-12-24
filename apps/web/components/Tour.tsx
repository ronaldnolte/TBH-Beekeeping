'use client';

import { useState, useEffect, useRef } from 'react';

export interface TourStep {
    target: string; // CSS selector or element ID
    title: string;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    action?: () => void; // Optional action to perform
}

interface TourProps {
    tourId: string; // Unique ID for this tour
    steps: TourStep[];
    onComplete?: () => void;
    autoStart?: boolean;
}

export function Tour({ tourId, steps, onComplete, autoStart = false }: TourProps) {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        // Check if user has completed this tour
        const completed = localStorage.getItem(`tour_completed_${tourId}`);
        if (!completed && autoStart) {
            setTimeout(() => setIsActive(true), 500); // Small delay for page load
        }
    }, [tourId, autoStart]);

    useEffect(() => {
        if (!isActive || !steps[currentStep]) return;

        const updateTargetPosition = () => {
            const target = document.querySelector(steps[currentStep].target);
            if (target) {
                setTargetRect(target.getBoundingClientRect());

                // Scroll element into view
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        updateTargetPosition();
        window.addEventListener('resize', updateTargetPosition);
        window.addEventListener('scroll', updateTargetPosition);

        return () => {
            window.removeEventListener('resize', updateTargetPosition);
            window.removeEventListener('scroll', updateTargetPosition);
        };
    }, [isActive, currentStep, steps]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            steps[currentStep].action?.();
        } else {
            completeTour();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        setIsActive(false);
        setCurrentStep(0);
    };

    const completeTour = () => {
        localStorage.setItem(`tour_completed_${tourId}`, 'true');
        setIsActive(false);
        setCurrentStep(0);
        onComplete?.();
    };

    const restartTour = () => {
        setCurrentStep(0);
        setIsActive(true);
    };

    if (!isActive || !targetRect) {
        return (
            <button
                onClick={restartTour}
                className="fixed bottom-4 right-4 w-12 h-12 bg-[#E67E22] text-white rounded-full shadow-lg hover:bg-[#D35400] transition-all z-50 flex items-center justify-center text-xl font-bold hover:scale-110"
                title="Show help tour"
            >
                ?
            </button>
        );
    }

    const step = steps[currentStep];
    const placement = step.placement || 'bottom';

    // Calculate tooltip position with viewport boundary checking
    const tooltipWidth = 400;
    const tooltipHeight = 250; // Approximate height
    const margin = 20;

    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    let top = targetRect.bottom + margin;

    // Adjust based on placement preference
    switch (placement) {
        case 'top':
            top = targetRect.top - tooltipHeight - margin;
            break;
        case 'bottom':
            top = targetRect.bottom + margin;
            break;
        case 'left':
            left = targetRect.left - tooltipWidth - margin;
            top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
            break;
        case 'right':
            left = targetRect.right + margin;
            top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
            break;
    }

    // Keep within viewport bounds
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin));

    const tooltipStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 10001,
        left: `${left}px`,
        top: `${top}px`,
        width: `${Math.min(tooltipWidth, window.innerWidth - margin * 2)}px`,
        maxWidth: '90vw',
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-10000 transition-opacity"
                style={{ zIndex: 9999 }}
            />

            {/* Highlight spotlight */}
            <div
                className="fixed border-4 border-[#E67E22] rounded-lg pointer-events-none animate-pulse"
                style={{
                    zIndex: 10000,
                    left: targetRect.left - 8,
                    top: targetRect.top - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                }}
            />

            {/* Tooltip */}
            <div
                style={tooltipStyle}
                className="bg-white rounded-xl shadow-2xl border-2 border-[#E67E22] flex flex-col"
            >
                {/* Fixed Header - Progress indicator */}
                <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b border-gray-100">
                    <div className="text-xs font-bold text-[#8B4513] uppercase">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                        Skip Tour
                    </button>
                </div>

                {/* Progress bar */}
                <div className="px-6 pt-2 pb-3 border-b border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-[#E67E22] h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
                    <h3 className="text-lg font-bold text-[#4A3C28] mb-2">{step.title}</h3>
                    <p className="text-gray-700 text-sm">{step.content}</p>
                </div>

                {/* Fixed Footer - Navigation buttons */}
                <div className="flex justify-between gap-2 px-6 pb-6 pt-3 border-t border-gray-100">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        ← Previous
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-4 py-2 rounded-lg font-semibold text-sm bg-[#E67E22] text-white hover:bg-[#D35400] transition-colors"
                    >
                        {currentStep === steps.length - 1 ? 'Got it! →' : 'Next →'}
                    </button>
                </div>
            </div>
        </>
    );
}

// Helper component for manual tour trigger
export function TourButton({ tourId, label = "Show Tutorial" }: { tourId: string; label?: string }) {
    const handleClick = () => {
        localStorage.removeItem(`tour_completed_${tourId}`);
        window.location.reload(); // Reload to trigger tour
    };

    return (
        <button
            onClick={handleClick}
            className="text-[#E67E22] hover:text-[#D35400] text-sm hover:underline font-medium inline-flex items-center gap-1"
        >
            <span>?</span>
            <span>{label}</span>
        </button>
    );
}
