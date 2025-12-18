'use client';

import { useState } from 'react';
import { database } from '../lib/database';
import { Hive } from '@tbh-beekeeper/shared';

// Helper to generate default bars for a new hive
const generateDefaultBars = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
        const position = i + 1;
        // Default configuration for a typical 30-bar TBH
        if (position <= 2) return { position, status: 'inactive' };
        if (position === 3) return { position, status: 'active' }; // Entrance area
        // Suggest a small starter colony setup
        if (position >= 4 && position <= 8) return { position, status: 'brood' };
        if (position >= 9 && position <= 12) return { position, status: 'resource' };
        if (position >= 13 && position <= 15) return { position, status: 'empty' };
        if (position === 16) return { position, status: 'follower_board' };

        return { position, status: 'inactive' };
    });
};

export function HiveForm({
    apiaryId,
    initialData,
    onSuccess,
    onCancel
}: {
    apiaryId: string,
    initialData?: Hive,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const [name, setName] = useState(initialData?.name || '');
    const [barCount, setBarCount] = useState(initialData?.barCount || 30);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await database.write(async () => {
                const hivesCollection = database.collections.get<Hive>('hives');

                if (initialData) {
                    await initialData.update(record => {
                        record.name = name;
                        record.barCount = barCount;
                        // TODO: Handle bar resizing logic if count changes (complex)
                    });
                } else {
                    const initialBars = generateDefaultBars(barCount);
                    const newHive = await hivesCollection.create(record => {
                        record.apiaryId = apiaryId;
                        record.name = name;
                        record.barCount = barCount;
                        record.isActive = true;
                        record.rawBars = JSON.stringify(initialBars);

                        // Explicit timestamps for sorting
                        // @ts-ignore
                        record._raw.created_at = Date.now();
                        // @ts-ignore
                        record._raw.updated_at = Date.now();
                    });

                    // Create initial snapshot
                    await database.collections.get('hive_snapshots').create((record: any) => {
                        record.hiveId = newHive.id;
                        record.timestamp = Date.now();
                        record.bars = initialBars;
                        record.activeBarCount = 1;
                        record.broodBarCount = 5;
                        record.resourceBarCount = 4;
                        record.emptyBarCount = 3;
                        record.inactiveBarCount = barCount - 1 - 5 - 4 - 3;

                        // @ts-ignore
                        record._raw.created_at = Date.now();
                        // @ts-ignore
                        record._raw.updated_at = Date.now();
                    });
                }
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to save hive:', error);
            alert('Failed to save hive');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hive Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Hive Alpha"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Bars</label>
                <input
                    type="number"
                    required
                    min={10}
                    max={60}
                    value={barCount}
                    onChange={e => setBarCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Standard Top Bar Hives usually have 30-40 bars.</p>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#E67E22] text-white rounded-lg font-bold hover:bg-[#D35400] transition-colors disabled:opacity-50"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : (initialData ? 'Update Hive' : 'Create Hive')}
                </button>
            </div>
        </form>
    );
}
