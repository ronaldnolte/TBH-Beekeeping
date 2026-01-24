'use client';

import { useState, useEffect } from 'react';
import { LocationUtils } from '@tbh-beekeeper/shared';
import { CoordinatesInput } from './CoordinatesInput';

interface LocationInputProps {
    zipCode: string;
    latitude?: number;
    longitude?: number;
    onLocationChange: (zip: string, lat?: number, lng?: number) => void;
}

const COUNTRIES = [
    { code: 'us', name: 'United States', flag: '🇺🇸', regex: /^\d{5}$/, placeholder: 'Zip Code (e.g. 80304)' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', regex: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, placeholder: 'Postcode (e.g. SW1A 1AA)' },
    { code: 'be', name: 'Belgium', flag: '🇧🇪', regex: /^\d{4}$/, placeholder: 'Code Postal (e.g. 1000)' },
    { code: 'de', name: 'Germany', flag: '🇩🇪', regex: /^\d{5}$/, placeholder: 'PLZ (e.g. 10115)' },
    { code: 'dk', name: 'Denmark', flag: '🇩🇰', regex: /^\d{4}$/, placeholder: 'Postnummer (e.g. 1050)' },
    { code: 'fr', name: 'France', flag: '🇫🇷', regex: /^\d{5}$/, placeholder: 'Code Postal (e.g. 75001)' },
    { code: 'es', name: 'Spain', flag: '🇪🇸', regex: /^\d{5}$/, placeholder: 'Código Postal (e.g. 28001)' },
    { code: 'it', name: 'Italy', flag: '🇮🇹', regex: /^\d{5}$/, placeholder: 'CAP (e.g. 00100)' },
    { code: 'nl', name: 'Netherlands', flag: '🇳🇱', regex: /^\d{4}\s?[A-Z]{2}$/i, placeholder: 'Postcode (e.g. 1012 JS)' },
    { code: 'au', name: 'Australia', flag: '🇦🇺', regex: /^\d{4}$/, placeholder: 'Postcode (e.g. 2000)' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦', regex: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i, placeholder: 'Postal Code (e.g. K1A 0B1)' },
];

export function LocationInput({ zipCode, latitude, longitude, onLocationChange }: LocationInputProps) {
    // Determine initial tab based on presence of coordinates
    const [activeTab, setActiveTab] = useState<'zip' | 'coords'>((latitude && longitude) ? 'coords' : 'zip');

    // Internal State for Country/Zip
    const parsed = LocationUtils.parse(zipCode);
    const [countryCode, setCountryCode] = useState(parsed.country);
    const [localZip, setLocalZip] = useState(parsed.code);

    const currentCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

    // Effect: Update internal state if props change externally
    useEffect(() => {
        const p = LocationUtils.parse(zipCode);
        setCountryCode(p.country);
        setLocalZip(p.code);
    }, [zipCode]);

    const handleCountryChange = (newCountry: string) => {
        setCountryCode(newCountry);
        // Clean zip if format is wildly different? Or keep it? keeping is safer.
        const formatted = LocationUtils.format(newCountry, localZip);
        onLocationChange(formatted, undefined, undefined);
    };

    const handleZipChange = (newZip: string) => {
        setLocalZip(newZip);
        // We validate visually, but allow saving partials? 
        // Or should we only update parent on valid? 
        // For forms, usually better to update parent and let form validation handle submit.
        const formatted = LocationUtils.format(countryCode, newZip);
        onLocationChange(formatted, undefined, undefined);
    };

    const handleCoordsChange = (lat: number | undefined, lng: number | undefined) => {
        if (lat && lng) {
            onLocationChange('', lat, lng); // Clear zip if using coords
        } else {
            // If clearing coords, do we restore zip? Maybe not.
        }
    };

    const handleTabChange = (tab: 'zip' | 'coords') => {
        setActiveTab(tab);
        // Optional: clear the other type of data?
        // Let's decide: switching tabs just changes VIEW, but doesn't clear until input.
        // Actually, safer to clear to avoid ambiguity.
        if (tab === 'zip') {
            const formatted = LocationUtils.format(countryCode, localZip);
            onLocationChange(formatted, undefined, undefined);
        } else {
            onLocationChange('', latitude, longitude);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                    type="button"
                    onClick={() => handleTabChange('zip')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'zip'
                        ? 'text-[#E67E22] border-b-2 border-[#E67E22] bg-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Postal Code
                </button>
                <button
                    type="button"
                    onClick={() => handleTabChange('coords')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'coords'
                        ? 'text-[#E67E22] border-b-2 border-[#E67E22] bg-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Coordinates
                </button>
            </div>

            <div className="p-4">
                {activeTab === 'zip' ? (
                    <div className="space-y-3">
                        {/* Country Selector */}
                        <div>
                            <label htmlFor="country" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Country</label>
                            <div className="relative">
                                <select
                                    id="country"
                                    value={countryCode}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all appearance-none bg-white text-sm pr-8"
                                >
                                    {COUNTRIES.map(c => (
                                        <option key={c.code} value={c.code}>
                                            {c.flag} {c.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500 text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="zipInput" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Postal Code</label>
                            <input
                                type="text"
                                id="zipInput"
                                value={localZip}
                                onChange={(e) => handleZipChange(e.target.value)}
                                placeholder={currentCountry.placeholder}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all text-sm tracking-wide"
                            />
                        </div>
                        {!currentCountry.regex.test(localZip) && localZip.length > 0 && (
                            <p className="text-amber-500 text-xs text-right">Format: {currentCountry.placeholder}</p>
                        )}
                    </div>
                ) : (
                    <CoordinatesInput
                        latitude={latitude}
                        longitude={longitude}
                        onChange={handleCoordsChange}
                    />
                )}
            </div>
        </div>
    );
}
