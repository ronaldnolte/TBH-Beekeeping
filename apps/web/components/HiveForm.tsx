'use client';

import { useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Hive } from '@tbh-beekeeper/shared';
import { HIVE_TYPES, HiveCategory, HiveType, HiveBox } from '@tbh-beekeeper/shared';
import { LangstrothBuilder } from './LangstrothBuilder';

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
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [selectedType, setSelectedType] = useState<HiveType>(initialData?.type || 'top_bar');

    // Default configuration for new Langstroth hives
    const DEFAULT_LANGSTROTH_BOXES: HiveBox[] = [
        { id: 'def-1', type: 'deep', frames: 10 },
        { id: 'def-2', type: 'deep', frames: 10 },
    ];

    // Initialize boxes from initialData or defaults if it's a Langstroth hive
    const [langstrothBoxes, setLangstrothBoxes] = useState<HiveBox[]>(() => {
        // If editing an existing hive
        if (initialData?.type?.includes('langstroth')) {
            let existingBars: any[] = [];

            // Handle parsing if it's a string (common with Supabase JSON/Text columns)
            if (typeof initialData.bars === 'string') {
                try {
                    existingBars = JSON.parse(initialData.bars);
                } catch (e) {
                    console.error('Failed to parse initial hive bars', e);
                    existingBars = [];
                }
            } else if (Array.isArray(initialData.bars)) {
                existingBars = initialData.bars;
            }

            if (existingBars.length > 0) {
                const firstItem = existingBars[0];
                if (firstItem && 'type' in firstItem) {
                    return existingBars as unknown as HiveBox[];
                }
            }
            // Fallback for existing Langstroth with no boxes
            return DEFAULT_LANGSTROTH_BOXES;
        }

        // If creating a NEW hive and default type is Langstroth (or just default for safety)
        if (selectedType.includes('langstroth')) {
            return DEFAULT_LANGSTROTH_BOXES;
        }

        // Default empty (will be populated if they switch TO Langstroth)
        return DEFAULT_LANGSTROTH_BOXES;
    });
    const [isSaving, setIsSaving] = useState(false);

    // Derived state for category based on selected type
    const selectedCategory = useMemo(() => {
        return HIVE_TYPES.find(t => t.id === selectedType)?.category || 'Horizontal';
    }, [selectedType]);

    // Derived state: is this a Langstroth-like hive that needs the builder?
    const isLangstroth = selectedType.includes('langstroth');

    // Handler to sync the correct Langstroth Type (8 vs 10) when the builder changes
    const handleLangstrothChange = (newBoxes: HiveBox[]) => {
        setLangstrothBoxes(newBoxes);

        // If we have boxes, check the frame count of the first one to determine the type
        if (newBoxes.length > 0 && newBoxes[0].frames) {
            const frames = newBoxes[0].frames;
            const currentTypeIsLangstroth = selectedType.startsWith('langstroth');

            // Only auto-switch if we are already in a Langstroth mode
            if (currentTypeIsLangstroth) {
                if (frames === 8 && selectedType !== 'langstroth_8') {
                    setSelectedType('langstroth_8');
                } else if (frames === 10 && selectedType !== 'langstroth_10') {
                    setSelectedType('langstroth_10');
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (initialData) {
                // 1. Prepare new data
                const newBarCount = barCount;
                const newBars = isLangstroth ? langstrothBoxes : initialData.bars; // Keep existing bars if TBH, update if Langstroth

                // 2. Update Hive
                const { error } = await supabase.from('hives').update({
                    name,
                    bar_count: newBarCount,
                    notes: notes,
                    bars: isLangstroth ? (newBars as any) : undefined // Only update bars column here if Langstroth structure changed
                }).eq('id', initialData.id);

                if (error) throw error;

                // 3. Check for structural changes to trigger Snapshot
                const structureChanged = isLangstroth
                    ? JSON.stringify(initialData.bars) !== JSON.stringify(newBars)
                    : initialData.bar_count !== newBarCount;

                if (structureChanged) {
                    const { error: snapshotError } = await supabase.from('hive_snapshots').insert({
                        hive_id: initialData.id,
                        timestamp: new Date().toISOString(),
                        bars: isLangstroth ? (newBars as any) : (initialData.bars || []), // Save new box config OR existing bar state
                        active_bar_count: 0,
                        brood_bar_count: 0,
                        resource_bar_count: 0,
                        empty_bar_count: 0,
                        inactive_bar_count: 0
                    });
                    if (snapshotError) console.error('Failed to create auto-snapshot:', snapshotError);
                }

            } else {
                const initialBars = isLangstroth
                    ? langstrothBoxes as any // Store boxes in the bars column for now
                    : generateDefaultBars(barCount);

                const finalBarCount = isLangstroth ? 0 : barCount; // Langstroth doesn't use bar_count same way

                // 1. Create Hive
                const { data: newHive, error: hiveError } = await supabase.from('hives').insert({
                    apiary_id: apiaryId,
                    name,
                    type: selectedType,
                    bar_count: finalBarCount,
                    notes: notes,
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Hive Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hive Category</label>
                    <div className={`flex bg-gray-100 p-1 rounded-lg ${initialData ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {(['Horizontal', 'Vertical'] as HiveCategory[]).map(cat => (
                            <button
                                key={cat}
                                type="button"
                                disabled={!!initialData}
                                onClick={() => {
                                    // Default to first type in this category
                                    const firstType = HIVE_TYPES.find(t => t.category === cat);
                                    if (firstType) setSelectedType(firstType.id);
                                }}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${selectedCategory === cat
                                    ? 'bg-white text-[#E67E22] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    } ${initialData ? 'cursor-not-allowed' : ''}`}
                            >
                                {cat} Expansion
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hive Model</label>
                        {initialData && <span className="text-[10px] text-gray-400 italic pt-1">Type locked on edit</span>}
                    </div>
                    <select
                        value={selectedType}
                        disabled={!!initialData}
                        onChange={(e) => setSelectedType(e.target.value as HiveType)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none bg-white ${initialData ? 'opacity-70 bg-gray-50 cursor-not-allowed' : ''}`}
                    >
                        {HIVE_TYPES
                            .filter(t => t.category === selectedCategory)
                            .map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.model}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Dynamic Configuration based on Type */}
            {
                isLangstroth ? (
                    <div className="border border-gray-200 rounded-xl p-2 md:p-4 bg-slate-50">
                        <label className="block text-sm font-bold text-gray-700 mb-2 md:mb-3">Configure Boxes</label>
                        <LangstrothBuilder
                            onChange={handleLangstrothChange}
                            initialBoxes={langstrothBoxes}
                        />
                    </div>
                ) : (
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
                        <p className="text-xs text-gray-500 mt-1">
                            {HIVE_TYPES.find(t => t.id === selectedType)?.capacity || 'Standard Top Bar Hives usually have 30-40 bars.'}
                        </p>
                    </div>
                )
            }

            <div className="flex gap-3 pt-4 sticky bottom-[-16px] bg-white border-t border-gray-100 pb-2 -mx-4 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 md:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-3 md:py-2 bg-[#E67E22] text-white rounded-lg font-bold hover:bg-[#D35400] transition-colors disabled:opacity-50 shadow-md"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : (initialData ? 'Update Hive' : 'Create Hive')}
                </button>
            </div>
        </form >
    );
}
