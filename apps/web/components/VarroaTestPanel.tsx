'use client';

import { useState, useEffect } from 'react';
import { VarroaTest } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { Modal } from './Modal';

/**
 * HBHC Monthly Thresholds (Honey Bee Health Coalition)
 * Mite percentage thresholds by month.
 */
export function getHBHCThreshold(date: Date): number {
    const month = date.getMonth(); // 0-indexed
    // Jan(0), Feb(1), Mar(2) → 1%
    if (month <= 2) return 1;
    // Apr(3), May(4) → 3%
    if (month <= 4) return 3;
    // Jun(5), Jul(6), Aug(7) → 3%
    if (month <= 7) return 3;
    // Sep(8), Oct(9) → 2%
    if (month <= 9) return 2;
    // Nov(10), Dec(11) → 1%
    return 1;
}

function getStatusInfo(pct: number, threshold: number): { label: string; color: string; bg: string } {
    if (pct >= threshold * 1.5) return { label: '🔴 Critical', color: 'text-red-700', bg: 'bg-red-50' };
    if (pct >= threshold) return { label: '⚠️ Above', color: 'text-amber-700', bg: 'bg-amber-50' };
    return { label: '✅ OK', color: 'text-green-700', bg: 'bg-green-50' };
}

// ─── Varroa Test Form ────────────────────────────────────────────
export const VarroaTestForm = ({
    hiveId,
    userId,
    initialData,
    onSuccess,
    onCancel
}: {
    hiveId: string;
    userId: string;
    initialData?: VarroaTest;
    onSuccess: () => void;
    onCancel: () => void;
}) => {
    const [date, setDate] = useState(() => {
        const d = initialData ? new Date(initialData.tested_at) : new Date();
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    });
    const [beeCount, setBeeCount] = useState(initialData?.bee_count ?? 300);
    const [miteCount, setMiteCount] = useState(initialData?.mite_count ?? 0);
    const [notes, setNotes] = useState(initialData?.notes ?? '');
    const [isSaving, setIsSaving] = useState(false);

    const threshold = getHBHCThreshold(new Date(date + 'T12:00:00'));
    const mitePct = beeCount > 0 ? (miteCount / beeCount) * 100 : 0;
    const status = getStatusInfo(mitePct, threshold);

    const handleSave = async () => {
        if (!date) return alert('Please select a date');
        if (miteCount < 0) return alert('Mite count cannot be negative');
        if (beeCount <= 0) return alert('Bee count must be greater than 0');

        setIsSaving(true);
        try {
            const payload = {
                hive_id: hiveId,
                user_id: userId,
                tested_at: new Date(date + 'T12:00:00').toISOString(),
                bee_count: beeCount,
                mite_count: miteCount,
                threshold: threshold,
                notes: notes || null
            };

            if (initialData) {
                const { error } = await supabase
                    .from('varroa_tests')
                    .update(payload)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('varroa_tests')
                    .insert(payload);
                if (error) throw error;
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save mite test:', error);
            alert('Failed to save mite test');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Date */}
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Test Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {/* Bee Count + Mite Count side by side */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700"># of Bees</label>
                    <input
                        type="number"
                        min={1}
                        value={beeCount}
                        onChange={e => setBeeCount(parseInt(e.target.value) || 0)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Mites Found</label>
                    <input
                        type="number"
                        min={0}
                        value={miteCount}
                        onChange={e => setMiteCount(parseInt(e.target.value) || 0)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
            </div>

            {/* Live Result Display */}
            <div className={`rounded-lg border p-3 ${status.bg} transition-colors`}>
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mite Load</div>
                        <div className={`text-xl font-bold ${status.color}`}>
                            {mitePct.toFixed(2)}%
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">HBHC Threshold</div>
                        <div className="text-lg font-bold text-gray-700">{threshold}%</div>
                    </div>
                    <div className="text-right">
                        <span className={`text-sm font-bold ${status.color}`}>{status.label}</span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Notes (optional)</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Test method, observations..."
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700"
                >
                    {isSaving ? 'Saving...' : 'Save Mite Test'}
                </button>
            </div>
        </div>
    );
};

// ─── Varroa Test History (Last 6) ────────────────────────────────
export const VarroaTestHistory = ({
    hiveId,
    refreshKey,
    onRefresh,
    onEdit,
    isOwner
}: {
    hiveId: string;
    refreshKey?: number;
    onRefresh?: () => void;
    onEdit: (test: VarroaTest) => void;
    isOwner: boolean;
}) => {
    const [tests, setTests] = useState<VarroaTest[]>([]);
    const [requeenDates, setRequeenDates] = useState<Date[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState<VarroaTest | null>(null);
    const [viewingItem, setViewingItem] = useState<VarroaTest | null>(null);

    const fetchTests = async () => {
        setIsLoading(true);
        // Fetch last 6 mite tests (no reset_at filter — show full history)
        const { data, error } = await supabase
            .from('varroa_tests')
            .select('*')
            .eq('hive_id', hiveId)
            .order('tested_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Error fetching varroa tests:', error);
        } else {
            setTests(data || []);
        }

        // Fetch requeen interventions for this hive (for sparkline markers)
        const { data: requeenData } = await supabase
            .from('interventions')
            .select('timestamp')
            .eq('hive_id', hiveId)
            .eq('type', 'requeen')
            .order('timestamp', { ascending: true });

        if (requeenData) {
            setRequeenDates(requeenData.map(r => new Date(r.timestamp)));
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchTests();
    }, [hiveId, refreshKey]);

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const { error } = await supabase.from('varroa_tests').delete().eq('id', itemToDelete.id);
            if (error) throw error;
            setItemToDelete(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete mite test');
        }
    };

    if (isLoading && tests.length === 0) return <div className="text-center py-4 text-xs text-gray-400">Loading...</div>;
    if (tests.length === 0) return <div className="text-center py-6 text-gray-400 text-xs italic">No mite tests recorded yet.</div>;




    return (
        <>
            {/* Period-based HBHC Chart */}
            {(() => {
                // Define HBHC periods
                const HBHC_PERIODS = [
                    { label: 'Jan–Feb', months: [0, 1], threshold: 1 },
                    { label: 'Mar', months: [2], threshold: 1 },
                    { label: 'Apr–May', months: [3, 4], threshold: 3 },
                    { label: 'Jun–Aug', months: [5, 6, 7], threshold: 3 },
                    { label: 'Sep–Oct', months: [8, 9], threshold: 2 },
                    { label: 'Nov–Dec', months: [10, 11], threshold: 1 },
                ];

                // Get the last 6 periods ending at current period
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentPeriodIdx = HBHC_PERIODS.findIndex(p => p.months.includes(currentMonth));
                const orderedPeriods: typeof HBHC_PERIODS = [];
                for (let i = 5; i >= 0; i--) {
                    const idx = (currentPeriodIdx - i + 6) % 6;
                    orderedPeriods.push(HBHC_PERIODS[idx]);
                }

                // Group tests into periods
                const periodData = orderedPeriods.map(period => {
                    const periodTests = tests.filter(t => {
                        const m = new Date(t.tested_at).getMonth();
                        return period.months.includes(m);
                    });
                    if (periodTests.length === 0) return { ...period, tests: [], min: 0, max: 0, latest: 0 };
                    const pcts = periodTests.map(t => Number(t.mite_pct));
                    const sorted = [...periodTests].sort((a, b) => new Date(b.tested_at).getTime() - new Date(a.tested_at).getTime());
                    return {
                        ...period,
                        tests: periodTests,
                        min: Math.min(...pcts),
                        max: Math.max(...pcts),
                        latest: Number(sorted[0].mite_pct),
                    };
                });

                // Chart dimensions
                const chartHeight = 80;
                const chartWidth = 240;
                const barWidth = 16;
                const maxVal = Math.max(
                    ...periodData.map(p => p.max),
                    ...periodData.map(p => p.threshold),
                    4 // minimum scale
                ) * 1.2;

                const colWidth = chartWidth / 6;

                // Check for requeen events within displayed periods
                const displayedMonths = orderedPeriods.flatMap(p => p.months);
                const relevantRequeens = requeenDates.filter(d => displayedMonths.includes(d.getMonth()));

                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3 shadow-sm">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mite Load by Season</div>
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 22}`} className="w-full" style={{ height: '120px' }} preserveAspectRatio="xMidYMid meet">
                            {/* Stepped threshold line */}
                            {periodData.map((p, i) => {
                                const x1 = i * colWidth;
                                const x2 = (i + 1) * colWidth;
                                const y = chartHeight - (p.threshold / maxVal) * chartHeight;
                                return (
                                    <line
                                        key={`thresh-${i}`}
                                        x1={x1} y1={y} x2={x2} y2={y}
                                        stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,3" opacity={0.5}
                                    />
                                );
                            })}
                            {/* Threshold step connectors */}
                            {periodData.slice(0, -1).map((p, i) => {
                                const nextP = periodData[i + 1];
                                if (p.threshold === nextP.threshold) return null;
                                const x = (i + 1) * colWidth;
                                const y1 = chartHeight - (p.threshold / maxVal) * chartHeight;
                                const y2 = chartHeight - (nextP.threshold / maxVal) * chartHeight;
                                return (
                                    <line
                                        key={`step-${i}`}
                                        x1={x} y1={y1} x2={x} y2={y2}
                                        stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" opacity={0.3}
                                    />
                                );
                            })}

                            {/* Requeen markers */}
                            {relevantRequeens.map((d, ri) => {
                                const m = d.getMonth();
                                const periodIdx = orderedPeriods.findIndex(p => p.months.includes(m));
                                if (periodIdx < 0) return null;
                                const x = (periodIdx + 0.5) * colWidth;
                                return (
                                    <g key={`rq-${ri}`}>
                                        <line x1={x} y1={0} x2={x} y2={chartHeight} stroke="#9333EA" strokeWidth="1.5" strokeDasharray="3,2" opacity={0.6} />
                                        <text x={x} y={chartHeight + 20} textAnchor="middle" fontSize="8" fill="#9333EA">👑</text>
                                    </g>
                                );
                            })}

                            {/* Range bars + latest dot for each period */}
                            {periodData.map((p, i) => {
                                const cx = (i + 0.5) * colWidth;
                                if (p.tests.length === 0) return null;

                                const yMin = chartHeight - (p.min / maxVal) * chartHeight;
                                const yMax = chartHeight - (p.max / maxVal) * chartHeight;
                                const yLatest = chartHeight - (p.latest / maxVal) * chartHeight;
                                const aboveThreshold = p.latest >= p.threshold;
                                const barColor = aboveThreshold ? '#FCA5A5' : '#BBF7D0';
                                const dotColor = p.latest >= p.threshold * 1.5 ? '#EF4444' : aboveThreshold ? '#F59E0B' : '#22C55E';

                                return (
                                    <g key={`bar-${i}`}>
                                        {/* Range bar (only if more than 1 test) */}
                                        {p.tests.length > 1 && (
                                            <rect
                                                x={cx - barWidth / 2}
                                                y={yMax}
                                                width={barWidth}
                                                height={Math.max(yMin - yMax, 2)}
                                                rx={3}
                                                fill={barColor}
                                                opacity={0.6}
                                            />
                                        )}
                                        {/* Latest test dot */}
                                        <circle
                                            cx={cx} cy={yLatest} r={5}
                                            fill={dotColor}
                                            stroke="white" strokeWidth="1.5"
                                        />
                                        {/* Value label */}
                                        <text
                                            x={cx} y={yLatest - 8}
                                            textAnchor="middle" fontSize="8" fontWeight="bold"
                                            fill={dotColor}
                                        >
                                            {p.latest.toFixed(1)}%
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Period labels */}
                            {periodData.map((p, i) => {
                                const cx = (i + 0.5) * colWidth;
                                const isCurrent = i === 5; // last one is current
                                return (
                                    <text
                                        key={`label-${i}`}
                                        x={cx} y={chartHeight + 12}
                                        textAnchor="middle" fontSize="7"
                                        fill={isCurrent ? '#B45309' : '#9CA3AF'}
                                        fontWeight={isCurrent ? 'bold' : 'normal'}
                                    >
                                        {p.label}
                                    </text>
                                );
                            })}
                        </svg>
                        {/* Legend */}
                        <div className="flex justify-center gap-3 text-[10px] text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                                <span className="inline-block w-3 h-0 border-t-2 border-dashed border-red-400"></span> Threshold
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span> OK
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span> Above
                            </span>
                            {relevantRequeens.length > 0 && (
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-0 border-t-2 border-dashed border-purple-500"></span> 👑 Requeen
                                </span>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Results Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-[32px_80px_90px_55px_55px_1fr] bg-gray-50 border-b border-gray-200 py-2 items-center">
                    <div></div>
                    <div className="px-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</div>
                    <div className="px-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Mites/Bees</div>
                    <div className="px-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">%</div>
                    <div className="px-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Limit</div>
                    <div className="px-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</div>
                </div>

                {tests.map(test => {
                    const date = new Date(test.tested_at);
                    const pct = Number(test.mite_pct);
                    const thresh = Number(test.threshold);
                    const statusInfo = getStatusInfo(pct, thresh);

                    return (
                        <div
                            key={test.id}
                            className={`grid grid-cols-[32px_80px_90px_55px_55px_1fr] border-b border-gray-100 hover:bg-gray-50 transition-colors items-center py-2 cursor-pointer ${statusInfo.bg}`}
                            onClick={() => setViewingItem(test)}
                        >
                            <div className="flex justify-center">
                                {isOwner && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setItemToDelete(test); }}
                                        className="text-gray-400 p-1 text-sm hover:text-red-500"
                                    >×</button>
                                )}
                            </div>
                            <div className="px-2">
                                <div className="text-[13px] font-bold text-gray-700 whitespace-nowrap">
                                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-[10px] text-gray-400">{date.getFullYear()}</div>
                            </div>
                            <div className="text-[13px] text-gray-600 text-center">
                                {test.mite_count} / {test.bee_count}
                            </div>
                            <div className={`text-[13px] font-bold text-center ${statusInfo.color}`}>
                                {pct.toFixed(1)}%
                            </div>
                            <div className="text-[13px] text-gray-500 text-center">{thresh}%</div>
                            <div className="px-2">
                                <span className={`text-xs font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Confirm Delete">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Are you sure you want to delete this mite test?</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setItemToDelete(null)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
                        <button onClick={confirmDelete} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded">Delete</button>
                    </div>
                </div>
            </Modal>

            {/* Detail View Modal */}
            <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title="Mite Test Details">
                {viewingItem && (() => {
                    const pct = Number(viewingItem.mite_pct);
                    const thresh = Number(viewingItem.threshold);
                    const statusInfo = getStatusInfo(pct, thresh);
                    return (
                        <div className="space-y-4">
                            <div className={`rounded-lg border p-3 ${statusInfo.bg}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mite Load</div>
                                        <div className={`text-xl font-bold ${statusInfo.color}`}>{pct.toFixed(2)}%</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Threshold</div>
                                        <div className="text-lg font-bold text-gray-700">{thresh}%</div>
                                    </div>
                                    <span className={`text-sm font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-gray-500 text-xs">Date:</span> {new Date(viewingItem.tested_at).toLocaleDateString()}</div>
                                <div><span className="text-gray-500 text-xs">Bees Sampled:</span> {viewingItem.bee_count}</div>
                                <div><span className="text-gray-500 text-xs">Mites Found:</span> {viewingItem.mite_count}</div>
                            </div>
                            {viewingItem.notes && (
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <span className="text-gray-500 block mb-1 uppercase tracking-wider text-[9px] font-bold">Notes</span>
                                    <p className="text-sm text-gray-800">{viewingItem.notes}</p>
                                </div>
                            )}
                            <div className="flex justify-between pt-2">
                                <div className="flex gap-2">
                                    {isOwner && (
                                        <>
                                            <button
                                                onClick={() => { setViewingItem(null); onEdit(viewingItem); }}
                                                className="px-3 py-2 bg-amber-100 text-amber-800 rounded text-xs font-bold"
                                            >Edit</button>
                                            <button
                                                onClick={() => { setViewingItem(null); setItemToDelete(viewingItem); }}
                                                className="px-3 py-2 bg-red-100 text-red-800 rounded text-xs font-bold"
                                            >Delete</button>
                                        </>
                                    )}
                                </div>
                                <button onClick={() => setViewingItem(null)} className="px-4 py-2 bg-gray-100 rounded text-xs">Close</button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </>
    );
};
