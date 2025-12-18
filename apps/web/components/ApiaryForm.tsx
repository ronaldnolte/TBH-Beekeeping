'use client';

import { useState } from 'react';
import { database } from '../lib/database';
import { Apiary } from '@tbh-beekeeper/shared';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function ApiaryForm({
    initialData,
    onSuccess,
    onCancel
}: {
    initialData?: Apiary,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const [name, setName] = useState(initialData?.name || '');
    const [zipCode, setZipCode] = useState(initialData?.zipCode || '');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [isSaving, setIsSaving] = useState(false);
    const { userId } = useCurrentUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await database.write(async () => {
                const apiariesCollection = database.collections.get<Apiary>('apiaries');

                if (initialData) {
                    await initialData.update(record => {
                        record.name = name;
                        record.zipCode = zipCode;
                        record.notes = notes;
                    });
                } else {
                    await apiariesCollection.create(record => {
                        record.name = name;
                        record.zipCode = zipCode;
                        record.notes = notes;
                        // @ts-ignore
                        record.userId = userId;
                        // Explicitly set dates to ensure sorting works immediately
                        // @ts-ignore
                        record._raw.created_at = Date.now();
                        // @ts-ignore
                        record._raw.updated_at = Date.now();
                    });
                }
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to save apiary:', error);
            alert('Failed to save apiary');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apiary Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Home Yard"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code <span className="text-gray-400 text-xs font-normal">(for weather)</span></label>
                <input
                    type="text"
                    required
                    pattern="[0-9]{5}"
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 90210"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400 text-xs font-normal">(optional)</span></label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all h-20 resize-none"
                    placeholder="Location details, access instructions..."
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#E67E22] text-white rounded-lg font-bold hover:bg-[#D35400] transition-colors disabled:opacity-50"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : (initialData ? 'Update Apiary' : 'Create Apiary')}
                </button>
            </div>
        </form>
    );
}
