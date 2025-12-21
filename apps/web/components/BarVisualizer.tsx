'use client';

import { useState, useEffect } from 'react';
import { HiveSnapshot, BarState, Hive } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';

// Bar status colors from prototype
const BAR_COLORS = {
    inactive: '#374151',      // dark gray
    active: '#06B6D4',        // cyan
    empty: '#FFFFFF',         // white
    brood: '#92400E',         // brown
    resource: '#FCD34D',      // yellow
    follower_board: '#1F2937', // very dark gray
};

type BarStatus = keyof typeof BAR_COLORS;

export function BarVisualizer({ snapshot, hive, hiveId, onSnapshotCreate, readOnly = false }: {
    snapshot?: HiveSnapshot;
    hive?: Hive;
    hiveId: string;
    onSnapshotCreate?: () => void;
    readOnly?: boolean;
}) {
    const parseBars = (source: any) => {
        try {
            if (!source) return [];
            if (typeof source === 'string') return JSON.parse(source);
            if (Array.isArray(source)) return source;
            return [];
        } catch (e) {
            console.error('Error parsing bars:', e);
            return [];
        }
    };

    const [bars, setBars] = useState<BarState[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        const rawBars = readOnly ? snapshot?.bars : hive?.bars;
        setBars(parseBars(rawBars));
    }, [snapshot, hive, readOnly]);

    if (!bars || bars.length === 0) return <div className="p-4 text-center text-gray-400">No bar configuration data</div>;

    const toggleBarStatus = async (position: number) => {
        if (readOnly) return;
        if (!hive) return;

        const index = bars.findIndex((b) => b.position === position);
        if (index === -1) return;

        const currentBar = bars[index];
        const statuses: BarStatus[] = ['inactive', 'active', 'empty', 'brood', 'resource', 'follower_board'];
        const currentStatus = currentBar.status as BarStatus;
        const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

        const newBars = [...bars];
        newBars[index] = { ...currentBar, status: nextStatus };

        setBars(newBars);

        try {
            await supabase
                .from('hives')
                .update({ bars: newBars }) // Supabase handles JSONB automatically with mapped types usually, ensure Hive type matches
                .eq('id', hive.id);
        } catch (e) {
            console.error("Failed to update hive record", e);
        }
    };

    const handleCapture = async () => {
        if (isCapturing) return;
        setIsCapturing(true);

        const inactiveCount = bars.filter(b => b.status === 'inactive').length;
        const activeCount = bars.filter(b => b.status === 'active').length;
        const emptyCount = bars.filter(b => b.status === 'empty').length;
        const broodCount = bars.filter(b => b.status === 'brood').length;
        const resourceCount = bars.filter(b => b.status === 'resource').length;
        const followerBoardPosition = bars.find(b => b.status === 'follower_board')?.position;

        try {
            const { error } = await supabase.from('hive_snapshots').insert({
                hive_id: hiveId,
                timestamp: new Date().toISOString(),
                bars: bars,
                inactive_bar_count: inactiveCount,
                active_bar_count: activeCount,
                empty_bar_count: emptyCount,
                brood_bar_count: broodCount,
                resource_bar_count: resourceCount,
                follower_board_position: followerBoardPosition || null,
            });

            if (error) throw error;
            console.log("Captured new snapshot!");

            if (onSnapshotCreate) {
                onSnapshotCreate();
            }
        } catch (e) {
            console.error("Capture failed", e);
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-bold text-[#4A3C28] uppercase tracking-wide">Top Bar Config {readOnly ? '(History View)' : ''}</h2>
                {!readOnly && (
                    <button
                        onClick={handleCapture}
                        disabled={isCapturing}
                        className={`text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 active:scale-95 transition-transform ${isCapturing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F5A623] hover:bg-[#E09612]'}`}
                    >
                        {isCapturing ? 'Saving...' : '📸 Capture'}
                    </button>
                )}
            </div>

            <div className="overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
                <div className="flex gap-0 min-w-max">
                    {bars.map((bar) => (
                        <div key={bar.position} className="flex flex-col items-center">
                            <button
                                onClick={() => toggleBarStatus(bar.position)}
                                disabled={readOnly}
                                className={`w-8 h-24 sm:w-10 sm:h-30 border border-black transition-all relative group -ml-[1px] ${!readOnly ? 'hover:border-2 hover:border-[#E67E22]' : 'cursor-default'}`}
                                style={{
                                    backgroundColor: BAR_COLORS[bar.status as BarStatus] || BAR_COLORS.inactive,
                                    zIndex: 1
                                }}
                                title={`Bar ${bar.position}: ${bar.status}`}
                            >
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold opacity-70 group-hover:opacity-100"
                                    style={{
                                        color: bar.status === 'empty' || bar.status === 'resource' ? '#000' : '#FFF'
                                    }}
                                >
                                    {bar.position}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                {Object.entries(BAR_COLORS).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-1.5">
                        <div
                            className="w-3 h-3 rounded-sm border border-gray-300"
                            style={{ backgroundColor: color }}
                        />
                        <span className="capitalize text-gray-600 truncate">{status.replace('_', ' ')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
