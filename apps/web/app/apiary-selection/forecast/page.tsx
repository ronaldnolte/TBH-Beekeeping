'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { database } from '../../../lib/database';
import { Apiary } from '@tbh-beekeeper/shared';
import { ForecastGrid } from '../../../components/ForecastGrid';

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
                const apiaryRecord = await database.get<Apiary>('apiaries').find(apiaryId);
                setApiary(apiaryRecord);
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
            <div className="flex items-center justify-center min-h-screen bg-[#FFFBF0]">
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
        <div className="min-h-screen bg-[#FFFBF0]">
            {/* Minimal Header */}
            <div className="bg-[#F5A623] text-white p-3 shadow-md">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="text-white hover:text-gray-200 flex items-center gap-1 text-sm"
                    >
                        <span>←</span> Back
                    </button>
                    <h1 className="text-lg font-bold">Hive Forecast</h1>
                    <div className="w-12"></div> {/* Spacer for centering */}
                </div>
                <div className="text-center text-xs mt-1 opacity-90">{apiary.name}</div>
            </div>

            {/* Forecast Grid */}
            <ForecastGrid
                apiaryId={apiary.id}
                zipCode={apiary.zipCode}
                latitude={apiary.latitude}
                longitude={apiary.longitude}
            />
        </div>
    );
}

export default function ForecastPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#FFFBF0]">
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
