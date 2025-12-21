'use client';

import { useState } from 'react';
import { Intervention, InterventionType } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';

const INTERVENTION_TYPES: { value: InterventionType; label: string }[] = [
    { value: 'feeding', label: 'Feeding' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'manipulation', label: 'Manipulation' },
    { value: 'cross_comb_fix', label: 'Cross Comb Fix' },
    { value: 'other', label: 'Other' },
];

export function InterventionForm({ hiveId, initialData, onSuccess, onCancel }: { hiveId: string, initialData?: Intervention, onSuccess: () => void, onCancel: () => void }) {
    const [type, setType] = useState<InterventionType>(initialData?.type || 'feeding');
    const [date, setDate] = useState<string>(() => {
        const d = initialData ? new Date(initialData.timestamp) : new Date();
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    });
    const [description, setDescription] = useState(initialData?.description || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                hive_id: hiveId,
                type: type,
                timestamp: new Date(date + 'T12:00:00').toISOString(),
                description: description
            };

            if (initialData) {
                const { error } = await supabase
                    .from('interventions')
                    .update(payload)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('interventions')
                    .insert(payload);
                if (error) throw error;
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to create/update intervention:', error);
            alert('Failed to save intervention');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                    {INTERVENTION_TYPES.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setType(t.value)}
                            className={`px-3 py-2 text-sm rounded-md border text-left transition-colors ${type === t.value
                                ? 'bg-[#F5A623] border-[#F5A623] text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details about the intervention..."
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-sm"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[#F5A623] text-white rounded-md text-sm font-medium hover:bg-[#E09612] disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Intervention'}
                </button>
            </div>
        </form>
    );
}
