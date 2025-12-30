'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hive } from '@tbh-beekeeper/shared';

// Helper to generate default bars for a new hive
const generateDefaultBars = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
        const position = i + 1;
        // Updated configuration per user request
        if (position <= 2) return { position, status: 'empty' };
        if (position >= 3 && position <= 5) return { position, status: 'brood' };
        if (position >= 6 && position <= 7) return { position, status: 'resource' };
        if (position >= 8 && position <= 9) return { position, status: 'empty' };
        if (position === 10) return { position, status: 'follower_board' };

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
    const [barCount, setBarCount] = useState(initialData?.bar_count || 30);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (initialData) {
                const { error } = await supabase.from('hives').update({
                    name,
                    bar_count: barCount
                    // TODO: Handle bar resizing logic if count changes (complex)
                }).eq('id', initialData.id);
                if (error) throw error;
            } else {
                const initialBars = generateDefaultBars(barCount);

                // 1. Create Hive
                const { data: newHive, error: hiveError } = await supabase.from('hives').insert({
                    apiary_id: apiaryId,
                    name,
                    bar_count: barCount,
                    is_active: true,
                    bars: initialBars
                }).select().single();

                if (hiveError) throw hiveError;

                // 2. Create Initial Snapshot
                const { error: snapshotError } = await supabase.from('hive_snapshots').insert({
                    hive_id: newHive.id,
                    timestamp: new Date().toISOString(),
                    bars: initialBars,
                    active_bar_count: 0,
                    brood_bar_count: 3,
                    resource_bar_count: 2,
                    empty_bar_count: 4,
                    inactive_bar_count: barCount - 10
                });

                if (snapshotError) throw snapshotError;
            }
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
