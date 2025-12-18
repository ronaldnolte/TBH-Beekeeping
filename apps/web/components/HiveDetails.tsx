'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../lib/database';
import { BarVisualizer } from './BarVisualizer';
import { InterventionList } from './InterventionList';
import { InterventionForm } from './InterventionForm';
import { InspectionList } from './InspectionList';
import { InspectionForm } from './InspectionForm';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { Modal } from './Modal';
import { Hive, HiveSnapshot, BarState, Inspection, Intervention, Apiary, Task } from '@tbh-beekeeper/shared';
import { map } from 'rxjs/operators';

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

// History Item Component with click handler
const HistoryItemRaw = ({ snapshot, onSelect }: { snapshot: HiveSnapshot, onSelect: () => void }) => {
    // Parse bars for mini rendering
    const bars: BarState[] = snapshot.bars
        ? (typeof snapshot.bars === 'string' ? JSON.parse(snapshot.bars) : snapshot.bars)
        : [];

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this snapshot?')) {
            try {
                await snapshot.collection.database.write(async () => {
                    await snapshot.markAsDeleted(); // Sync-safe deletion
                });
            } catch (error) {
                console.error('Failed to delete snapshot:', error);
            }
        }
    };

    const [viewingSnapshot, setViewingSnapshot] = useState<HiveSnapshot | null>(null);

    return (
        <>
            <div onClick={onSelect} className="flex-shrink-0 w-[200px] flex flex-col p-2 hover:bg-gray-50 rounded border border-gray-100 transition-colors cursor-pointer group bg-white mr-2 snapping-card">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-800">
                            {snapshot.timestamp.toLocaleDateString()}
                        </span>
                        <span className="text-[9px] text-gray-500">
                            {snapshot.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded px-1 transition-colors"
                        title="Delete Snapshot"
                    >
                        ×
                    </button>
                </div>

                {/* Mini Visualizer */}
                <div className="flex gap-[1px] h-8 items-end overflow-hidden">
                    {bars.slice(0, 30).map((bar) => (
                        <div
                            key={bar.position}
                            className="w-1.5 h-full rounded-[0.5px] border-[0.5px] border-black/10"
                            style={{
                                backgroundColor: BAR_COLORS[bar.status as BarStatus] || BAR_COLORS.inactive,
                                height: '100%'
                            }}
                            title={`Bar ${bar.position}: ${bar.status}`}
                        />
                    ))}
                    {bars.length > 30 && <div className="text-[8px] text-gray-300 self-center">...</div>}
                </div>
            </div>
        </>
    );
};

const HistoryItem = withObservables(['snapshot'], ({ snapshot }) => ({
    snapshot: snapshot.observe()
}))(HistoryItemRaw);

// Component receiving the Hive and its Snapshots as props
function HiveDetailsRaw({ hive, latestSnapshot, renderedSnapshots, onSnapshotCreate }: {
    hive: Hive,
    latestSnapshot?: HiveSnapshot,
    renderedSnapshots?: HiveSnapshot[],
    onSnapshotCreate?: () => void
}) {
    console.log('HiveDetailsRaw rendering', { id: hive.id, snapshotsCount: renderedSnapshots?.length });
    const router = useRouter();
    const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
    const [viewAllHistory, setViewAllHistory] = useState(false);
    const [activeTab, setActiveTab] = useState<'Inspections' | 'Interventions' | 'Tasks'>('Inspections');

    const [isAddingIntervention, setIsAddingIntervention] = useState(false);
    const [editingIntervention, setEditingIntervention] = useState<Intervention | undefined>(undefined);
    const [interventionRefreshKey, setInterventionRefreshKey] = useState(0);

    const [isAddingInspection, setIsAddingInspection] = useState(false);
    const [editingInspection, setEditingInspection] = useState<Inspection | undefined>(undefined);
    const [inspectionRefreshKey, setInspectionRefreshKey] = useState(0);

    // Task State
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [taskRefreshKey, setTaskRefreshKey] = useState(0);

    // Hive Settings / Move State
    const [isEditingSettings, setIsEditingSettings] = useState(false);
    const [apiaryList, setApiaryList] = useState<Apiary[]>([]);
    const [editName, setEditName] = useState('');
    const [editApiaryId, setEditApiaryId] = useState('');

    const handleOpenSettings = async () => {
        setEditName(hive.name);
        setEditApiaryId(hive.apiaryId);
        const apiaries = await database.collections.get<Apiary>('apiaries').query().fetch();
        setApiaryList(apiaries);
        setIsEditingSettings(true);
    };

    const handleSaveSettings = async () => {
        if (!editName.trim()) return;
        try {
            await database.write(async () => {
                await hive.update(h => {
                    h.name = editName;
                    h.apiaryId = editApiaryId;
                });
            });
            setIsEditingSettings(false);
        } catch (e) {
            console.error(e);
            alert('Failed to update hive');
        }
    };

    if (!hive || !latestSnapshot) {
        return <div className="min-h-screen flex items-center justify-center">Loading Hive Data...</div>;
    }

    // Determine which snapshot to show: selected or latest
    const displayedSnapshot = selectedSnapshotId
        ? renderedSnapshots?.find(s => s.id === selectedSnapshotId) || latestSnapshot
        : latestSnapshot;

    const visibleSnapshots = viewAllHistory ? renderedSnapshots : renderedSnapshots?.slice(0, 3);

    const handleCaptureSuccess = () => {
        if (onSnapshotCreate) onSnapshotCreate();
        setSelectedSnapshotId(null); // Switch view to latest
    };

    return (
        <div className="min-h-screen honeycomb-bg">
            {/* Header */}
            <div className="bg-[#E67E22] text-white p-3 shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <Link
                            href={`/apiary/${hive.apiaryId}`}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors font-medium text-sm flex items-center gap-1 mb-1 w-fit"
                        >
                            <span>←</span> Back to Apiary
                        </Link>
                        <div className="flex items-baseline gap-2 mt-1">
                            <Link href="/" className="hover:underline decoration-white/50 underline-offset-4">
                                <h1 className="text-xl font-bold leading-tight">{hive.name}</h1>
                            </Link>
                            <span className="text-xs opacity-90">{hive.isActive ? 'Active' : 'Inactive'} • {hive.barCount} bars</span>
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
                {/* Bar Visualizer */}
                <BarVisualizer
                    hive={hive}
                    snapshot={displayedSnapshot} // Still pass snapshot for read-only history view if needed
                    hiveId={hive.id}
                    onSnapshotCreate={handleCaptureSuccess}
                    readOnly={!!selectedSnapshotId} // New prop: if a history item is selected, visualizer should be read-only
                />

                {/* Configuration History - Collapsible or Compact */}
                <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-[#4A3C28] uppercase tracking-wide">History</h3>
                        <button
                            className="text-xs text-[#E67E22] font-medium"
                            onClick={() => setSelectedSnapshotId(null)}
                        >
                            {selectedSnapshotId ? 'Back to Latest' : ''}
                        </button>
                    </div>
                    {/* History List - Horizontal Scroll */}
                    <div className="flex overflow-x-auto pb-2 -mx-2 px-2 snap-x">
                        {(!renderedSnapshots || renderedSnapshots.length === 0) && <div className="text-xs text-center text-gray-400 py-2 w-full">No history loaded</div>}
                        {renderedSnapshots?.map((snapshot) => (
                            <HistoryItem
                                key={snapshot.id}
                                snapshot={snapshot}
                                onSelect={() => setSelectedSnapshotId(snapshot.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-200 mb-4">
                    <button
                        onClick={() => setActiveTab('Inspections')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'Inspections' ? 'border-[#E67E22] text-[#E67E22]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Inspections
                    </button>
                    <button
                        onClick={() => setActiveTab('Interventions')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'Interventions' ? 'border-[#E67E22] text-[#E67E22]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Interventions
                    </button>
                    <button
                        onClick={() => setActiveTab('Tasks')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'Tasks' ? 'border-[#E67E22] text-[#E67E22]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Tasks
                    </button>
                </div>

                {/* Tab Content: Inspections */}
                {activeTab === 'Inspections' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Recent Inspections</h3>
                            <button
                                onClick={() => setIsAddingInspection(true)}
                                className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white transition-colors font-semibold shadow-sm"
                            >
                                + Add
                            </button>
                        </div>

                        <Modal
                            isOpen={isAddingInspection}
                            onClose={() => setIsAddingInspection(false)}
                            title="New Inspection"
                        >
                            <InspectionForm
                                key={editingInspection ? editingInspection.id : 'new-inspection'}
                                hiveId={hive.id}
                                initialData={editingInspection} // Pass editing state to form
                                onSuccess={() => {
                                    setIsAddingInspection(false);
                                    setEditingInspection(undefined); // Clear editing state on success
                                    setInspectionRefreshKey(prev => prev + 1);
                                }}
                                onCancel={() => {
                                    setIsAddingInspection(false);
                                    setEditingInspection(undefined);
                                }}
                            />
                        </Modal>

                        <InspectionList
                            hive={hive}
                            refreshKey={inspectionRefreshKey}
                            onRefresh={() => setInspectionRefreshKey(prev => prev + 1)}
                            onEdit={(inspection: Inspection) => {
                                setEditingInspection(inspection);
                                setIsAddingInspection(true);
                            }}
                        />
                    </div>
                )}

                {/* Tab Content: Interventions */}
                {activeTab === 'Interventions' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Recent Interventions</h3>
                            <button
                                onClick={() => setIsAddingIntervention(true)}
                                className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white transition-colors font-semibold shadow-sm"
                            >
                                + Add
                            </button>
                        </div>

                        {/* Modal for adding Intervention */}
                        <Modal
                            isOpen={isAddingIntervention}
                            onClose={() => setIsAddingIntervention(false)}
                            title="Add Intervention"
                        >
                            <InterventionForm
                                key={editingIntervention ? editingIntervention.id : 'new-intervention'}
                                hiveId={hive.id}
                                initialData={editingIntervention}
                                onSuccess={() => {
                                    setIsAddingIntervention(false);
                                    setEditingIntervention(undefined);
                                    setInterventionRefreshKey(prev => prev + 1);
                                }}
                                onCancel={() => {
                                    setIsAddingIntervention(false);
                                    setEditingIntervention(undefined);
                                }}
                            />
                        </Modal>

                        <InterventionList
                            hive={hive}
                            refreshKey={interventionRefreshKey}
                            onRefresh={() => setInterventionRefreshKey(prev => prev + 1)}
                            onEdit={(intervention: Intervention) => {
                                setEditingIntervention(intervention);
                                setIsAddingIntervention(true);
                            }}
                        />
                    </div>
                )}

                {/* Tab Content: Tasks */}
                {activeTab === 'Tasks' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-6 mb-2">
                            <h3 className="text-xs font-bold text-[#4A3C28] uppercase tracking-wide opacity-80">Pending Tasks</h3>
                            <button
                                onClick={() => setIsAddingTask(true)}
                                className="text-xs bg-white border border-[#E67E22] text-[#E67E22] px-3 py-1 rounded hover:bg-[#E67E22] hover:text-white transition-colors font-semibold shadow-sm"
                            >
                                + Add
                            </button>
                        </div>

                        <Modal
                            isOpen={isAddingTask}
                            onClose={() => setIsAddingTask(false)}
                            title={editingTask ? 'Edit Task' : 'New Task'}
                        >
                            <TaskForm
                                key={editingTask ? editingTask.id : 'new-task'}
                                hiveId={hive.id}
                                initialData={editingTask}
                                onSuccess={() => {
                                    setIsAddingTask(false);
                                    setEditingTask(undefined);
                                    setTaskRefreshKey(prev => prev + 1);
                                }}
                                onCancel={() => {
                                    setIsAddingTask(false);
                                    setEditingTask(undefined);
                                }}
                            />
                        </Modal>

                        <TaskList
                            hive={hive}
                            refreshKey={taskRefreshKey}
                            onRefresh={() => setTaskRefreshKey(prev => prev + 1)}
                            onEdit={(task: Task) => {
                                setEditingTask(task);
                                setIsAddingTask(true);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Hive Settings Modal */}
            <Modal
                isOpen={isEditingSettings}
                onClose={() => setIsEditingSettings(false)}
                title="Hive Settings"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hive Name</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#E67E22] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location (Apiary)</label>
                        <select
                            value={editApiaryId}
                            onChange={e => setEditApiaryId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#E67E22] outline-none"
                        >
                            {apiaryList.map(apiary => (
                                <option key={apiary.id} value={apiary.id}>
                                    {apiary.name} {apiary.zipCode === '00000' ? '(Unassigned)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="text-xs text-gray-500 mt-1">
                            Moving this hive will change its weather data source.
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsEditingSettings(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveSettings}
                            className="px-4 py-2 bg-[#E67E22] text-white rounded font-bold hover:bg-[#D35400]"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

const enhance = withObservables(['hiveId'], ({ hiveId }) => ({
    hive: database.get<Hive>('hives').findAndObserve(hiveId),
}));

const enhanceSnapshot = withObservables(['hive', 'refreshKey'], ({ hive }) => ({
    latestSnapshot: hive.snapshots.observe().pipe(
        map((snapshots: HiveSnapshot[]) => {
            if (!snapshots || snapshots.length === 0) return null;
            return [...snapshots].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
        })
    ),
    renderedSnapshots: hive.snapshots.observe().pipe(
        map((snapshots: HiveSnapshot[]) => {
            if (!snapshots || snapshots.length === 0) return [];
            return [...snapshots].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        })
    ),
}));

const ConnectedHiveDetails = enhance(enhanceSnapshot(HiveDetailsRaw));

export const HiveDetails = ({ hiveId }: { hiveId: string }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    return (
        <ConnectedHiveDetails
            hiveId={hiveId}
            refreshKey={refreshKey}
            onSnapshotCreate={() => setRefreshKey(prev => prev + 1)}
        />
    );
};
