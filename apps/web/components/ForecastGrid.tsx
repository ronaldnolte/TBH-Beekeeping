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

    // Get today's date at start of day (local time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayValue = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    windows.forEach(w => {
        // Get window date in local timezone
        const windowDate = new Date(w.startTime);
        const windowValue = windowDate.getFullYear() * 10000 + (windowDate.getMonth() + 1) * 100 + windowDate.getDate();

        // Only include windows from today forward
        if (windowValue >= todayValue) {
            const windowDateString = `${windowDate.getFullYear()}-${String(windowDate.getMonth() + 1).padStart(2, '0')}-${String(windowDate.getDate()).padStart(2, '0')}`;
            uniqueDates.add(windowDateString);
            if (!gridData[windowDateString]) gridData[windowDateString] = {};
            gridData[windowDateString][w.startTime.getHours()] = w;
        }
    });

    const sortedDates = Array.from(uniqueDates).sort();

    // Additional safety filter to remove dates before today
    // Compare date strings directly (YYYY-MM-DD format)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const filteredDates = sortedDates.filter(dateStr => dateStr >= todayStr);

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
                                {filteredDates.map(dateStr => {
                                    // Parse as local date (not UTC) by adding a time component
                                    const date = new Date(dateStr + 'T12:00:00');
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
                                    {filteredDates.map(dateStr => {
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

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <StatCard
                                label="Temperature"
                                value={`${Math.round(selectedWindow.tempF)}°F`}
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
                                value={`${Math.round(selectedWindow.windMph)}mph`}
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
                                if (selectedWindow.windMph <= 10) good.push(`Light winds (${Math.round(selectedWindow.windMph)}mph)`);
                                if (selectedWindow.cloudCover <= 20) good.push(`Sunny (${Math.round(selectedWindow.cloudCover)}% clouds)`);
                                if (selectedWindow.precipProb === 0) good.push("No rain expected");
                                if (selectedWindow.tempF >= 60 && selectedWindow.tempF <= 90) good.push(`Good temperature (${Math.round(selectedWindow.tempF)}°F)`);
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
