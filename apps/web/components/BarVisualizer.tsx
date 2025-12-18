'use client';

import { useState, useEffect } from 'react';
import { HiveSnapshot, BarState, Hive } from '@tbh-beekeeper/shared';
import { database } from '../lib/database';

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
    snapshot?: HiveSnapshot; // Optional now, used for history viewing
    hive?: Hive; // The live hive record
    hiveId: string;
    onSnapshotCreate?: () => void;
    readOnly?: boolean;
}) {
    // If viewing history (readOnly), show snapshot bars.
    // If editing live (hive present), show hive bars.
    // Fallback to empty array.
    const initialBars = readOnly
        ? (snapshot ? (typeof snapshot.bars === 'string' ? JSON.parse(snapshot.bars) : snapshot.bars) : [])
        : (hive?.bars || []);

    const [bars, setBars] = useState<BarState[]>(initialBars);
    const [isCapturing, setIsCapturing] = useState(false);

    // Sync state when props change (switching between history and live view)
    useEffect(() => {
        const targetBars = readOnly
            ? (snapshot ? (typeof snapshot.bars === 'string' ? JSON.parse(snapshot.bars) : snapshot.bars) : [])
            : (hive?.bars || []);
        setBars(targetBars || []);
    }, [snapshot, hive, readOnly]);

    if (!bars || bars.length === 0) return <div className="p-4 text-center text-gray-400">No bar configuration data</div>;

    const toggleBarStatus = async (position: number) => {
        if (readOnly) return; // Prevent editing historical snapshots directly here
        if (!hive) return; // Cannot edit without a live hive record

        // Find index of bar to change
        const index = bars.findIndex((b) => b.position === position);
        if (index === -1) return;

        const currentBar = bars[index];
        const statuses: BarStatus[] = ['inactive', 'active', 'empty', 'brood', 'resource', 'follower_board'];
        const currentStatus = currentBar.status as BarStatus;
        const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

        const newBars = [...bars];
        newBars[index] = { ...currentBar, status: nextStatus };

        // UPDATE UI IMMEDIATELY
        setBars(newBars);

        // UPDATE HIVE RECORD IMMEDIATELY (Live Persistence)
        try {
            await database.write(async () => {
                await hive.update(record => {
                    record.rawBars = JSON.stringify(newBars);
                });
            });
        } catch (e) {
            console.error("Failed to update hive record", e);
        }
    };

    const handleCapture = async () => {
        if (isCapturing) return; // Prevent double clicks
        setIsCapturing(true);

        // Calculate counts for denormalization based on CURRENT bars
        const inactiveCount = bars.filter(b => b.status === 'inactive').length;
        const activeCount = bars.filter(b => b.status === 'active').length;
        const emptyCount = bars.filter(b => b.status === 'empty').length;
        const broodCount = bars.filter(b => b.status === 'brood').length;
        const resourceCount = bars.filter(b => b.status === 'resource').length;
        const followerBoardPosition = bars.find(b => b.status === 'follower_board')?.position;

        try {
            await database.write(async () => {
                // EXPLICIT CAPTURE: Create a snapshot from the current bars state
                await database.get('hive_snapshots').create((record: any) => {
                    record.hiveId = hiveId;
                    record.timestamp = new Date();
                    record.bars = bars;

                    // Set counts
                    record.inactiveBarCount = inactiveCount;
                    record.activeBarCount = activeCount;
                    record.emptyBarCount = emptyCount;
                    record.broodBarCount = broodCount;
                    record.resourceBarCount = resourceCount;
                    if (followerBoardPosition) {
                        record.followerBoardPosition = followerBoardPosition;
                    }
                });
            });
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

            {/* Horizontal Scrollable Bar Container */}
            <div className="overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
                <div className="flex gap-0 min-w-max">
                    {bars.map((bar) => (
                        <div key={bar.position} className="flex flex-col items-center">
                            <button
                                onClick={() => toggleBarStatus(bar.position)}
                                disabled={readOnly}
                                className={`w-8 h-24 border border-black transition-all relative group -ml-[1px] ${!readOnly ? 'hover:border-2 hover:border-[#E67E22]' : 'cursor-default'}`}
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

            {/* Legend */}
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
