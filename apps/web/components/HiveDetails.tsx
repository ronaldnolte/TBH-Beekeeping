'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarVisualizer } from './BarVisualizer';
import { LangstrothBuilder } from './LangstrothBuilder';
import { InterventionList } from './InterventionList';
import { InterventionForm } from './InterventionForm';
import { InspectionList } from './InspectionList';
import { InspectionForm } from './InspectionForm';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { HiveForm } from './HiveForm';
import { Modal } from './Modal';
import { Hive, HiveSnapshot, BarState, Inspection, Intervention, Apiary, Task, HiveBox } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { navigateTo } from '../lib/navigation';
import { Tour } from './Tour';
import { hiveDetailTour } from '../lib/tourDefinitions';
import { useCurrentUser } from '../hooks/useCurrentUser';

// Bar status colors from prototype
const BAR_COLORS = {
    inactive: '#374151',
    active: '#06B6D4',
    empty: '#FFFFFF',
    brood: '#92400E',
    resource: '#FCD34D',
    follower_board: '#1F2937',
};

type BarStatus = keyof typeof BAR_COLORS;

const HistoryItem = ({ snapshot, onSelect, onDelete }: { snapshot: HiveSnapshot, onSelect: () => void, onDelete: () => void }) => {
    // Safely parse bars if it's a string (JSON) or array
    let bars: BarState[] = [];
    try {
        if (typeof snapshot.bars === 'string') {
            bars = JSON.parse(snapshot.bars);
        } else if (Array.isArray(snapshot.bars)) {
            bars = snapshot.bars;
        }
    } catch (e) {
        console.error('Failed to parse snapshot bars', e);
    }

    // Safely parse date
    let dateStr = 'Invalid Date';
    let timeStr = '';
    try {
        const d = new Date(snapshot.timestamp);
        if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString();
            timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    } catch (e) {
        console.error('Failed to parse snapshot date', e);
    }

    return (
        <div className="w-full flex flex-col px-2 py-1 hover:bg-gray-50 border-b border-gray-100 transition-colors group bg-white h-full relative">
            <div className="flex items-center gap-2">
                <div className="flex gap-1 justify-center items-center">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-gray-400 p-2 text-lg">×</button>
                </div>
                <div className="flex items-baseline gap-2 cursor-pointer flex-1" onClick={onSelect}>
                    <span className="text-[11px] sm:text-sm font-bold text-gray-800">
                        {dateStr}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                        {timeStr}
                    </span>
                </div>
            </div>

            {/* Content: Detect if bars (TBH) or Boxes (Langstroth) handled manually here as type guard is loose */}
            {(bars.length > 0 && 'type' in bars[0]) ? (
                // Langstroth Summary View
                <div className="flex items-center gap-2 ml-10 mt-1" onClick={onSelect}>
                    <div className="flex flex-col gap-0.5">
                        {/* Tiny Visual Stack */}
                        {bars.slice(0, 5).map((box: any, i) => (
                            <div
                                key={i}
                                className={`w-6 border border-black/20 rounded-[1px] ${box.type === 'deep' ? 'h-3 bg-[#E67E22]' :
                                    box.type === 'medium' ? 'h-2 bg-[#F5A623]' : 'h-1.5 bg-[#FCD34D]'
                                    }`}
                                title={box.type}
                            />
                        ))}
                    </div>
                    <div className="text-[10px] text-gray-500 leading-tight">
                        {/* Text Summary */}
                        {bars.filter((b: any) => b.type === 'shallow').length > 0 && <div>{bars.filter((b: any) => b.type === 'shallow').length} Shal</div>}
                        {bars.filter((b: any) => b.type === 'medium').length > 0 && <div>{bars.filter((b: any) => b.type === 'medium').length} Med</div>}
                        {bars.filter((b: any) => b.type === 'deep').length > 0 && <div>{bars.filter((b: any) => b.type === 'deep').length} Deep</div>}
                    </div>
                </div>
            ) : (
                // Standard Top Bar Visualization
                <div className="flex gap-[1px] h-4 sm:h-10 items-end overflow-hidden mt-0.5 ml-10 cursor-pointer" onClick={onSelect}>
                    {bars.slice(0, 30).map((bar) => (
                        <div
                            key={bar.position}
                            className="w-1.5 sm:w-4 h-full rounded-[0.5px] border-[0.5px] border-black/50"
                            style={{
                                backgroundColor: BAR_COLORS[bar.status as BarStatus] || BAR_COLORS.inactive,
                                height: '100%'
                            }}
                            title={`Bar ${bar.position}: ${bar.status}`}
                        />
                    ))}
                    {bars.length > 30 && <div className="text-[6px] text-gray-300 self-center">...</div>}
                </div>
            )}
        </div>
    );
};

export const HiveDetails = ({ hiveId }: { hiveId: string }) => {
    const router = useRouter();
    const { userId } = useCurrentUser();
    const [hive, setHive] = useState<Hive | null>(null);
    const [apiary, setApiary] = useState<Apiary | null>(null);
    const [snapshots, setSnapshots] = useState<HiveSnapshot[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
    const [showAllHistory, setShowAllHistory] = useState(false);
    const [activeTab, setActiveTab] = useState<'Inspections' | 'Interventions' | 'Tasks'>('Inspections');

    const [isAddingIntervention, setIsAddingIntervention] = useState(false);
    const [editingIntervention, setEditingIntervention] = useState<Intervention | undefined>(undefined);
    const [interventionRefreshKey, setInterventionRefreshKey] = useState(0);

    const [isAddingInspection, setIsAddingInspection] = useState(false);
    const [editingInspection, setEditingInspection] = useState<Inspection | undefined>(undefined);
    const [inspectionRefreshKey, setInspectionRefreshKey] = useState(0);

    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [taskRefreshKey, setTaskRefreshKey] = useState(0);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);

    const [isEditingSettings, setIsEditingSettings] = useState(false);

    // Ownership Check: Returns true if allowed, false if blocked
    const checkOwnership = (): boolean => {
        if (apiary && userId && apiary.user_id !== userId) {
            alert('Only the apiary owner can make changes.');
            return false;
        }
        return true;
    };

    const fetchData = async () => {
        setLoading(true);
        const { data: hiveData } = await supabase.from('hives').select('*').eq('id', hiveId).single();
        if (hiveData) {
            setHive(hiveData);

            // Fetch the apiary to determine ownership
            const { data: apiaryData } = await supabase.from('apiaries').select('*').eq('id', hiveData.apiary_id).single();
            if (apiaryData) setApiary(apiaryData);

            const { data: snapshotData } = await supabase
                .from('hive_snapshots')
                .select('*')
                .eq('hive_id', hiveId)
                .order('timestamp', { ascending: false });
            setSnapshots(snapshotData || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [hiveId]);

    const [snapshotToDelete, setSnapshotToDelete] = useState<HiveSnapshot | null>(null);

    const confirmSnapshotDelete = async () => {
        if (!snapshotToDelete) return;
        if (!checkOwnership()) return;
        const { error } = await supabase.from('hive_snapshots').delete().eq('id', snapshotToDelete.id);
        if (error) {
            console.error('Failed to delete snapshot:', error);
            alert('Failed to delete snapshot: ' + error.message);
        } else {
            setSnapshotToDelete(null);
            fetchData();
        }
    };

    const handleOpenSettings = async () => {
        if (!checkOwnership()) return;
        setIsEditingSettings(true);
    };

    if (loading && !hive) return <div className="min-h-screen flex items-center justify-center">Loading Hive Data...</div>;
    if (!hive) return <div className="min-h-screen flex items-center justify-center">Hive not found</div>;

    const latestSnapshot = snapshots[0];
    const displayedSnapshot = selectedSnapshotId
        ? snapshots.find(s => s.id === selectedSnapshotId) || latestSnapshot
        : latestSnapshot;

    return (
        <div className="min-h-screen honeycomb-bg overflow-x-hidden">
            <div className="bg-[#E67E22] text-white p-3 shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <button
                            onClick={() => navigateTo(`/apiary/${hive.apiary_id}`)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors font-medium text-sm flex items-center gap-1 mb-1 w-fit"
                        >
                            <span>←</span> Back to Apiary
                        </button>
                        <div className="flex items-baseline gap-2 mt-1">
                            <Link href="/" className="hover:underline decoration-white/50 underline-offset-4">
                                <h1 className="text-xl font-bold leading-tight">{hive.name}</h1>
                            </Link>
                            <span className="text-xs opacity-90">
                                {hive.is_active ? 'Active' : 'Inactive'}
                                {!(hive.type?.includes('langstroth') && hive.type !== 'long_langstroth') && ` • ${hive.bar_count} bars`}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto p-2 space-y-3">
                <div id="hive-snapshots">
                    {(hive.type?.includes('langstroth') && hive.type !== 'long_langstroth') ? (
                        <div className="rounded-xl p-4">
                            <div className="flex justify-center mb-2">
                                <button
                                    onClick={handleOpenSettings}
                                    className="bg-[#E67E22] text-white text-xs px-6 py-2 rounded-full font-bold hover:bg-[#D35400] transition-colors shadow-sm uppercase tracking-wide"
                                >
                                    Edit Hive
                                </button>
                            </div>
                            <h3 className="text-sm font-bold text-[#4A3C28] uppercase tracking-wide mb-4 text-center">Current Configuration</h3>
                            <LangstrothBuilder
                                readOnly={true}
                                initialBoxes={((): HiveBox[] => {
                                    const raw = displayedSnapshot?.bars || hive.bars;
                                    if (Array.isArray(raw)) return raw as unknown as HiveBox[];
                                    if (typeof raw === 'string') {
                                        try { return JSON.parse(raw); } catch (e) { return []; }
                                    }
                                    return [];
                                })()}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex justify-center">
                                <button
                                    onClick={handleOpenSettings}
                                    className="bg-[#E67E22] text-white text-xs px-6 py-2 rounded-full font-bold hover:bg-[#D35400] transition-colors shadow-sm uppercase tracking-wide"
                                >
                                    Edit Hive
                                </button>
                            </div>
                            <BarVisualizer
                                hive={hive}
                                snapshot={displayedSnapshot}
                                hiveId={hive.id}
                                onSnapshotCreate={() => { fetchData(); setSelectedSnapshotId(null); }}
                                readOnly={!!selectedSnapshotId}
                                isOwner={!apiary || apiary.user_id === userId}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div id="inspection-history" className="bg-white rounded-lg shadow-sm px-2 pt-2 pb-0 border border-gray-100 overflow-hidden h-full flex flex-col">
                        <div className="flex justify-between items-center mb-1 px-1 shrink-0">
                            <h3 className="text-sm font-bold text-[#4A3C28] uppercase tracking-wide">History</h3>
                            <button
                                className="text-xs text-[#E67E22] font-medium"
                                onClick={() => setSelectedSnapshotId(null)}
                            >
                                {selectedSnapshotId ? 'Back to Latest' : ''}
                            </button>
                        </div>
                        <div className={`${(hive.type?.includes('langstroth') && hive.type !== 'long_langstroth') ? 'flex flex-row space-x-2 overflow-x-auto p-2' : 'flex flex-col space-y-0'} grow`}>
                            {snapshots.length === 0 && <div className="text-xs text-center text-gray-400 py-2 w-full">No history loaded</div>}
                            {snapshots.slice(0, showAllHistory ? undefined : 3).map((snapshot) => (
                                <div key={snapshot.id} className={`${(hive.type?.includes('langstroth') && hive.type !== 'long_langstroth') ? 'min-w-[80px] border-r border-gray-100 last:border-r-0' : 'w-full'}`}>
                                    <HistoryItem
                                        snapshot={snapshot}
                                        onSelect={() => setSelectedSnapshotId(snapshot.id)}
                                        onDelete={() => setSnapshotToDelete(snapshot)}
                                    />
                                </div>
                            ))}
                        </div>
                        {snapshots.length > 3 && (
                            <button
                                onClick={() => setShowAllHistory(!showAllHistory)}
                                className="w-full text-center text-xs text-[#E67E22] font-medium py-2 hover:bg-[#FFF8F0] border-t border-gray-100 shrink-0"
                            >
                                {showAllHistory ? 'Show Less' : `View All (${snapshots.length})`}
                            </button>
                        )}
                    </div>

                    <div id="hive-notes" className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 h-full">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-[#4A3C28] uppercase tracking-wide">Notes</h3>
                            <button
                                onClick={handleOpenSettings}
                                className="text-xs text-[#E67E22] font-medium hover:text-[#D35400] flex items-center gap-1"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </button>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap min-h-[60px]">
                            {hive.notes ? (
                                hive.notes
                            ) : (
                                <span className="text-gray-400 italic">No notes added yet. Click edit to add details about this hive.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 mb-4">
                    {[{ id: 'Inspections', tabId: 'new-inspection-button' }, { id: 'Interventions', tabId: 'interventions-tab' }, { id: 'Tasks', tabId: 'tasks-tab' }].map((tab) => (
                        <button
                            key={tab.id}
                            id={tab.id === activeTab ? tab.tabId : undefined}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-[#E67E22] text-[#E67E22]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.id}
                        </button>
                    ))}
                </div>

                {activeTab === 'Inspections' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Recent Inspections</h3>
                            <button onClick={() => { if (checkOwnership()) setIsAddingInspection(true); }} className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white font-semibold">+ Add</button>
                        </div>
                        <Modal isOpen={isAddingInspection} onClose={() => setIsAddingInspection(false)} title="New Inspection">
                            <InspectionForm
                                hiveId={hive.id}
                                initialData={editingInspection}
                                onSuccess={() => { setIsAddingInspection(false); setEditingInspection(undefined); setInspectionRefreshKey(p => p + 1); }}
                                onCancel={() => { setIsAddingInspection(false); setEditingInspection(undefined); }}
                            />
                        </Modal>
                        <InspectionList
                            hive={hive}
                            refreshKey={inspectionRefreshKey}
                            onRefresh={() => setInspectionRefreshKey(p => p + 1)}
                            onEdit={(item) => { if (checkOwnership()) { setEditingInspection(item); setIsAddingInspection(true); } }}
                        />
                    </div>
                )}

                {activeTab === 'Interventions' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Recent Interventions</h3>
                            <button onClick={() => { if (checkOwnership()) setIsAddingIntervention(true); }} className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white font-semibold">+ Add</button>
                        </div>
                        <Modal isOpen={isAddingIntervention} onClose={() => setIsAddingIntervention(false)} title="Add Intervention">
                            <InterventionForm
                                hiveId={hive.id}
                                initialData={editingIntervention}
                                onSuccess={() => { setIsAddingIntervention(false); setEditingIntervention(undefined); setInterventionRefreshKey(p => p + 1); }}
                                onCancel={() => { setIsAddingIntervention(false); setEditingIntervention(undefined); }}
                            />
                        </Modal>
                        <InterventionList
                            hive={hive}
                            refreshKey={interventionRefreshKey}
                            onRefresh={() => setInterventionRefreshKey(p => p + 1)}
                            onEdit={(item) => { if (checkOwnership()) { setEditingIntervention(item); setIsAddingIntervention(true); } }}
                        />
                    </div>
                )}

                {activeTab === 'Tasks' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Pending Tasks</h3>
                                <button onClick={() => { if (checkOwnership()) setIsAddingTask(true); }} className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white font-semibold">+ Add</button>
                            </div>
                            <label className="flex items-center text-[10px] text-gray-500 cursor-pointer select-none space-x-1.5 hover:text-gray-700 bg-white px-2 py-1 rounded border border-gray-100">
                                <input type="checkbox" checked={showCompletedTasks} onChange={(e) => setShowCompletedTasks(e.target.checked)} className="w-3 h-3 text-gray-500 border-gray-300 rounded focus:ring-0" />
                                <span>Show Completed</span>
                            </label>
                        </div>
                        <Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
                            <TaskForm
                                hiveId={hive.id}
                                apiaryId={hive.apiary_id}
                                initialData={editingTask}
                                onSuccess={() => { setIsAddingTask(false); setEditingTask(undefined); setTaskRefreshKey(p => p + 1); }}
                                onCancel={() => { setIsAddingTask(false); setEditingTask(undefined); }}
                            />
                        </Modal>
                        <TaskList
                            hive={hive}
                            refreshKey={taskRefreshKey}
                            onRefresh={() => setTaskRefreshKey(p => p + 1)}
                            onEdit={(item) => { if (checkOwnership()) { setEditingTask(item); setIsAddingTask(true); } }}
                            showCompleted={showCompletedTasks}
                        />
                    </div>
                )}
            </div>

            <Modal isOpen={isEditingSettings} onClose={() => setIsEditingSettings(false)} title="Edit Hive" maxWidth="max-w-5xl" persistent={true}>
                <HiveForm
                    apiaryId={hive.apiary_id}
                    initialData={hive}
                    onSuccess={() => {
                        setIsEditingSettings(false);
                        fetchData();
                    }}
                    onCancel={() => setIsEditingSettings(false)}
                />
            </Modal>

            <Modal isOpen={!!snapshotToDelete} onClose={() => setSnapshotToDelete(null)} title="Confirm Delete">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Are you sure you want to delete this snapshot?</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setSnapshotToDelete(null)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
                        <button onClick={confirmSnapshotDelete} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded">Delete</button>
                    </div>
                </div>
            </Modal>

            {/* Guided Tour */}
            <Tour
                tourId="hive-detail"
                steps={hiveDetailTour}
                autoStart={true}
            />
        </div>
    );
}
