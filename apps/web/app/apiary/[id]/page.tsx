'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Apiary, Hive } from '@tbh-beekeeper/shared';
import { navigateTo } from '../../../lib/navigation';
import { Modal } from '../../../components/Modal';
import { HiveForm } from '../../../components/HiveForm';
import { MoveHiveModal } from '../../../components/MoveHiveModal';
import { supabase } from '../../../lib/supabase';
import { Tour } from '../../../components/Tour';
import { apiaryDetailTour } from '../../../lib/tourDefinitions';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { AskAIButton } from '../../../components/AskAIButton';
import { AppHeader } from '../../../components/AppHeader';

const HiveCard = ({ hive, apiaryName, onEditInfo, onDelete, onMove, isEditing }: {
    hive: Hive,
    apiaryName: string,
    onEditInfo: any,
    onDelete: any,
    onMove: any,
    isEditing: boolean
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group w-[calc(50%-0.5rem)] sm:w-48 shrink-0 text-left flex flex-col">
            {isEditing && (
                <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-sm">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditInfo(); }} className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold py-2 rounded shadow-md pointer-events-auto">✏️ Edit Info</button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white font-bold py-2 rounded shadow-md pointer-events-auto">🗑️ Delete</button>
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
                    {!hive.type?.includes('langstroth') && <div>{hive.bar_count} bars</div>}
                    <div className="truncate">Last: {hive.last_inspection_date ? new Date(hive.last_inspection_date).toLocaleDateString() : 'Never'}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => navigateTo(`/hive/${hive.id}`)} className="w-full bg-[#8B4513] text-white font-semibold py-1.5 px-2 rounded text-xs">View</button>
                    <button onClick={onMove} className="w-full border border-gray-300 text-gray-700 font-semibold py-1.5 px-2 rounded text-xs">Move</button>
                </div>
            </div>
        </div>
    );
};

const ApiaryDashboard = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { userId } = useCurrentUser();
    const apiaryId = params.id;

    const [apiary, setApiary] = useState<Apiary | null>(null);
    const [hives, setHives] = useState<Hive[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [movingHive, setMovingHive] = useState<Hive | null>(null);
    const [editingHive, setEditingHive] = useState<Hive | null>(null);
    const [isCreatingHive, setIsCreatingHive] = useState(false);
    const [deletingHive, setDeletingHive] = useState<Hive | null>(null);

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

    const executeDelete = async (hive: Hive) => {
        await supabase.from('inspections').delete().eq('hive_id', hive.id);
        await supabase.from('interventions').delete().eq('hive_id', hive.id);
        await supabase.from('tasks').delete().eq('hive_id', hive.id);
        await supabase.from('hive_snapshots').delete().eq('hive_id', hive.id);
        const { error } = await supabase.from('hives').delete().eq('id', hive.id);
        if (error) {
            alert('Failed to delete hive: ' + error.message);
        } else {
            setDeletingHive(null);
            fetchData();
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading Apiary...</div>;
    if (!apiary) return <div className="p-10 text-center">Apiary not found.</div>;

    return (
        <div className="min-h-screen honeycomb-bg">
            <AppHeader
                title={apiary.name}
                subtitle={`${hives.length} hives • ${apiary.zip_code}`}
            />

            {/* Top Toolbar */}
            <div className="bg-white border-b border-[#E6DCC3] px-4 md:px-8 py-2 md:py-3 shadow-sm mb-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
                    <div className="w-full flex flex-wrap items-center gap-3 md:gap-4 justify-center">
                        <button
                            onClick={() => navigateTo('/apiary-selection')}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-1.5"
                        >
                            <span>←</span> Apiaries
                        </button>
                        <button
                            id="weather-widget"
                            onClick={() => navigateTo(`/apiary-selection/forecast?apiaryId=${apiaryId}`)}
                            className="bg-white border border-[#E67E22] text-[#E67E22] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#E67E22] hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <span>📊</span> View Forecast
                        </button>
                        {userId && (
                            <AskAIButton apiaryId={apiaryId} userId={userId} />
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="mb-4 sm:mb-8 flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-semibold text-[#4A3C28]">Your Hives</h2>
                    <div className="flex gap-2 justify-center">
                        <button id="add-hive-button" onClick={() => setIsCreatingHive(true)} className="border-2 border-[#8B4513] bg-white text-[#8B4513] font-semibold py-2 px-4 rounded-lg hover:bg-[#FFF8F0] text-sm">+ Add Hive</button>
                        <button onClick={() => setEditMode(!editMode)} className={`px-4 py-2 rounded-lg font-semibold text-sm ${editMode ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{editMode ? '✓ Done' : '✏️ Edit'}</button>
                    </div>
                </div>

                {hives.length > 0 ? (
                    <div id="hive-list" className="flex flex-wrap justify-center gap-4">
                        {hives.map(hive => (
                            <HiveCard
                                key={hive.id}
                                hive={hive}
                                apiaryName={apiary.name}
                                onEditInfo={() => setEditingHive(hive)}
                                onDelete={() => setDeletingHive(hive)}
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

            <Modal isOpen={isCreatingHive} onClose={() => setIsCreatingHive(false)} title="Add New Hive" maxWidth="max-w-5xl">
                <HiveForm
                    apiaryId={apiary.id}
                    onSuccess={() => { setIsCreatingHive(false); fetchData(); }}
                    onCancel={() => setIsCreatingHive(false)}
                />
            </Modal>

            <Modal isOpen={!!editingHive} onClose={() => setEditingHive(null)} title="Edit Hive" maxWidth="max-w-5xl">
                <HiveForm
                    apiaryId={apiary.id}
                    initialData={editingHive || undefined}
                    onSuccess={() => { setEditingHive(null); fetchData(); }}
                    onCancel={() => setEditingHive(null)}
                />
            </Modal>

            <Modal isOpen={!!deletingHive} onClose={() => setDeletingHive(null)} title="Confirm Delete">
                <div className="space-y-4">
                    <p className="text-gray-700">Are you sure you want to delete the hive <strong>{deletingHive?.name}</strong>?</p>
                    <p className="text-sm border-l-4 border-red-500 bg-red-50 text-red-700 p-2">This will permanently delete all inspections, interventions, tasks, and history. This action cannot be undone.</p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button onClick={() => setDeletingHive(null)} className="px-4 py-2 font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button onClick={() => deletingHive && executeDelete(deletingHive)} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Yes, Delete Hive</button>
                    </div>
                </div>
            </Modal>

            {/* Guided Tour */}
            <Tour
                tourId="apiary-detail"
                steps={apiaryDetailTour}
                autoStart={false}
            />
        </div>
    );
};

export default ApiaryDashboard;
