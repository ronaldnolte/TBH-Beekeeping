'use client';

import { useEffect, useState, ReactNode, useRef } from "react";
import { DatabaseProvider as WatermelonDBProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from '../lib/database';
import { seedDatabase } from '../lib/seed';

export default function DatabaseProvider({ children }: { children: ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialized = useRef(false);

    useEffect(() => {
        const init = async () => {
            if (initialized.current) return;
            initialized.current = true;

            try {
                await seedDatabase();
                setIsLoaded(true);
            } catch (e: any) {
                console.error('Failed to seed database:', e);
                setError(e.message);
            }
        };

        if (database) {
            init();
        }
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Database Error</h2>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center honeycomb-bg">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl flex flex-col items-center">
                    <div className="animate-spin text-4xl mb-4">🐝</div>
                    <div className="text-xl font-bold text-[#8B4513]">Loading Hive Data...</div>
                </div>
            </div>
        );
    }

    return (
        <WatermelonDBProvider database={database}>
            {children}
        </WatermelonDBProvider>
    );
}
