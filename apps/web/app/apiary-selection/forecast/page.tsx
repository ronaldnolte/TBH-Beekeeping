'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { navigateTo } from '../../../lib/navigation';
import { Apiary } from '@tbh-beekeeper/shared';
import { ForecastGrid } from '../../../components/ForecastGrid';
import { AppHeader } from '../../../components/AppHeader';

function ForecastPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const apiaryId = searchParams.get('apiaryId');

    const [apiary, setApiary] = useState<Apiary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!apiaryId) {
            router.push('/apiary-selection');
            return;
        }

        const fetchApiary = async () => {
            try {
                // @ts-ignore - Supabase type mismatch with shared types temporarily
                const { data, error } = await supabase.from('apiaries').select('*').eq('id', apiaryId).single();

                if (error) throw error;
                setApiary(data as unknown as Apiary);
            } catch (error) {
                console.error('Failed to load apiary:', error);
                router.push('/apiary-selection');
            } finally {
                setLoading(false);
            }
        };

        fetchApiary();
    }, [apiaryId, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen honeycomb-bg">
                <div className="text-center">
                    <div className="animate-pulse text-4xl mb-4">🐝</div>
                    <div className="text-[#8B4513] font-bold">Loading...</div>
                </div>
            </div>
        );
    }

    if (!apiary) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen honeycomb-bg">
            {/* Standardized App Header */}
            <AppHeader
                title="Hive Forecast"
                subtitle={apiary.name}
            />

            {/* Centered Navigation Toolbar */}
            <div className="w-full flex justify-center py-4 bg-white border-b border-[#E6DCC3] shadow-sm mb-4">
                <button
                    onClick={() => navigateTo(`/apiary/${apiary.id}`)}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                    <span>←</span> Return to {apiary.name}
                </button>
            </div>

            {/* Forecast Grid */}
            <ForecastGrid
                apiaryId={apiary.id}
                // @ts-ignore - Snake case compat
                zipCode={apiary.zip_code}
            />
        </div>
    );
}

export default function ForecastPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen honeycomb-bg">
                <div className="text-center">
                    <div className="animate-pulse text-4xl mb-4">🐝</div>
                    <div className="text-[#8B4513] font-bold">Loading...</div>
                </div>
            </div>
        }>
            <ForecastPageContent />
        </Suspense>
    );
}
