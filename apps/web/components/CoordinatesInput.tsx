'use client';

import { useState, useEffect } from 'react';

interface CoordinatesInputProps {
    latitude?: number;
    longitude?: number;
    onChange: (lat: number | undefined, lng: number | undefined) => void;
}

export function CoordinatesInput({ latitude, longitude, onChange }: CoordinatesInputProps) {
    // Keep local string state for input handling (allowing decimals, negatives, etc)
    const [latStr, setLatStr] = useState(latitude?.toString() || '');
    const [lngStr, setLngStr] = useState(longitude?.toString() || '');
    const [error, setError] = useState('');

    useEffect(() => {
        setLatStr(latitude?.toString() || '');
        setLngStr(longitude?.toString() || '');
    }, [latitude, longitude]);

    const handleChange = (newLat: string, newLng: string) => {
        setLatStr(newLat);
        setLngStr(newLng);
        setError('');

        const latNum = parseFloat(newLat);
        const lngNum = parseFloat(newLng);

        if (!newLat || !newLng) {
            onChange(undefined, undefined);
            return;
        }

        if (isNaN(latNum) || latNum < -90 || latNum > 90) {
            setError('Lat: -90 to 90');
            onChange(undefined, undefined);
            return;
        }

        if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
            setError('Lng: -180 to 180');
            onChange(undefined, undefined);
            return;
        }

        onChange(latNum, lngNum);
    };

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="lat" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Latitude</label>
                    <input
                        type="number"
                        id="lat"
                        value={latStr}
                        onChange={(e) => handleChange(e.target.value, lngStr)}
                        placeholder="e.g. 56.26"
                        step="any"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="lng" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Longitude</label>
                    <input
                        type="number"
                        id="lng"
                        value={lngStr}
                        onChange={(e) => handleChange(latStr, e.target.value)}
                        placeholder="e.g. 9.50"
                        step="any"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all text-sm"
                    />
                </div>
            </div>
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    );
}
