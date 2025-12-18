import React, { useState } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../lib/database';
import { Apiary, Hive } from '@tbh-beekeeper/shared';
import { Modal } from './Modal';

interface MoveHiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    hive: Hive;
    currentApiaryId: string;
    apiaries: Apiary[];
}

const MoveHiveModalRaw = ({ isOpen, onClose, hive, currentApiaryId, apiaries }: MoveHiveModalProps) => {
    const [selectedApiaryId, setSelectedApiaryId] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Filter out current apiary
    const availableApiaries = apiaries.filter(a => a.id !== currentApiaryId && !a._isDeleted);

    const handleMove = async () => {
        if (!selectedApiaryId) return;

        setIsSaving(true);
        try {
            await database.write(async () => {
                await hive.update(h => {
                    h.apiaryId = selectedApiaryId;
                });
            });
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

                {availableApiaries.length > 0 ? (
                    <div className="space-y-2">
                        <select
                            value={selectedApiaryId}
                            onChange={e => setSelectedApiaryId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">-- Select Apiary --</option>
                            {availableApiaries.map(apiary => (
                                <option key={apiary.id} value={apiary.id}>
                                    {apiary.name} ({apiary.zipCode})
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

export const MoveHiveModal = withObservables([], () => ({
    apiaries: database.collections.get<Apiary>('apiaries').query()
}))(MoveHiveModalRaw);
