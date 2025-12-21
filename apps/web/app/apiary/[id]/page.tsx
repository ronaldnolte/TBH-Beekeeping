'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Apiary, Hive } from '@tbh-beekeeper/shared';
import { navigateTo } from '../../../lib/navigation';
import { Modal } from '../../../components/Modal';
import { HiveForm } from '../../../components/HiveForm';
import { MoveHiveModal } from '../../../components/MoveHiveModal';
import { supabase } from '../../../lib/supabase';

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
            {isEditing && (
                <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-sm">
                    <button onClick={(e) => { e.stopPropagation(); onEditInfo(); }} className="w-full bg-blue-500 text-white font-bold py-2 rounded">✏️ Edit Info</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-full bg-red-500 text-white font-bold py-2 rounded">🗑️ Delete</button>
                </div>
            )}
            <div className="p-3">
                <div className="mb-2">
                    <h3 className="text-base font-bold text-[#4A3C28] truncate">{hive.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${hive.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {hive.is_active ? 'Active' : 'Archived'}
                    </span>
                </div>
                <div className="text-xs space-y-0.5 mb-2 text-gray-600">
                    <div>{hive.bar_count} bars</div>
                    <div className="truncate">Last: {hive.last_inspection_date ? new Date(hive.last_inspection_date).toLocaleDateString() : 'Never'}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => window.location.href = `/hive/${hive.id}`} className="w-full bg-[#8B4513] text-white font-semibold py-1.5 px-2 rounded text-xs">View</button>
                    <button onClick={onMove} className="w-full border border-gray-300 text-gray-700 font-semibold py-1.5 px-2 rounded text-xs">Move</button>
                </div>
            </div>
        </div>
    );
};

const ApiaryDashboard = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const apiaryId = params.id;

    const [apiary, setApiary] = useState<Apiary | null>(null);
    const [hives, setHives] = useState<Hive[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [movingHive, setMovingHive] = useState<Hive | null>(null);
    const [editingHive, setEditingHive] = useState<Hive | null>(null);
    const [isCreatingHive, setIsCreatingHive] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        const { data: apiaryData } = await supabase.from('apiaries').select('*').eq('id', apiaryId).single();
        if (apiaryData) {
            const { data: hiveData } = await supabase.from('hives').select('*').eq('apiary_id', apiaryId).order('created_at', { ascending: false });
            setApiary(apiaryData);
            setHives(hiveData || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [apiaryId]);

    const handleDeleteHive = async (hive: Hive) => {
        if (!confirm(`Are you sure you want to delete hive "${hive.name}"? This will also delete all inspections and history.`)) return;

        // Manual Cascade Delete
        await supabase.from('inspections').delete().eq('hive_id', hive.id);
        await supabase.from('interventions').delete().eq('hive_id', hive.id);
        await supabase.from('tasks').delete().eq('hive_id', hive.id);
        await supabase.from('hive_snapshots').delete().eq('hive_id', hive.id);

        const { error } = await supabase.from('hives').delete().eq('id', hive.id);

        if (error) {
            alert('Failed to delete hive: ' + error.message);
        } else {
            fetchData();
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading Apiary...</div>;
    if (!apiary) return <div className="p-10 text-center">Apiary not found.</div>;

    return (
        <div className="min-h-screen honeycomb-bg">
            <div className="bg-[#E67E22] text-white p-6 shadow-md relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-start mb-2">
                        <button onClick={() => navigateTo('/apiary-selection')} className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm">← Back to Apiaries</button>
                        <button
                            onClick={() => navigateTo(`/apiary-selection/forecast?apiaryId=${apiaryId}`)}
                            className="bg-white text-[#E67E22] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-100"
                        >
                            📊 View Forecast
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold">{apiary.name}</h1>
                    <p className="text-sm opacity-90 mt-1">{hives.length} hives • {apiary.zip_code}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-[#4A3C28]">Your Hives</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setIsCreatingHive(true)} className="border-2 border-[#8B4513] bg-white text-[#8B4513] font-semibold py-2 px-4 rounded-lg hover:bg-[#FFF8F0] text-sm">+ Add Hive</button>
                        <button onClick={() => setEditMode(!editMode)} className={`px-4 py-2 rounded-lg font-semibold text-sm ${editMode ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{editMode ? '✓ Done' : '✏️ Edit'}</button>
                    </div>
                </div>

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
                        <h3 className="text-lg font-medium text-gray-600">This apiary is empty</h3>
                        <button onClick={() => setIsCreatingHive(true)} className="mt-4 px-6 py-2 bg-[#E67E22] text-white rounded-lg font-bold">Create First Hive</button>
                    </div>
                )}
            </div>

            {movingHive && (
                <MoveHiveModal
                    isOpen={!!movingHive}
                    onClose={() => { setMovingHive(null); fetchData(); }}
                    hive={movingHive}
                    currentApiaryId={apiary.id}
                />
            )}

            <Modal isOpen={isCreatingHive} onClose={() => setIsCreatingHive(false)} title="Add New Hive">
                <HiveForm
                    apiaryId={apiary.id}
                    onSuccess={() => { setIsCreatingHive(false); fetchData(); }}
                    onCancel={() => setIsCreatingHive(false)}
                />
            </Modal>

            <Modal isOpen={!!editingHive} onClose={() => setEditingHive(null)} title="Edit Hive">
                <HiveForm
                    apiaryId={apiary.id}
                    initialData={editingHive || undefined}
                    onSuccess={() => { setEditingHive(null); fetchData(); }}
                    onCancel={() => setEditingHive(null)}
                />
            </Modal>
        </div>
    );
};

export default ApiaryDashboard;
