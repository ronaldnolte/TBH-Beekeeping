'use client';

import { useState, useEffect } from 'react';
import { WeatherService, InspectionWindow, LocationUtils } from '@tbh-beekeeper/shared';
import { ScoringHelpModal } from './ScoringHelpModal';
import { DiagnosticTable } from './DiagnosticTable';

interface ForecastGridProps {
    apiaryId: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
}

export function ForecastGrid({ apiaryId, zipCode, latitude, longitude }: ForecastGridProps) {
    const [timezone, setTimezone] = useState<string>('UTC');
    const [windows, setWindows] = useState<InspectionWindow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWindow, setSelectedWindow] = useState<InspectionWindow | null>(null);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [resolvedCoords, setResolvedCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Determine Locale
    const { country } = LocationUtils.parse(zipCode);
    const isUS = country === 'us';
    const isMetric = !isUS;
    const is24h = !isUS;

    useEffect(() => {
        const fetchForecast = async () => {
            setLoading(true);
            setError(null);
            try {
                let lat = latitude;
                let lng = longitude;

                // Fetch coords if missing
                if (!lat || !lng) {
                    const { country, code } = LocationUtils.parse(zipCode);
                    const coords = await WeatherService.getCoordinates(code, country);
                    lat = coords.lat;
                    lng = coords.lng;
                }

                if (lat && lng) {
                    setResolvedCoords({ lat, lng });
                }

                // Fetch weather
                const data = await WeatherService.getWeatherForecast(lat, lng, undefined, country);

                // Store timezone from API
                if (data.timezone) {
                    setTimezone(data.timezone);
                }

                const forecast = WeatherService.calculateForecast(data, true, isMetric);
                setWindows(forecast);
            } catch (err: any) {
                console.error('Forecast error:', err);
                setError(err.message || 'Failed to load forecast');
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [apiaryId, zipCode, latitude, longitude, isMetric]);

    // Group windows by date
    const gridData: Record<string, Record<number, InspectionWindow>> = {};
    const uniqueDates = new Set<string>();

    windows.forEach(w => {
        // Use pre-calculated displayDate (YYYY-MM-DD) which is already in Apiary's local time
        const dateStr = w.displayDate;

        uniqueDates.add(dateStr);
        if (!gridData[dateStr]) gridData[dateStr] = {};
        gridData[dateStr][w.displayHour] = w;
    });

    const sortedDates = Array.from(uniqueDates).sort();

    // Additional safety filter to remove dates before today
    // Compare date strings directly (YYYY-MM-DD format)
    const now = new Date();
    // Use location/API timezone so columns reflect the apiary's local day
    const locationToday = now.toLocaleDateString('en-CA', { timeZone: timezone });
    const filteredDates = sortedDates.filter(dateStr => dateStr >= locationToday);

    const timeSlots = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    // Helper to format temperature
    const formatTemp = (tempF: number) => {
        if (isMetric) {
            const tempC = (tempF - 32) * 5 / 9;
            return `${Math.round(tempC)}°C`;
        }
        return `${Math.round(tempF)}°F`;
    };

    // Helper to format wind speed
    const formatSpeed = (mph: number) => {
        if (isMetric) {
            return `${Math.round(mph * 1.60934)}km/h`;
        }
        return `${Math.round(mph)}mph`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'bg-green-700';
        if (score >= 70) return 'bg-green-500';
        if (score >= 55) return 'bg-amber-400';
        if (score >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };


    const formatTimeSlot = (hour: number) => {
        if (is24h) {
            return `${hour.toString().padStart(2, '0')}:00`;
        }
        // 12h format — single hour labels
        if (hour === 0 || hour === 24) return '12am';
        if (hour === 12) return '12pm';
        if (hour < 12) return `${hour}am`;
        return `${hour - 12}pm`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FFFBF0]">
                <div className="text-center">
                    <div className="animate-pulse text-4xl mb-4">🐝</div>
                    <div className="text-[#8B4513] font-bold">Loading Forecast...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FFFBF0]">
                <div className="text-center text-red-600">
                    <div className="text-2xl mb-2">⚠️</div>
                    <div className="font-bold">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF0] px-3 pt-2 pb-4">
            {/* Legend + Help — single compact row */}
            <div className="mb-2">
                <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center text-[10px] mb-1">
                    <LegendItem label="Excellent 85+" color="bg-green-700" />
                    <LegendItem label="Good 70-84" color="bg-green-500" />
                    <LegendItem label="Fair 55-69" color="bg-amber-400" />
                    <LegendItem label="Poor 40-54" color="bg-orange-500" />
                    <LegendItem label="Not Rec <40" color="bg-red-500" />
                </div>
                <div className="flex items-center justify-center gap-3">
                    <span className="text-[10px] text-gray-400 italic">Tap a score for details</span>
                    <button
                        onClick={() => setShowHelpModal(true)}
                        className="text-[10px] text-amber-600 hover:text-amber-700 font-bold underline decoration-dotted underline-offset-2 transition-colors"
                    >
                        How are scores calculated?
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex justify-center">
                <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-300 bg-white text-[11px]">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-2 py-1 font-bold sticky left-0 bg-gray-100 z-10 text-[10px]">Time</th>
                                {filteredDates.map(dateStr => {
                                    const date = new Date(dateStr + 'T12:00:00');
                                    return (
                                        <th key={dateStr} className="border border-gray-300 px-1 py-1 min-w-[48px]">
                                            <div className="font-bold text-[11px]">{date.toLocaleDateString(isUS ? 'en-US' : 'en-GB', { weekday: 'short' })}</div>
                                            <div className="text-[9px] text-gray-500">{date.toLocaleDateString(isUS ? 'en-US' : 'en-GB', { month: 'numeric', day: 'numeric' })}</div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(hour => (
                                <tr key={hour}>
                                    <td className="border border-gray-300 px-1.5 py-0 font-bold sticky left-0 bg-white z-10 text-[10px] whitespace-nowrap">
                                        {formatTimeSlot(hour)}
                                    </td>
                                    {filteredDates.map(dateStr => {
                                        const window = gridData[dateStr]?.[hour];
                                        if (!window) {
                                            return <td key={dateStr} className="border border-gray-300 bg-gray-100 h-7 w-12"></td>;
                                        }

                                        const isFail = window.score < 40 || window.issues.length > 0;
                                        const textColor = isFail ? 'text-black' : 'text-white';

                                        return (
                                            <td
                                                key={dateStr}
                                                className={`border border-gray-300 h-7 w-12 cursor-pointer ${getScoreColor(window.score)}`}
                                                onClick={() => setSelectedWindow(window)}
                                            >
                                                <div className={`flex items-center justify-center h-full font-bold text-sm ${textColor}`}>
                                                    {Math.round(window.score)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footnote and standalone link */}
            <div className="text-center mt-2">
                <div className="text-[10px] text-gray-500 italic mb-1">
                    White numerals = OK to inspect · Black numerals = Not recommended
                </div>
                <a
                    href="https://forecast.beektools.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-[#8B4513] hover:text-[#6B3410] transition-colors bg-amber-100/50 px-3 py-1 rounded-full border border-amber-200 shadow-sm"
                >
                    Get Standalone Forecast App →
                </a>
            </div>

            {/* Detail Modal */}
            {selectedWindow && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setSelectedWindow(null)}>
                    <div className="flex flex-col lg:flex-row gap-6 items-start max-w-6xl w-full">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-[#8B4513]">Inspection Conditions</h3>
                                    <p className="text-sm text-gray-600">
                                        {/* Use displayDate for safer formatting */}
                                        {new Date(selectedWindow.displayDate + 'T12:00:00').toLocaleDateString(isUS ? 'en-US' : 'en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className="text-sm font-medium">{formatTimeSlot(selectedWindow.displayHour)}</p>
                                </div>
                                <button onClick={() => setSelectedWindow(null)} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
                            </div>

                            {/* Score Banner */}
                            <div className={`${getScoreColor(selectedWindow.score)} rounded-lg p-6 text-center mb-3`}>
                                <div className="text-5xl font-bold text-white">{Math.round(selectedWindow.score)}</div>
                                <div className="text-white font-medium">Overall Score</div>
                            </div>
                            <button
                                onClick={() => { setSelectedWindow(null); setShowHelpModal(true); }}
                                className="w-full text-center text-xs text-amber-600 hover:text-amber-700 font-medium underline decoration-dotted underline-offset-4 mb-4"
                            >
                                How are these scores calculated?
                            </button>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <StatCard
                                    label="Temperature"
                                    value={formatTemp(selectedWindow.tempF)}
                                    score={selectedWindow.scoreBreakdown['Temperature']}
                                    maxScore={40}
                                />
                                <StatCard
                                    label="Cloud"
                                    value={`${Math.round(selectedWindow.cloudCover)}%`}
                                    score={selectedWindow.scoreBreakdown['Cloud Cover']}
                                    maxScore={20}
                                />
                                <StatCard
                                    label="Wind"
                                    value={formatSpeed(selectedWindow.windMph)}
                                    score={selectedWindow.scoreBreakdown['Wind Speed']}
                                    maxScore={20}
                                />
                                <StatCard
                                    label="Precip"
                                    value={`${Math.round(selectedWindow.precipProb)}%`}
                                    score={selectedWindow.scoreBreakdown['Precipitation']}
                                    maxScore={15}
                                />
                                <StatCard
                                    label="Humidity"
                                    value={`${Math.round(selectedWindow.humidity)}%`}
                                    score={selectedWindow.scoreBreakdown['Humidity']}
                                    maxScore={5}
                                />
                            </div>


                            <div className="space-y-4">
                                {/* Issues */}
                                {selectedWindow.issues.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-red-600 mb-2">Issues:</h4>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            {selectedWindow.issues.map((issue, i) => (
                                                <li key={i}>• {issue}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Good Conditions */}
                                {(() => {
                                    const good = [];
                                    if (selectedWindow.windMph <= 10) good.push(`Light winds (${formatSpeed(selectedWindow.windMph)})`);
                                    if (selectedWindow.cloudCover <= 20) good.push(`Sunny (${Math.round(selectedWindow.cloudCover)}% clouds)`);
                                    if (selectedWindow.precipProb === 0) good.push("No rain expected");
                                    if (selectedWindow.tempF >= 60 && selectedWindow.tempF <= 90) good.push(`Good temperature (${formatTemp(selectedWindow.tempF)})`);
                                    if (selectedWindow.humidity >= 30 && selectedWindow.humidity <= 70) good.push("Ideal humidity");

                                    if (good.length > 0) {
                                        return (
                                            <div>
                                                <h4 className="font-bold text-green-600 mb-2">Good Conditions:</h4>
                                                <ul className="text-sm text-gray-700 space-y-1">
                                                    {good.map((item, i) => (
                                                        <li key={i}>• {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>

                        {/* Diagnostic Table - gated by zip 87121 */}
                        {resolvedCoords && LocationUtils.parse(zipCode).code === '87121' && (
                            <div className="hidden lg:block bg-white rounded-xl shadow-2xl w-full max-w-xl p-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                <DiagnosticTable
                                    appWindow={selectedWindow}
                                    lat={resolvedCoords.lat}
                                    lng={resolvedCoords.lng}
                                    targetDate={selectedWindow.displayDate}
                                    targetHour={selectedWindow.displayHour}
                                    autoOpen
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Scoring Help Modal */}
            <ScoringHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
        </div>
    );
}

function LegendItem({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-gray-700">{label}</span>
        </div>
    );
}

function StatCard({ label, value, score, maxScore }: { label: string; value: string; score?: number; maxScore?: number }) {
    // Determine status (Red border if score is low, e.g., < 50%)
    const isLow = (score !== undefined && maxScore !== undefined) && (score <= (maxScore / 2));

    return (
        <div className={`bg-gray-50 rounded p-3 ${isLow ? 'border-2 border-red-500' : ''}`}>
            <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
            <div className="text-sm text-gray-700 mb-2">{value}</div>

            {(score !== undefined && maxScore !== undefined) && (
                <div className="text-xl font-bold text-black">
                    {score}/{maxScore}
                </div>
            )}
        </div>
    );
}
