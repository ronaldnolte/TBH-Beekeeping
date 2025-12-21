'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarVisualizer } from './BarVisualizer';
import { InterventionList } from './InterventionList';
import { InterventionForm } from './InterventionForm';
import { InspectionList } from './InspectionList';
import { InspectionForm } from './InspectionForm';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { Modal } from './Modal';
import { Hive, HiveSnapshot, BarState, Inspection, Intervention, Apiary, Task } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { navigateTo } from '../lib/navigation';

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
        <div onClick={onSelect} className="w-full flex flex-col px-2 py-1 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer group bg-white">
            <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-bold text-gray-800">
                        {dateStr}
                    </span>
                    <span className="text-[10px] text-gray-500">
                        {timeStr}
                    </span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded px-1 transition-colors"
                    title="Delete Snapshot"
                >
                    ×
                </button>
            </div>

            <div className="flex gap-[1px] h-4 items-end overflow-hidden mt-0.5">
                {bars.slice(0, 30).map((bar) => (
                    <div
                        key={bar.position}
                        className="w-1.5 h-full rounded-[0.5px] border-[0.5px] border-black/50"
                        style={{
                            backgroundColor: BAR_COLORS[bar.status as BarStatus] || BAR_COLORS.inactive,
                            height: '100%'
                        }}
                        title={`Bar ${bar.position}: ${bar.status}`}
                    />
                ))}
                {bars.length > 30 && <div className="text-[6px] text-gray-300 self-center">...</div>}
            </div>
        </div>
    );
};

export const HiveDetails = ({ hiveId }: { hiveId: string }) => {
    const router = useRouter();
    const [hive, setHive] = useState<Hive | null>(null);
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
    const [apiaryList, setApiaryList] = useState<Apiary[]>([]);
    const [editName, setEditName] = useState('');
    const [editApiaryId, setEditApiaryId] = useState('');

    const fetchData = async () => {
        setLoading(true);
        const { data: hiveData } = await supabase.from('hives').select('*').eq('id', hiveId).single();
        if (hiveData) {
            setHive(hiveData);
            setEditName(hiveData.name);
            setEditApiaryId(hiveData.apiary_id);

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

    const handleSnapshotDelete = async (snapshot: HiveSnapshot) => {
        if (confirm('Delete this snapshot?')) {
            await supabase.from('hive_snapshots').delete().eq('id', snapshot.id);
            fetchData();
        }
    };

    const handleOpenSettings = async () => {
        const { data } = await supabase.from('apiaries').select('*');
        setApiaryList(data || []);
        setIsEditingSettings(true);
    };

    const handleSaveSettings = async () => {
        if (!editName.trim()) return;
        const { error } = await supabase
            .from('hives')
            .update({ name: editName, apiary_id: editApiaryId })
            .eq('id', hiveId);

        if (error) {
            alert('Failed to update hive');
        } else {
            setIsEditingSettings(false);
            fetchData();
        }
    };

    if (loading && !hive) return <div className="min-h-screen flex items-center justify-center">Loading Hive Data...</div>;
    if (!hive) return <div className="min-h-screen flex items-center justify-center">Hive not found</div>;

    const latestSnapshot = snapshots[0];
    const displayedSnapshot = selectedSnapshotId
        ? snapshots.find(s => s.id === selectedSnapshotId) || latestSnapshot
        : latestSnapshot;

    return (
        <div className="min-h-screen honeycomb-bg">
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
                            <span className="text-xs opacity-90">{hive.is_active ? 'Active' : 'Inactive'} • {hive.bar_count} bars</span>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenSettings}
                        className="bg-white/20 text-white text-xs px-3 py-1.5 rounded font-semibold hover:bg-white/30 backdrop-blur-sm"
                    >
                        Edit
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-2 space-y-3">
                <BarVisualizer
                    hive={hive}
                    snapshot={displayedSnapshot}
                    hiveId={hive.id}
                    onSnapshotCreate={() => { fetchData(); setSelectedSnapshotId(null); }}
                    readOnly={!!selectedSnapshotId}
                />

                <div className="bg-white rounded-lg shadow-sm px-2 pt-2 pb-0 border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center mb-1 px-1">
                        <h3 className="text-sm font-bold text-[#4A3C28] uppercase tracking-wide">History</h3>
                        <button
                            className="text-xs text-[#E67E22] font-medium"
                            onClick={() => setSelectedSnapshotId(null)}
                        >
                            {selectedSnapshotId ? 'Back to Latest' : ''}
                        </button>
                    </div>
                    <div className="flex flex-col space-y-0">
                        {snapshots.length === 0 && <div className="text-xs text-center text-gray-400 py-2 w-full">No history loaded</div>}
                        {snapshots.slice(0, showAllHistory ? undefined : 3).map((snapshot) => (
                            <HistoryItem
                                key={snapshot.id}
                                snapshot={snapshot}
                                onSelect={() => setSelectedSnapshotId(snapshot.id)}
                                onDelete={() => handleSnapshotDelete(snapshot)}
                            />
                        ))}
                    </div>
                    {snapshots.length > 3 && (
                        <button
                            onClick={() => setShowAllHistory(!showAllHistory)}
                            className="w-full text-center text-xs text-[#E67E22] font-medium py-2 hover:bg-[#FFF8F0] border-t border-gray-100"
                        >
                            {showAllHistory ? 'Show Less' : `View All (${snapshots.length})`}
                        </button>
                    )}
                </div>

                <div className="flex border-b border-gray-200 mb-4">
                    {['Inspections', 'Interventions', 'Tasks'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-[#E67E22] text-[#E67E22]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'Inspections' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Recent Inspections</h3>
                            <button onClick={() => setIsAddingInspection(true)} className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white font-semibold">+ Add</button>
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
                            onEdit={(item) => { setEditingInspection(item); setIsAddingInspection(true); }}
                        />
                    </div>
                )}

                {activeTab === 'Interventions' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Recent Interventions</h3>
                            <button onClick={() => setIsAddingIntervention(true)} className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white font-semibold">+ Add</button>
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
                            onEdit={(item) => { setEditingIntervention(item); setIsAddingIntervention(true); }}
                        />
                    </div>
                )}

                {activeTab === 'Tasks' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Pending Tasks</h3>
                                <button onClick={() => setIsAddingTask(true)} className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white font-semibold">+ Add</button>
                            </div>
                            <label className="flex items-center text-[10px] text-gray-500 cursor-pointer select-none space-x-1.5 hover:text-gray-700 bg-white px-2 py-1 rounded border border-gray-100">
                                <input type="checkbox" checked={showCompletedTasks} onChange={(e) => setShowCompletedTasks(e.target.checked)} className="w-3 h-3 text-gray-500 border-gray-300 rounded focus:ring-0" />
                                <span>Show Completed</span>
                            </label>
                        </div>
                        <Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
                            <TaskForm
                                hiveId={hive.id}
                                initialData={editingTask}
                                onSuccess={() => { setIsAddingTask(false); setEditingTask(undefined); setTaskRefreshKey(p => p + 1); }}
                                onCancel={() => { setIsAddingTask(false); setEditingTask(undefined); }}
                            />
                        </Modal>
                        <TaskList
                            hive={hive}
                            refreshKey={taskRefreshKey}
                            onRefresh={() => setTaskRefreshKey(p => p + 1)}
                            onEdit={(item) => { setEditingTask(item); setIsAddingTask(true); }}
                            showCompleted={showCompletedTasks}
                        />
                    </div>
                )}
            </div>

            <Modal isOpen={isEditingSettings} onClose={() => setIsEditingSettings(false)} title="Hive Settings">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hive Name</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#E67E22] outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location (Apiary)</label>
                        <select value={editApiaryId} onChange={e => setEditApiaryId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#E67E22] outline-none">
                            {apiaryList.map(apiary => <option key={apiary.id} value={apiary.id}>{apiary.name} {apiary.zip_code === '00000' ? '(Unassigned)' : ''}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setIsEditingSettings(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button onClick={handleSaveSettings} className="px-4 py-2 bg-[#E67E22] text-white rounded font-bold hover:bg-[#D35400]">Save Changes</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
