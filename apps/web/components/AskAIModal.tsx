'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { askBeekeepingAI } from '../app/actions/ai';

interface AskAIModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiaryId: string;
    userId: string;
}

export const AskAIModal = ({ isOpen, onClose, apiaryId, userId }: AskAIModalProps) => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setQuestion('');
            setResponse('');
            setError(null);
            setIsLoading(false);
            // Focus input after a short delay for animation
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleAsk = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setError(null);
        setResponse('');

        try {
            const result = await askBeekeepingAI(userId, question, apiaryId);

            if (result.error) {
                setError(result.error);
            } else if (result.answer) {
                setResponse(result.answer);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🤖 Ask BeekTools AI" maxWidth="max-w-2xl">
            <div className="flex flex-col gap-4 min-h-[300px] max-h-[70vh]">

                {/* Result Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 border rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {response ? (
                        <div className="animate-in fade-in duration-500">
                            <div className="font-bold text-[#8B4513] mb-2">Ans:</div>
                            <div className="text-gray-800">{response}</div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                            <div className="animate-spin text-2xl">🐝</div>
                            <p className="text-xs">Consulting the hive mind...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center h-full flex items-center justify-center">
                            <div className="text-red-500 font-medium px-4 py-2 bg-red-50 rounded border border-red-100">
                                {error}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center opacity-60">
                            <span className="text-4xl mb-2">🍯</span>
                            <p>Ask a question about your apiary.</p>
                            <p className="text-xs mt-1">Context like location and season will be added automatically.</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t pt-4">
                    <textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="E.g. Is it too cold to inspect today?"
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none resize-none"
                        rows={3}
                        disabled={isLoading}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-400">
                            AI can make mistakes. Check important info.
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 font-medium text-xs hover:bg-gray-100 rounded"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleAsk}
                                disabled={!question.trim() || isLoading}
                                className="px-5 py-2 bg-[#E67E22] text-white font-bold text-xs rounded hover:bg-[#D35400] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Thinking...' : 'Ask Question'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    );
};
