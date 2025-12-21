'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Apiary } from '@tbh-beekeeper/shared';
import { navigateTo } from '../../lib/navigation';
import { Modal } from '../../components/Modal';
import { ApiaryForm } from '../../components/ApiaryForm';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { UserTaskList } from '../../components/TaskList';
import { TaskForm } from '../../components/TaskForm';
import { Task } from '@tbh-beekeeper/shared';
import { supabase } from '../../lib/supabase';
import { WeatherService, InspectionWindow } from '@tbh-beekeeper/shared';

const WeatherWidget = ({ apiaryId, apiaries, onUpdateApiary }: { apiaryId: string, apiaries: Apiary[], onUpdateApiary: (a: Apiary) => void }) => {
    const [weather, setWeather] = useState<InspectionWindow | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!apiaryId) {
            setWeather(null);
            return;
        }

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiary = apiaries.find(a => a.id === apiaryId);
                if (!apiary) return;

                let { latitude, longitude, zip_code } = apiary;

                // 1. If missing coords, fetch from ZIP
                if (!latitude || !longitude) {
                    if (!zip_code || zip_code === '00000') {
                        return;
                    }
                    console.log(`Fetching coords for ${zip_code}...`);
                    const coords = await WeatherService.getCoordinates(zip_code);
                    latitude = coords.lat;
                    longitude = coords.lng;

                    // Update Apiary in Supabase
                    const { error } = await supabase
                        .from('apiaries')
                        .update({ latitude, longitude })
                        .eq('id', apiaryId);

                    if (!error) {
                        onUpdateApiary({ ...apiary, latitude, longitude });
                    }
                }

                // 2. Fetch Weather
                const data = await WeatherService.getWeatherForecast(latitude, longitude);
                const windows = WeatherService.calculateForecast(data);

                // 3. Find current window (or first upcoming)
                const now = new Date();
                const current = windows.find(w => w.endTime > now) || windows[0];
                setWeather(current);

            } catch (err: any) {
                console.error('Weather error:', err);
                setError('N/A');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [apiaryId, apiaries, onUpdateApiary]);

    if (loading) return (
        <div className="text-right opacity-50">
            <div className="text-xs">Loading Weather...</div>
        </div>
    );

    if (error || !weather) return null;

    // Color code score
    let scoreColor = 'bg-gray-100 text-gray-600';
    if (weather.score >= 80) scoreColor = 'bg-green-100 text-green-800 border-green-200';
    else if (weather.score >= 60) scoreColor = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    else scoreColor = 'bg-red-50 text-red-800 border-red-200';

    return (
        <div className="text-right">
            <div className={`border rounded-full px-4 py-1 text-xs shadow-sm inline-flex flex-col items-end ${scoreColor}`}>
                <div className="font-bold flex gap-2 items-center">
                    <span>{Math.round(weather.tempF)}°F {weather.condition}</span>
                </div>
                <span className="text-[10px] opacity-80">
                    Wind: {Math.round(weather.windMph)}mph | Rain: {Math.round(weather.precipProb)}%
                </span>
            </div>
            {weather.issues.length > 0 && (
                <div className="text-[9px] text-red-500 font-bold mt-1">
                    ⚠️ {weather.issues[0]}
                </div>
            )}
        </div>
    );
};

const ApiarySelectionPage = () => {
    const [apiaries, setApiaries] = useState<Apiary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userId, user, loading: authLoading } = useCurrentUser();
    const router = useRouter();

    const [selectedApiaryId, setSelectedApiaryId] = useState<string>('');
    const [isManaging, setIsManaging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingApiary, setEditingApiary] = useState<Apiary | undefined>(undefined);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [taskRefreshKey, setTaskRefreshKey] = useState(0);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);

    const fetchApiaries = async () => {
        if (!userId) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('apiaries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching apiaries:', error);
        } else {
            setApiaries(data || []);
            // Auto-select logic removed to force user interaction
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!authLoading && !userId) {
            navigateTo('/');
            return;
        }
        if (userId) {
            fetchApiaries();
        }
    }, [userId, authLoading, router]);


    const handleGo = (id: string = selectedApiaryId) => {
        if (id) {
            navigateTo(`/apiary/${id}`);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handleDelete = async (apiary: Apiary) => {
        // Check for hives
        const { count, error } = await supabase
            .from('hives')
            .select('*', { count: 'exact', head: true })
            .eq('apiary_id', apiary.id);

        if (count && count > 0) {
            alert(`Cannot delete apiary "${apiary.name}" because it contains ${count} hives.`);
            return;
        }

        if (confirm(`Delete apiary "${apiary.name}"?`)) {
            const { error } = await supabase.from('apiaries').delete().eq('id', apiary.id);
            if (error) {
                alert('Delete failed: ' + error.message);
            } else {
                fetchApiaries();
            }
        }
    };

    if (authLoading || (isLoading && !apiaries.length)) return (
        <div className="flex items-center justify-center min-h-screen text-[#8B4513] bg-[#FFFBF0]">
            <div className="animate-pulse text-4xl mb-4">🐝</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex flex-col text-[#4A3C28]">
            {/* 1. Header */}
            <header className="bg-[#FFFBF0] px-8 py-4 flex justify-between items-center border-b border-[#E6DCC3]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="/icon-192.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#4A3C28]">Beekeeping Manager</h1>
                        <div className="flex items-center gap-2 text-xs text-[#8B4513] opacity-80">
                            <span>Welcome back, {user?.email}</span>
                            <span className="text-[#E6DCC3]">|</span>
                            <button onClick={handleLogout} className="hover:text-[#E67E22] hover:underline font-medium">Log Out</button>
                        </div>
                    </div>
                </div>
                <WeatherWidget
                    apiaryId={selectedApiaryId}
                    apiaries={apiaries}
                    onUpdateApiary={(updated) => {
                        setApiaries(prev => prev.map(a => a.id === updated.id ? updated : a));
                    }}
                />
            </header>

            {/* 2. Top Toolbar */}
            <div className="bg-white border-b border-[#E6DCC3] px-4 md:px-8 py-3 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="w-full md:w-auto flex flex-wrap items-center gap-2 md:gap-3 flex-1">
                        <label className="font-bold text-[#4A3C28] whitespace-nowrap hidden md:block">Select Apiary:</label>
                        <select
                            value={selectedApiaryId}
                            onChange={(e) => {
                                const id = e.target.value;
                                setSelectedApiaryId(id);
                                handleGo(id);
                            }}
                            className="flex-1 border border-[#D1C4A9] rounded px-3 py-2 text-sm min-w-[150px] max-w-[300px]"
                        >
                            <option value="">Select an apiary...</option>
                            {apiaries.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setIsManaging(!isManaging)}
                            className={`px-4 py-2 rounded text-sm font-medium border whitespace-nowrap ${isManaging ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            {isManaging ? 'Done' : '⚙️ Manage Apiaries'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Main Content */}
            <div className="flex-1 flex flex-col p-8 relative honeycomb-bg gap-6 overflow-y-auto">
                {!isManaging && (
                    <div className="text-center opacity-70 mb-4">
                        <div className="mb-4">
                            <img src="/icon-512.png" alt="TBH Beekeeper" className="w-20 h-20 object-contain opacity-80 mx-auto" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-[#4A3C28] mb-1">Select an apiary to begin</h2>
                    </div>
                )}

                {!isManaging && (
                    <div className="bg-white/95 backdrop-blur shadow-sm border border-[#E6DCC3] rounded-xl p-4 w-full max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-bold text-[#4A3C28]">📋 My Upcoming Tasks</h3>
                                <button
                                    onClick={() => setIsAddingTask(true)}
                                    className="text-xs px-3 py-1 bg-[#E67E22] text-white rounded hover:bg-[#D35400] font-semibold"
                                >
                                    + New Task
                                </button>
                            </div>
                            <label className="flex items-center text-[10px] text-gray-500 cursor-pointer select-none space-x-1.5 hover:text-gray-700 bg-white px-2 py-1 rounded border border-gray-100">
                                <input type="checkbox" checked={showCompletedTasks} onChange={(e) => setShowCompletedTasks(e.target.checked)} className="w-3 h-3 text-gray-500 border-gray-300 rounded focus:ring-0" />
                                <span>Show Completed</span>
                            </label>
                        </div>
                        <UserTaskList
                            userId={userId || ''}
                            refreshKey={taskRefreshKey}
                            onRefresh={() => setTaskRefreshKey(prev => prev + 1)}
                            onEdit={(task) => {
                                setEditingTask(task);
                                setIsAddingTask(true);
                            }}
                            showCompleted={showCompletedTasks}
                        />
                    </div>
                )}

                {isManaging && (
                    <div className="w-full max-w-2xl bg-white/95 backdrop-blur shadow-xl border border-[#E6DCC3] rounded-xl p-6 absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                        <h3 className="text-lg font-bold text-[#4A3C28] mb-4 border-b pb-2">Manage Apiaries</h3>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {apiaries.map(apiary => (
                                <div key={apiary.id} className="flex justify-between items-center p-3 border rounded bg-gray-50 mb-2">
                                    <div>
                                        <div className="font-bold text-lg">{apiary.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">ID: {apiary.id} | Zip: {apiary.zip_code}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingApiary(apiary); setIsEditing(true); }} className="text-blue-600 font-bold text-sm">Edit</button>
                                        <button onClick={() => handleDelete(apiary)} className="text-red-600 font-bold text-sm">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { setEditingApiary(undefined); setIsEditing(true); }} className="w-full mt-4 py-2 bg-[#E67E22] text-white rounded font-bold">
                            + Create New Apiary
                        </button>
                    </div>
                )}
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editingApiary ? "Edit Apiary" : "New Apiary"}>
                <ApiaryForm
                    initialData={editingApiary}
                    onSuccess={() => { setIsEditing(false); fetchApiaries(); }}
                    onCancel={() => setIsEditing(false)}
                />
            </Modal>

            <Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)} title={editingTask ? "Edit Task" : "New Task"}>
                <TaskForm
                    key={editingTask ? editingTask.id : 'new-dashboard-task'}
                    initialData={editingTask}
                    onSuccess={() => { setIsAddingTask(false); setEditingTask(undefined); setTaskRefreshKey(prev => prev + 1); }}
                    onCancel={() => { setIsAddingTask(false); setEditingTask(undefined); }}
                    scope="user"
                />
            </Modal>
        </div>
    );
};

export default ApiarySelectionPage;
