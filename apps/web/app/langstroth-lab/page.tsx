'use client';

import { LangstrothBuilder } from '../../components/LangstrothBuilder';
import { useRouter } from 'next/navigation';

export default function LangstrothLabPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex flex-col">
            {/* Simple Header */}
            <header className="bg-white px-8 py-4 flex justify-between items-center border-b border-[#E6DCC3] shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/apiary-selection')} className="text-[#8B4513] hover:underline">← Back to App</button>
                    <h1 className="text-xl font-serif font-bold text-[#4A3C28]">Langstroth Lab (Prototype)</h1>
                </div>
            </header>

            <div className="flex-1 p-8">
                <div className="text-center mb-8">
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        This is a prototype builder for Vertical (Langstroth) hives.
                        It operates in a sandbox and does not save data to the database yet.
                    </p>
                </div>

                <LangstrothBuilder />
            </div>
        </div>
    );
}
