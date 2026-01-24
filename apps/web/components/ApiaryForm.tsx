'use client';

import { useState } from 'react';
import { Apiary, LocationUtils } from '@tbh-beekeeper/shared';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { supabase } from '../lib/supabase';
import { LocationInput } from './LocationInput';

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
    // Normalize initial zip (e.g. "90210" -> "us:90210") so it correctly saves in new format even if untouched
    const [zipCode, setZipCode] = useState(() => {
        if (!initialData?.zip_code) return '';
        const parsed = LocationUtils.parse(initialData.zip_code);
        return LocationUtils.format(parsed.country, parsed.code);
    });
    // Support lat/long if present in model
    const [latitude, setLatitude] = useState<number | undefined>(initialData?.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(initialData?.longitude);

    const [notes, setNotes] = useState(initialData?.notes || '');
    const [isSaving, setIsSaving] = useState(false);
    const { userId } = useCurrentUser();

    const handleLocationChange = (newZip: string, newLat?: number, newLng?: number) => {
        setZipCode(newZip);
        setLatitude(newLat);
        setLongitude(newLng);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Validation: Need either zip or coords
        if (!zipCode && (!latitude || !longitude)) {
            alert('Please provide a location (Postal Code or Coordinates)');
            setIsSaving(false);
            return;
        }

        try {
            const apiaryData = {
                name,
                zip_code: zipCode,
                latitude: latitude || null,
                longitude: longitude || null,
                notes,
            };

            if (initialData) {
                const { error } = await supabase
                    .from('apiaries')
                    .update({
                        ...apiaryData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('apiaries')
                    .insert({
                        ...apiaryData,
                        user_id: userId
                    });

                if (error) throw error;
            }
            onSuccess();
        } catch (error: any) {
            console.error('Failed to save apiary:', error);
            alert('Failed to save apiary: ' + error.message);
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-gray-400 text-xs font-normal">(for weather)</span></label>
                <LocationInput
                    zipCode={zipCode}
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={handleLocationChange}
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

