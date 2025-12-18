'use client';

// Refactored to remove WatermelonDB. This Modal now needs to accept callbacks or use Supabase directly.
// Given it was wrapped with observables, we will refactor it to use Supabase fetching.

import React, { useState, useEffect } from 'react';
import { Apiary, Hive } from '@tbh-beekeeper/shared';
import { Modal } from './Modal';
import { supabase } from '../lib/supabase';

interface MoveHiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    hive: Hive;
    currentApiaryId: string;
}

export const MoveHiveModal = ({ isOpen, onClose, hive, currentApiaryId }: MoveHiveModalProps) => {
    const [selectedApiaryId, setSelectedApiaryId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [apiaries, setApiaries] = useState<Apiary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchApiaries = async () => {
                setLoading(true);
                const { data } = await supabase.from('apiaries').select('*').eq('is_active', true);
                setApiaries((data || []) as unknown as Apiary[]); // Type assertion for now due to snake_case mismatches if any
                setLoading(false);
            };
            fetchApiaries();
        }
    }, [isOpen]);

    // Filter out current apiary
    const availableApiaries = apiaries.filter(a => a.id !== currentApiaryId);

    const handleMove = async () => {
        if (!selectedApiaryId) return;

        setIsSaving(true);
        try {
            await supabase.from('hives').update({ apiary_id: selectedApiaryId }).eq('id', hive.id);
            onClose();
        } catch (error) {
            console.error('Failed to move hive:', error);
            alert('Failed to move hive. See console.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Move "${hive.name}"`}>
            <div className="space-y-4">
                <p className="text-gray-600">Select the destination apiary for this hive.</p>

                {loading ? (
                    <div className="text-center py-4">Loading apiaries...</div>
                ) : availableApiaries.length > 0 ? (
                    <div className="space-y-2">
                        <select
                            value={selectedApiaryId}
                            onChange={e => setSelectedApiaryId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">-- Select Apiary --</option>
                            {availableApiaries.map(apiary => (
                                <option key={apiary.id} value={apiary.id}>
                                    {apiary.name} ({apiary.zip_code})
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMove}
                                disabled={!selectedApiaryId || isSaving}
                                className="px-4 py-2 bg-[#E67E22] text-white rounded font-bold hover:bg-[#D35400] disabled:opacity-50"
                            >
                                {isSaving ? 'Moving...' : 'Move Hive'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-red-500 mb-2">No other apiaries available.</p>
                        <p className="text-sm text-gray-500">Create another apiary first correctly move a hive.</p>
                        <button
                            onClick={onClose}
                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
