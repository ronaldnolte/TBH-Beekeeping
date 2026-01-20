'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FeatureRequestList } from '../../components/FeatureRequestList';
import { FeatureRequestForm } from '../../components/FeatureRequestForm';
import { useRouter } from 'next/navigation';
import { navigateTo } from '../../lib/navigation';

export default function FeedbackPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigateTo('/')}
                            className="text-gray-500 hover:text-gray-800 transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit"
                        >
                            ← Back
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Feedback & Roadmap</h1>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-[#F5A623] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#D35400] transition-colors"
                        >
                            + Submit Idea
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-6">

                {showForm && (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold text-gray-800">New Feature Request</h2>
                            <button onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-800">Cancel</button>
                        </div>
                        <FeatureRequestForm onSuccess={() => {
                            setShowForm(false);
                            setRefreshKey(p => p + 1);
                        }} />
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Community Requests</h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Sorted by Votes
                        </span>
                    </div>
                    <FeatureRequestList refreshKey={refreshKey} />
                </div>
            </main>
        </div>
    );
}
