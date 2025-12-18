'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { database } from '../../../lib/database';
import { Apiary, Hive } from '@tbh-beekeeper/shared';

const HiveCard = ({ hive, apiaryName, onEditInfo, onDelete, onMove, isEditing }: {
    hive: Hive,
    apiaryName: string,
    onEditInfo: any,
    onDelete: any,
    onMove: any,
    isEditing: boolean
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group">
            {/* Edit Overlay */}
            {isEditing && (
                <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-sm">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEditInfo(); }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded shadow-md transition-colors"
                    >
                        ✏️ Edit Info
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded shadow-md transition-colors"
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}

            <div className="p-3">
                <div className="mb-2">
                    <h3 className="text-base font-bold text-[#4A3C28] truncate">{hive.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${hive.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {hive.isActive ? 'Active' : 'Archived'}
                    </span>
                </div>
                <div className="text-xs space-y-0.5 mb-2 text-gray-600">
                    <div>{hive.barCount} bars</div>
                    {/* TODO: Fetch real last inspection */}
                    <div className="truncate">Last: Never</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                        onClick={() => window.location.href = `/hive/${hive.id}`}
                        className="w-full bg-[#8B4513] hover:bg-[#723910] text-white font-semibold py-1.5 px-2 rounded text-xs transition-colors"
                    >
                        View
                    </button>
                    <button
                        onClick={onMove}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-1.5 px-2 rounded text-xs transition-colors"
                    >
                        Move
                    </button>
                </div>
            </div>
        </div>
    );
};

import { useEffect } from 'react';
import { Modal } from '../../../components/Modal';
import { HiveForm } from '../../../components/HiveForm';
import { MoveHiveModal } from '../../../components/MoveHiveModal';

// Manual Subscription Component
const ApiaryDashboard = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const hiveId = params.id;

    // State
    const [apiary, setApiary] = useState<Apiary | null>(null);
    const [hives, setHives] = useState<Hive[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // UI State
    const [editMode, setEditMode] = useState(false);
    const [movingHive, setMovingHive] = useState<Hive | null>(null);
    const [editingHive, setEditingHive] = useState<Hive | null>(null);
    const [isCreatingHive, setIsCreatingHive] = useState(false);

    // Action: Delete Hive
    const handleDeleteHive = async (hive: Hive) => {
        if (!confirm(`Are you sure you want to delete hive "${hive.name}"? This will also delete all inspections, interventions, and history for this hive.`)) return;
        if (!confirm(`This is permanent and cannot be undone. Are you absolutely sure?`)) return;

        try {
            await database.write(async () => {
                // Fetch related records to delete (Cascading Delete)
                // Note: We use query().fetch() inside the action to ensure we get current data
                const inspections = await hive.inspections.fetch();
                const interventions = await hive.interventions.fetch();
                const snapshots = await hive.snapshots.fetch();
                const tasks = await hive.tasks.fetch();

                // Batch delete all children + the hive itself
                const allToDelete = [
                    ...inspections,
                    ...interventions,
                    ...snapshots,
                    ...tasks,
                    hive
                ];

                // Use batch marking for deletion
                for (const record of allToDelete) {
                    await record.markAsDeleted();
                }
            });
            // Manual subscription will pick up the change automatically
        } catch (error) {
            console.error('Delete hive failed:', error);
            alert('Failed to delete hive.');
        }
    };

    // Effect: Subscribe to Apiary
    useEffect(() => {
        const apiaryQuery = database.collections.get<Apiary>('apiaries').findAndObserve(hiveId);
        const sub = apiaryQuery.subscribe(record => {
            setApiary(record);
        });
        return () => sub.unsubscribe();
    }, [hiveId]);

    // Effect: Subscribe to Hives
    useEffect(() => {
        if (!apiary) return;

        // Use Global Table Query instead of @children relation
        // This is often more reliable for "Create" events than watching the parent's association
        const hivesQuery = database.collections.get<Hive>('hives').query(
            Q.where('apiary_id', apiary.id),
            Q.sortBy('created_at', Q.desc)
        );

        const sub = hivesQuery.observe().subscribe((records: Hive[]) => {
            console.log('Hive update received:', records.length);
            setHives(records);
            setIsLoading(false);
        });

        return () => sub.unsubscribe();
    }, [apiary]); // Re-sub if apiary object reference changes (loaded)

    if (isLoading && !apiary) return <div className="p-10 text-center">Loading Apiary...</div>;
    if (!apiary) return <div className="p-10 text-center">Apiary not found.</div>;

    return (
        <div className="min-h-screen honeycomb-bg">
            {/* Header */}
            <div className="bg-[#E67E22] text-white p-6 shadow-md relative">
                <div className="max-w-7xl mx-auto flex items-start justify-between">
                    <div>
                        <button
                            onClick={() => router.push('/apiary-selection')}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors font-medium text-sm flex items-center gap-1 w-fit mb-2"
                        >
                            <span>←</span> Back to Apiaries
                        </button>
                        <h1 className="text-3xl font-bold">{apiary.name}</h1>
                        <p className="text-sm opacity-90 mt-1">{hives.length} hives • {apiary.zipCode}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-2xl font-semibold text-[#4A3C28]">Your Hives</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsCreatingHive(true)}
                            className="border-2 border-[#8B4513] bg-white text-[#8B4513] font-semibold py-2 px-4 rounded-lg hover:bg-[#FFF8F0] transition-colors text-sm">
                            + Add Hive
                        </button>
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${editMode
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {editMode ? '✓ Done' : '✏️ Edit'}
                        </button>
                    </div>
                </div>

                {/* Hive Cards */}
                {hives.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {hives.map(hive => (
                            <HiveCard
                                key={hive.id}
                                hive={hive}
                                apiaryName={apiary.name}
                                onEditInfo={() => setEditingHive(hive)}
                                onDelete={() => handleDeleteHive(hive)}
                                onMove={() => setMovingHive(hive)}
                                isEditing={editMode}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white/50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="text-4xl mb-2">📦</div>
                        <h3 className="text-lg font-medium text-gray-600">This apiary is empty</h3>
                        <p className="text-gray-500 text-sm">Add a hive to get started.</p>
                        <button
                            onClick={() => setIsCreatingHive(true)}
                            className="mt-4 px-6 py-2 bg-[#E67E22] text-white rounded-lg font-bold hover:bg-[#D35400]">
                            Create First Hive
                        </button>
                    </div>
                )}
            </div>

            {/* Move Modal */}
            {movingHive && (
                <MoveHiveModal
                    isOpen={!!movingHive}
                    onClose={() => setMovingHive(null)}
                    hive={movingHive}
                    currentApiaryId={apiary.id}
                    apiaries={[]} // This prop was missing in original usage too, handled by withObservables in Modal itself? 
                // Wait, MoveHiveModal wraps itself withObservables to fetch 'apiaries'. 
                // BUT, checking MoveHiveModal definition: it exports 'MoveHiveModal' which IS wrapped.
                // So we verify props.
                // MoveHiveModalRaw props: { isOpen, onClose, hive, currentApiaryId, apiaries }
                // The HOC injects 'apiaries'.
                // So we only pass open/close/hive/currentApiaryId.
                // Typescipt might complain if types aren't robust.
                />
            )}

            {/* Create Hive Modal */}
            <Modal
                isOpen={isCreatingHive}
                onClose={() => setIsCreatingHive(false)}
                title="Add New Hive"
            >
                <HiveForm
                    apiaryId={apiary.id}
                    onSuccess={() => setIsCreatingHive(false)}
                    onCancel={() => setIsCreatingHive(false)}
                />
            </Modal>

            {/* Edit Hive Modal */}
            <Modal
                isOpen={!!editingHive}
                onClose={() => setEditingHive(null)}
                title="Edit Hive"
            >
                <HiveForm
                    apiaryId={apiary.id}
                    initialData={editingHive || undefined}
                    onSuccess={() => setEditingHive(null)}
                    onCancel={() => setEditingHive(null)}
                />
            </Modal>
        </div>
    );
};

export default ApiaryDashboard;
