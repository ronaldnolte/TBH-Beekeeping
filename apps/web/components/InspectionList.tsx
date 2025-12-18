'use client';

import { useState, useEffect } from 'react';
import { Inspection, Hive } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { Modal } from './Modal';

const InspectionItem = ({ inspection, onDelete, onEdit, onView }: { inspection: Inspection, onDelete: (inspection: Inspection) => void, onEdit: (inspection: Inspection) => void, onView?: (inspection: Inspection) => void }) => {
    const date = new Date(inspection.timestamp);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'seen':
            case 'Seen':
            case 'eggs_present':
            case 'Eggs':
            case 'capped_brood':
            case 'Capped': return 'bg-green-100 text-green-800 border-green-200';
            case 'virgin':
            case 'Virgin': return 'bg-pink-100 text-pink-800 border-pink-200';
            case 'no_queen':
            case 'NO QUEEN':
            case 'queen_cells':
            case 'Q. Cells': return 'bg-red-100 text-red-800 border-red-200 font-bold';
            case 'not_seen':
            case 'Not Seen': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const formatValue = (key: string, value: string) => {
        if (!value) return '-';
        const mappings: Record<string, string> = {
            'seen': 'Seen',
            'not_seen': 'Not Seen',
            'no_queen': 'NO QUEEN',
            'eggs_present': 'Eggs',
            'capped_brood': 'Capped',
            'queen_cells': 'Q. Cells',
            'virgin': 'Virgin',
            'unknown': '-',
            'excellent': 'Solid',
            'good': 'Good',
            'spotty': 'Spotty',
            'poor': 'Poor',
            'abundant': 'High',
            'adequate': 'Med',
            'low': 'Low',
            'none': 'None',
            'calm': 'Calm',
            'moderate': 'Ok',
            'defensive': 'Def',
            'aggressive': 'Aggr'
        };
        return mappings[value] || value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const Cell = ({ value, className = '' }: { value?: string, className?: string }) => (
        <div className={`flex items-center justify-center px-2 py-1 ${className}`}>
            <span className="text-[11px] font-medium text-gray-700 truncate" title={value}>{value ? formatValue('', value) : '-'}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-[50px_80px_90px_60px_60px_60px_60px_1fr_30px] border-b border-gray-100 hover:bg-gray-50 transition-colors group items-center py-0" onClick={() => onView?.(inspection)}>
            <div className="flex gap-1 justify-center px-1 items-center">
                <button onClick={(e) => { e.stopPropagation(); onEdit(inspection); }} className="text-gray-300 hover:text-amber-500 p-1">✎</button>
            </div>

            <div className="px-3 cursor-pointer" onClick={() => (onView ? onView(inspection) : null)}>
                <div className="text-[11px] font-bold text-gray-700 whitespace-nowrap">
                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-[9px] text-gray-400">{date.getFullYear()}</div>
            </div>

            <div className="px-1 flex items-center">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-full text-center truncate border ${getStatusColor(inspection.queen_status)}`}>
                    {inspection.queen_status ? formatValue('Queen', inspection.queen_status) : 'Unknown'}
                </span>
            </div>

            <Cell value={inspection.brood_pattern} />
            <Cell value={inspection.temperament} />
            <Cell value={inspection.honey_stores} />
            <Cell value={inspection.pollen_stores} />

            <div className="px-2">
                {inspection.observations && (
                    <div className="text-[10px] text-gray-600 italic truncate" title={inspection.observations}>
                        {inspection.observations}
                    </div>
                )}
            </div>

            <div className="flex justify-center px-1">
                <button onClick={(e) => { e.stopPropagation(); onDelete(inspection); }} className="text-gray-300 hover:text-red-500 p-1 text-[10px]">×</button>
            </div>
        </div>
    );
};

export const InspectionList = ({ hive, refreshKey, onRefresh, onEdit }: { hive: Hive, refreshKey?: number, onRefresh?: () => void, onEdit: (inspection: Inspection) => void }) => {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Inspection | null>(null);
    const [viewingItem, setViewingItem] = useState<Inspection | null>(null);

    const fetchInspections = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('inspections')
            .select('*')
            .eq('hive_id', hive.id)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching inspections:', error);
        } else {
            setInspections(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchInspections();
    }, [hive.id, refreshKey]);

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const { error } = await supabase.from('inspections').delete().eq('id', itemToDelete.id);
            if (error) throw error;
            setItemToDelete(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete inspection');
        }
    };

    const visibleInspections = isExpanded ? inspections : inspections.slice(0, 3);

    if (isLoading && inspections.length === 0) return <div className="text-center py-4 text-xs text-gray-400">Loading...</div>;
    if (!inspections || inspections.length === 0) return <div className="text-center py-4 text-gray-400 text-xs italic">No inspections recorded.</div>;

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-[50px_80px_90px_60px_60px_60px_60px_1fr_30px] bg-gray-50 border-b border-gray-200 py-1.5 items-center">
                    <div></div>
                    <div className="px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Date</div>
                    <div className="px-1 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Queen</div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Brood</div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Tmp</div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Hon</div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pol</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Observations</div>
                    <div></div>
                </div>

                {visibleInspections.map(inspection => (
                    <InspectionItem
                        key={inspection.id}
                        inspection={inspection}
                        onDelete={setItemToDelete}
                        onEdit={onEdit}
                        onView={setViewingItem}
                    />
                ))}

                {inspections.length > 3 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full py-1.5 text-[10px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 uppercase tracking-widest border-t border-gray-100 transition-colors"
                    >
                        {isExpanded ? 'Show Less' : `View All (${inspections.length})`}
                    </button>
                )}
            </div>

            <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Confirm Delete">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Are you sure you want to delete this inspection?</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setItemToDelete(null)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
                        <button onClick={confirmDelete} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded">Delete</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title="Inspection Details">
                {viewingItem && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b pb-2">
                            <div>
                                <div className="text-sm font-bold text-gray-800">{new Date(viewingItem.timestamp).toLocaleDateString()}</div>
                            </div>
                            <div className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700">
                                Queen: {viewingItem.queen_status}
                            </div>
                        </div>
                        <div className="bg-amber-50 p-3 rounded border border-amber-100">
                            <span className="text-amber-800/60 block mb-1 uppercase tracking-wider text-[9px] font-bold">Observations</span>
                            <p className="text-sm text-gray-800">{viewingItem.observations || 'No notes.'}</p>
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
