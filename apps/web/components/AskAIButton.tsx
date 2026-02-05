'use client';

import React, { useState } from 'react';
import { AskAIModal } from './AskAIModal';

interface AskAIButtonProps {
    apiaryId: string;
    userId: string;
}

export const AskAIButton = ({ apiaryId, userId }: AskAIButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-2 border border-indigo-500"
            >
                <span>🤖</span>
                <span>Ask AI</span>
            </button>

            <AskAIModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                apiaryId={apiaryId}
                userId={userId}
            />
        </>
    );
};
