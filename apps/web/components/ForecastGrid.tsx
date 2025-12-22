'use client';

import { useState, useEffect } from 'react';
import { WeatherService, InspectionWindow } from '@tbh-beekeeper/shared';

interface ForecastGridProps {
    apiaryId: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
}

export function ForecastGrid({ apiaryId, zipCode, latitude, longitude }: ForecastGridProps) {
    const [windows, setWindows] = useState<InspectionWindow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWindow, setSelectedWindow] = useState<InspectionWindow | null>(null);

    useEffect(() => {
        const fetchForecast = async () => {
            setLoading(true);
            setError(null);
            try {
                let lat = latitude;
                let lng = longitude;

                // Fetch coords if missing
                if (!lat || !lng) {
                    const coords = await WeatherService.getCoordinates(zipCode);
                    lat = coords.lat;
                    lng = coords.lng;
                }

                // Fetch weather
                const data = await WeatherService.getWeatherForecast(lat, lng);
                const forecast = WeatherService.calculateForecast(data);
                setWindows(forecast);
            } catch (err: any) {
                console.error('Forecast error:', err);
                setError(err.message || 'Failed to load forecast');
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [apiaryId, zipCode, latitude, longitude]);

    // Group windows by date
    const gridData: Record<string, Record<number, InspectionWindow>> = {};
    const uniqueDates = new Set<string>();

    // Get today's date string in local timezone for comparison
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    windows.forEach(w => {
        // Get window date in local timezone
        const windowDate = new Date(w.startTime);
        const windowDateString = `${windowDate.getFullYear()}-${String(windowDate.getMonth() + 1).padStart(2, '0')}-${String(windowDate.getDate()).padStart(2, '0')}`;

        // Only include windows from today forward
        if (windowDateString >= todayDateString) {
            uniqueDates.add(windowDateString);
            if (!gridData[windowDateString]) gridData[windowDateString] = {};
            gridData[windowDateString][w.startTime.getHours()] = w;
        }
    });

    const sortedDates = Array.from(uniqueDates).sort();
    const timeSlots = [6, 8, 10, 12, 14, 16];

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'bg-green-700';
        if (score >= 70) return 'bg-green-500';
        if (score >= 55) return 'bg-amber-400';
        if (score >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const formatTimeSlot = (hour: number) => {
        const slots: Record<number, string> = {
            6: '6-8am',
            8: '8-10am',
            10: '10am-12pm',
            12: '12-2pm',
            14: '2-4pm',
            16: '4-6pm'
        };
        return slots[hour] || `${hour}:00`;
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
        <div className="min-h-screen bg-[#FFFBF0] p-4">
            {/* Minimal Header: Legend + Help */}
            <div className="mb-4 space-y-3">
                {/* Legend */}
                <div className="flex flex-wrap gap-3 justify-center text-xs">
                    <LegendItem label="Excellent 85+" color="bg-green-700" />
                    <LegendItem label="Good 70-84" color="bg-green-500" />
                    <LegendItem label="Fair 55-69" color="bg-amber-400" />
                    <LegendItem label="Poor 40-54" color="bg-orange-500" />
                    <LegendItem label="Not Rec <40" color="bg-red-500" />
                </div>

                {/* Help Link */}
                <div className="text-center text-xs text-gray-500 italic">
                    Tap a score for details
                </div>
            </div>

            {/* Grid */}
            <div className="flex justify-center">
                <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-300 bg-white text-xs">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-2 py-1 font-bold sticky left-0 bg-gray-100 z-10">Time</th>
                                {sortedDates.map(dateStr => {
                                    const date = new Date(dateStr);
                                    return (
                                        <th key={dateStr} className="border border-gray-300 px-2 py-1">
                                            <div className="font-bold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                            <div className="text-[10px] text-gray-500">{date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(hour => (
                                <tr key={hour}>
                                    <td className="border border-gray-300 px-2 py-1 font-bold sticky left-0 bg-white z-10">
                                        {formatTimeSlot(hour)}
                                    </td>
                                    {sortedDates.map(dateStr => {
                                        const window = gridData[dateStr]?.[hour];
                                        if (!window) {
                                            return <td key={dateStr} className="border border-gray-300 bg-gray-100 h-12 w-16"></td>;
                                        }

                                        const textColor = window.score < 40 ? 'text-black' : window.issues.length > 0 ? 'text-red-600' : 'text-white';

                                        return (
                                            <td
                                                key={dateStr}
                                                className={`border border-gray-300 h-12 w-16 cursor-pointer ${getScoreColor(window.score)}`}
                                                onClick={() => setSelectedWindow(window)}
                                            >
                                                <div className={`flex items-center justify-center h-full font-bold text-base ${textColor}`}>
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

            {/* Detail Modal */}
            {selectedWindow && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedWindow(null)}>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#8B4513]">Inspection Conditions</h3>
                                <p className="text-sm text-gray-600">
                                    {selectedWindow.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-sm font-medium">{formatTimeSlot(selectedWindow.startTime.getHours())}</p>
                            </div>
                            <button onClick={() => setSelectedWindow(null)} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
                        </div>

                        {/* Score Banner */}
                        <div className={`${getScoreColor(selectedWindow.score)} rounded-lg p-6 text-center mb-4`}>
                            <div className="text-5xl font-bold text-white">{Math.round(selectedWindow.score)}</div>
                            <div className="text-white font-medium">Overall Score</div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <StatCard label="Temperature" value={`${Math.round(selectedWindow.tempF)}°F`} />
                            <StatCard label="Wind" value={`${Math.round(selectedWindow.windMph)}mph`} />
                            <StatCard label="Cloud Cover" value={`${Math.round(selectedWindow.cloudCover)}%`} />
                            <StatCard label="Precip Prob" value={`${Math.round(selectedWindow.precipProb)}%`} />
                            <StatCard label="Humidity" value={`${Math.round(selectedWindow.humidity)}%`} />
                        </div>

                        {/* Issues */}
                        {selectedWindow.issues.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-bold text-red-600 mb-2">Issues:</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {selectedWindow.issues.map((issue, i) => (
                                        <li key={i}>• {issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
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

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 font-medium">{label}</div>
            <div className="text-lg font-bold text-gray-900">{value}</div>
        </div>
    );
}
