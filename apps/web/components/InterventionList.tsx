'use client';

import { useState, useEffect } from 'react';
import { Intervention, Hive } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { Modal } from './Modal';

const InterventionItem = ({ intervention, onDelete, onEdit, onView }: { intervention: Intervention, onDelete: (intervention: Intervention) => void, onEdit: (intervention: Intervention) => void, onView?: (intervention: Intervention) => void }) => {
    const date = new Date(intervention.timestamp);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'feeding': return 'bg-yellow-100 text-yellow-700';
            case 'treatment': return 'bg-red-100 text-red-700';
            case 'manipulation': return 'bg-blue-100 text-blue-700';
            case 'cross_comb_fix': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="grid grid-cols-[60px_80px_130px_1fr] border-b border-gray-100 hover:bg-gray-50 transition-colors group items-center py-0" onClick={() => onView?.(intervention)}>
            <div className="flex gap-1 justify-center px-1 items-center">
                <button onClick={(e) => { e.stopPropagation(); onEdit(intervention); }} className="text-gray-300 hover:text-amber-500 p-1">✎</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(intervention); }} className="text-gray-300 hover:text-red-500 p-1">×</button>
            </div>
            <div className="px-3">
                <div className="text-[11px] font-bold text-gray-700 whitespace-nowrap">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                <div className="text-[9px] text-gray-400">{date.getFullYear()}</div>
            </div>
            <div className="px-2 flex items-center">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-full text-center truncate ${getTypeColor(intervention.type)}`}>
                    {intervention.type.replace(/_/g, ' ')}
                </span>
            </div>
            <div className="px-2 min-w-0">
                <div className="text-[11px] text-gray-600 truncate" title={intervention.description}>{intervention.description || '-'}</div>
            </div>
        </div>
    );
};

export const InterventionList = ({ hive, refreshKey, onRefresh, onEdit }: { hive: Hive, refreshKey?: number, onRefresh?: () => void, onEdit: (intervention: Intervention) => void }) => {
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Intervention | null>(null);
    const [viewingItem, setViewingItem] = useState<Intervention | null>(null);

    const fetchInterventions = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('interventions')
            .select('*')
            .eq('hive_id', hive.id)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching interventions:', error);
        } else {
            setInterventions(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchInterventions();
    }, [hive.id, refreshKey]);

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const { error } = await supabase.from('interventions').delete().eq('id', itemToDelete.id);
            if (error) throw error;
            setItemToDelete(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete intervention');
        }
    };

    const visibleInterventions = isExpanded ? interventions : interventions.slice(0, 3);

    if (isLoading && interventions.length === 0) return <div className="text-center py-4 text-xs text-gray-400">Loading...</div>;
    if (interventions.length === 0) return <div className="text-center py-4 text-gray-400 text-xs italic">No interventions recorded.</div>;

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-[60px_80px_130px_1fr] bg-gray-50 border-b border-gray-200 py-1.5 items-center">
                    <div></div>
                    <div className="px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Date</div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Type</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Description</div>
                </div>

                {visibleInterventions.map(intervention => (
                    <InterventionItem
                        key={intervention.id}
                        intervention={intervention}
                        onDelete={setItemToDelete}
                        onEdit={onEdit}
                        onView={setViewingItem}
                    />
                ))}

                {interventions.length > 3 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full py-1.5 text-[10px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 uppercase tracking-widest border-t border-gray-100 transition-colors"
                    >
                        {isExpanded ? 'Show Less' : `View All (${interventions.length})`}
                    </button>
                )}
            </div>

            <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Confirm Delete">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Are you sure you want to delete this intervention?</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setItemToDelete(null)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
                        <button onClick={confirmDelete} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded">Delete</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title="Intervention Details">
                {viewingItem && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b pb-2">
                            <div>
                                <div className="text-sm font-bold text-gray-800">{new Date(viewingItem.timestamp).toLocaleDateString()}</div>
                            </div>
                            <div className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700 uppercase">
                                {viewingItem.type.replace(/_/g, ' ')}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border border-gray-100">
                            <span className="text-gray-500 block mb-1 uppercase tracking-wider text-[9px] font-bold">Details</span>
                            <p className="text-sm text-gray-800">{viewingItem.description || 'No description.'}</p>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button onClick={() => setViewingItem(null)} className="px-4 py-2 bg-gray-100 rounded text-xs">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
