import { useState } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { Inspection, Hive } from '@tbh-beekeeper/shared';
import { map } from 'rxjs/operators';
import { database } from '../lib/database';
import { Modal } from './Modal';

const InspectionItemRaw = ({ inspection, onDelete, onEdit, onView }: { inspection: Inspection, onDelete: (inspection: Inspection) => void, onEdit: (inspection: Inspection) => void, onView?: (inspection: Inspection) => void }) => {
    const date = new Date(inspection.timestamp);

    // Helper for status colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'seen': // Direct
            case 'Seen':
            case 'eggs_present': // Evidence (Good)
            case 'Eggs':
            case 'capped_brood':
            case 'Capped': return 'bg-green-100 text-green-800 border-green-200';

            case 'virgin': // Watch (Pink)
            case 'Virgin': return 'bg-pink-100 text-pink-800 border-pink-200';

            case 'no_queen': // BAD (Action)
            case 'NO QUEEN':
            case 'queen_cells': // BAD (Action)
            case 'Q. Cells': return 'bg-red-100 text-red-800 border-red-200 font-bold';

            case 'not_seen': // Neutral/Warning
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
            {/* Actions */}
            <div className="flex gap-1 justify-center px-1 items-center">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(inspection); }}
                    className="text-gray-300 hover:text-amber-500 p-1"
                >
                    ✎
                </button>
            </div>

            {/* Date - Clickable for Details */}
            <div className="px-3 cursor-pointer" onClick={() => (onView ? onView(inspection) : null)}>
                <div className="text-[11px] font-bold text-gray-700 whitespace-nowrap">
                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-[9px] text-gray-400">{date.getFullYear()}</div>
            </div>

            <div className="px-1 flex items-center">
                <span className={`
                    text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-full text-center truncate border
                    ${getStatusColor(inspection.queenStatus)}
                `}>
                    {inspection.queenStatus ? formatValue('Queen', inspection.queenStatus) : 'Unknown'}
                </span>
            </div>

            {/* Columns */}
            <Cell value={inspection.broodPattern} />
            <Cell value={inspection.temperament} />
            <Cell value={inspection.honeyStores} />
            <Cell value={inspection.pollenStores} />

            {/* Observations */}
            <div className="px-2">
                {inspection.observations && (
                    <div className="text-[10px] text-gray-600 italic truncate" title={inspection.observations}>
                        {inspection.observations}
                    </div>
                )}
            </div>

            <div className="flex justify-center px-1">
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(inspection); }}
                    className="text-gray-300 hover:text-red-500 p-1 text-[10px]"
                >
                    ×
                </button>
            </div>


        </div>
    );
};

const InspectionItem = withObservables(['inspection'], ({ inspection }) => ({
    inspection: inspection.observe(),
}))(InspectionItemRaw);

const InspectionListRaw = ({ inspections, onRefresh, onEdit }: { inspections: Inspection[], onRefresh?: () => void, onEdit: (inspection: Inspection) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Inspection | null>(null);

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await itemToDelete.collection.database.write(async () => {
                await itemToDelete.destroyPermanently();
            });
            if (onRefresh) onRefresh();
            setItemToDelete(null);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete inspection');
        }
    };

    const [viewingItem, setViewingItem] = useState<Inspection | null>(null);

    const handleViewDetails = (inspection: Inspection) => {
        setViewingItem(inspection);
    };

    if (!inspections || inspections.length === 0) {
        return <div className="text-center py-4 text-gray-400 text-xs italic">No inspections recorded.</div>;
    }

    const visibleInspections = isExpanded ? inspections : inspections.slice(0, 3);
    const hasMore = inspections.length > 3;

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {/* Header Row */}
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
                        onView={handleViewDetails}
                    />
                ))}

                {hasMore && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full py-1.5 text-[10px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 uppercase tracking-widest border-t border-gray-100 transition-colors"
                    >
                        {isExpanded ? 'Show Less' : `View All (${inspections.length})`}
                    </button>
                )}
            </div>

            <Modal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title="Confirm Delete"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete this inspection? This action cannot be undone.
                    </p>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setItemToDelete(null)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!viewingItem}
                onClose={() => setViewingItem(null)}
                title="Inspection Details"
            >
                {viewingItem && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b pb-2">
                            <div>
                                <div className="text-sm font-bold text-gray-800">
                                    {new Date(viewingItem.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date(viewingItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700">
                                Queen: {viewingItem.queenStatus ? viewingItem.queenStatus.replace(/_/g, ' ') : '?'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-400 block mb-1 uppercase tracking-wider text-[9px]">Conditions</span>
                                <div className="font-medium">
                                    Temp: {viewingItem.temperament || '-'}<br />
                                </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="text-gray-400 block mb-1 uppercase tracking-wider text-[9px]">Resources</span>
                                <div className="font-medium">
                                    Honey: {viewingItem.honeyStores || '-'}<br />
                                    Pollen: {viewingItem.pollenStores || '-'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-3 rounded border border-amber-100">
                            <span className="text-amber-800/60 block mb-1 uppercase tracking-wider text-[9px] font-bold">Observations / Notes</span>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                {viewingItem.observations || <span className="italic text-gray-400">No notes recorded.</span>}
                            </p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setViewingItem(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

const enhance = withObservables(['hive', 'refreshKey'], ({ hive }: { hive: Hive, refreshKey?: number }) => ({
    inspections: hive.inspections.observe().pipe(
        map(inspections => (inspections as Inspection[]).sort((a, b) => {
            const timeDiff = b.timestamp.getTime() - a.timestamp.getTime();
            if (timeDiff !== 0) return timeDiff;
            return b.createdAt.getTime() - a.createdAt.getTime();
        }))
    ),
}));

export const InspectionList = enhance(InspectionListRaw);
