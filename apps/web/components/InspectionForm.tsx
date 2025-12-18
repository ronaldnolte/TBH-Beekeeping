import { useState } from 'react';
import { Inspection, QueenStatus, BroodPattern, Temperament, StoreLevel } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';

const QUEEN_STATUS_OPTIONS: { value: QueenStatus; label: string }[] = [
    { value: 'seen', label: 'Seen' },
    { value: 'eggs_present', label: 'Eggs' },
    { value: 'capped_brood', label: 'Capped' },
    { value: 'virgin', label: 'Virgin' },
    { value: 'no_queen', label: 'NO QUEEN' },
    { value: 'queen_cells', label: 'Q. Cells' },
];

const BROOD_PATTERN_OPTIONS: { value: BroodPattern; label: string }[] = [
    { value: 'excellent', label: 'Solid' },
    { value: 'good', label: 'Good' },
    { value: 'spotty', label: 'Spotty' },
    { value: 'poor', label: 'Poor' },
];

const TEMPERAMENT_OPTIONS: { value: Temperament; label: string }[] = [
    { value: 'calm', label: 'Calm' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'defensive', label: 'Defensive' },
    { value: 'aggressive', label: 'Aggressive' },
];

const STORES_OPTIONS: { value: StoreLevel; label: string }[] = [
    { value: 'abundant', label: 'Abundant' },
    { value: 'adequate', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'none', label: 'None' },
];

const SelectPills = ({
    label,
    options,
    value,
    onChange
}: {
    label: string,
    options: { value: string; label: string }[],
    value: string,
    onChange: (val: string) => void
}) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <div className="flex flex-wrap gap-2">
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`
                        px-2 py-1 text-xs rounded border transition-colors
                        ${value === opt.value
                            ? 'bg-amber-100 border-amber-500 text-amber-800 font-medium'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }
                    `}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

export const InspectionForm = ({ hiveId, initialData, onSuccess, onCancel }: { hiveId: string, initialData?: Inspection, onSuccess: () => void, onCancel: () => void }) => {
    const [date, setDate] = useState(() => {
        const d = initialData ? new Date(initialData.timestamp) : new Date();
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    });
    const [queenStatus, setQueenStatus] = useState<QueenStatus>(initialData?.queen_status || 'unknown');
    const [broodPattern, setBroodPattern] = useState<BroodPattern>(initialData?.brood_pattern || 'good');
    const [temperament, setTemperament] = useState<Temperament>(initialData?.temperament || 'moderate');
    const [honeyStores, setHoneyStores] = useState<StoreLevel>(initialData?.honey_stores || 'adequate');
    const [pollenStores, setPollenStores] = useState<StoreLevel>(initialData?.pollen_stores || 'adequate');
    const [observations, setObservations] = useState(initialData?.observations || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!date) return alert('Please key in a date');
        setIsSaving(true);
        try {
            const payload = {
                hive_id: hiveId,
                timestamp: new Date(date).toISOString(),
                queen_status: queenStatus,
                brood_pattern: broodPattern,
                temperament: temperament,
                honey_stores: honeyStores,
                pollen_stores: pollenStores,
                observations: observations
            };

            if (initialData) {
                const { error } = await supabase
                    .from('inspections')
                    .update(payload)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('inspections')
                    .insert(payload);
                if (error) throw error;
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save inspection:', error);
            alert('Error saving inspection');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <SelectPills
                label="Queen Status"
                options={QUEEN_STATUS_OPTIONS}
                value={queenStatus}
                onChange={(val) => setQueenStatus(val as QueenStatus)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectPills
                    label="Brood Pattern"
                    options={BROOD_PATTERN_OPTIONS}
                    value={broodPattern}
                    onChange={(val) => setBroodPattern(val as BroodPattern)}
                />
                <SelectPills
                    label="Temperament"
                    options={TEMPERAMENT_OPTIONS}
                    value={temperament}
                    onChange={(val) => setTemperament(val as Temperament)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectPills
                    label="Honey Stores"
                    options={STORES_OPTIONS}
                    value={honeyStores}
                    onChange={(val) => setHoneyStores(val as StoreLevel)}
                />
                <SelectPills
                    label="Pollen Stores"
                    options={STORES_OPTIONS}
                    value={pollenStores}
                    onChange={(val) => setPollenStores(val as StoreLevel)}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Observations</label>
                <textarea
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Notes..."
                />
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                    {isSaving ? 'Saving...' : 'Save Inspection'}
                </button>
            </div>
        </div>
    );
};
