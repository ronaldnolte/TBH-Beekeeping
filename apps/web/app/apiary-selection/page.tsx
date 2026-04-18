'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Apiary } from '@tbh-beekeeper/shared';
import { navigateTo } from '../../lib/navigation';
import { Modal } from '../../components/Modal';
import { ApiaryForm } from '../../components/ApiaryForm';
import { ShareApiaryModal } from '../../components/ShareApiaryModal';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { UserTaskList } from '../../components/TaskList';
import { TaskForm } from '../../components/TaskForm';
import { Task } from '@tbh-beekeeper/shared';
import { supabase } from '../../lib/supabase';
import { WeatherService, InspectionWindow } from '@tbh-beekeeper/shared';
import { Tour } from '../../components/Tour';
import { apiarySelectionTour } from '../../lib/tourDefinitions';
import { AppHeader } from '../../components/AppHeader';
import PWAInstallPrompt from '../../components/PWAInstallPrompt';

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
    const { userId, user, loading: authLoading, isAdmin } = useCurrentUser();
    const router = useRouter();

    const [selectedApiaryId, setSelectedApiaryId] = useState<string>('');
    const [isManaging, setIsManaging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingApiary, setEditingApiary] = useState<Apiary | undefined>(undefined);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [taskRefreshKey, setTaskRefreshKey] = useState(0);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);

    // Sharing State
    const [isSharing, setIsSharing] = useState(false);
    const [sharingApiary, setSharingApiary] = useState<Apiary | undefined>(undefined);
    const [sharedApiaries, setSharedApiaries] = useState<any[]>([]); // simplified type
    const [showShared, setShowShared] = useState(false);

    const fetchApiaries = async () => {
        if (!userId) return;
        setIsLoading(true);

        try {
            // 1. Fetch My Apiaries
            const { data: myData, error: myError } = await supabase
                .from('apiaries')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (myError) throw myError;
            setApiaries(myData || []);

            // 2. Fetch Shared Apiaries
            const { data: sharedData, error: sharedError } = await supabase
                .from('apiary_shares')
                .select('*, apiary:apiaries(*), owner:users!owner_id(display_name)')
                .eq('viewer_id', userId);

            if (sharedError) {
                console.warn('Error fetching shares (might be empty/RLS):', sharedError);
                setSharedApiaries([]);
            } else {
                setSharedApiaries(sharedData || []);
            }

        } catch (err) {
            console.error('Error loading apiaries:', err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // LAZY GUARD: Only redirect if auth is DEFINITELY finished loading AND we still have no user
        if (!authLoading && !userId) {
            console.log('[AuthGuard] No session found, waiting before redirect...');
            // Add a 1s delay to be absolutely sure the session isn't just slow to load
            const timeout = setTimeout(() => {
                if (!userId) {
                    console.log('[AuthGuard] Still no session, redirecting to login');
                    navigateTo('/');
                }
            }, 1000);
            return () => clearTimeout(timeout);
        }
        if (userId) {
            fetchApiaries();
        }
    }, [userId, authLoading]);


    const handleGo = (id: string = selectedApiaryId) => {
        if (id) {
            navigateTo(`/apiary/${id}`);
        }
    };

    const handleLogout = async () => {
        // Reset guest account data if this is the guest user
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email === 'guest@beektools.com') {
                console.log('[Logout] Guest user detected, resetting account data...');
                // Import dynamically to avoid loading for non-guest users
                const { resetGuestAccount } = await import('../../lib/guestReset');
                await resetGuestAccount();
                console.log('[Logout] Guest account reset complete');
            }
        } catch (error) {
            console.error('[Logout] Error during guest reset:', error);
            // Continue with logout even if reset fails
        }

        await supabase.auth.signOut();
        navigateTo('/');
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

    const onUpdateApiary = React.useCallback((updated: Apiary) => {
        setApiaries(prev => prev.map(a => a.id === updated.id ? updated : a));
    }, []);

    if (authLoading || (isLoading && !apiaries.length)) return (
        <div className="flex items-center justify-center min-h-screen text-[#8B4513] bg-[#FFFBF0]">
            <div className="animate-pulse text-4xl mb-4">🐝</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex flex-col text-[#4A3C28]">
            <AppHeader
                title="Beekeeping Manager"
                subtitle={`Welcome back, ${user?.email}`}
            />

            {/* 2. Top Toolbar */}
            <div className="bg-white border-b border-[#E6DCC3] px-4 md:px-8 py-3 shadow-sm">
                <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
                    <div className="w-full flex flex-wrap items-center gap-3 md:gap-4 justify-center">
                        {/* Apiary Selection Group */}
                        {(apiaries.length > 0 || sharedApiaries.length > 0) && (
                            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                <label className="font-bold text-[#4A3C28] whitespace-nowrap hidden md:block">Select Apiary:</label>
                                <select
                                    id="apiary-select-dropdown"
                                    value={selectedApiaryId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        setSelectedApiaryId(id);
                                        handleGo(id);
                                    }}
                                    className="flex-1 border border-[#D1C4A9] rounded px-3 py-2 text-sm min-w-[150px] max-w-[300px]"
                                >
                                    <option value="">Select an apiary...</option>
                                    <optgroup label="My Apiaries">
                                        {apiaries.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </optgroup>
                                    {showShared && sharedApiaries.length > 0 && (
                                        <optgroup label="Shared with Me">
                                            {sharedApiaries.map(share => (
                                                <option key={share.apiary_id} value={share.apiary_id}>
                                                    {share.apiary.name} (from {share.owner?.display_name || 'Unknown'})
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                                <button
                                    id="manage-apiaries-button"
                                    onClick={() => setIsManaging(!isManaging)}
                                    className={`px-4 py-2 rounded text-sm font-medium border whitespace-nowrap ${isManaging ? 'bg-gray-200' : 'bg-white'}`}
                                >
                                    {isManaging ? 'Done' : '⚙️ Manage Apiaries'}
                                </button>

                                <label className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1.5 bg-white cursor-pointer select-none whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={showShared}
                                        onChange={e => setShowShared(e.target.checked)}
                                        className="rounded text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>Show Shared</span>
                                </label>
                            </div>
                        )}

                        <div className="hidden md:block mx-1">
                            <div className="h-6 w-px bg-gray-200"></div>
                        </div>

                        {/* Action Buttons Group */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="hidden lg:block">
                                <WeatherWidget
                                    apiaryId={selectedApiaryId}
                                    apiaries={[...apiaries, ...sharedApiaries.map(s => s.apiary)]}
                                    onUpdateApiary={onUpdateApiary}
                                />
                            </div>

                            <div className="flex-shrink-0">
                                <PWAInstallPrompt variant="header" theme="white" />
                            </div>

                            <button
                                onClick={() => navigateTo('/feedback')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-bold border border-blue-200 shadow-sm"
                            >
                                <span>💡</span>
                                <span className="hidden sm:inline">Ideas</span>
                            </button>

                            {isAdmin && (
                                <button
                                    onClick={() => navigateTo('/admin/mentors')}
                                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-bold border border-indigo-200 shadow-sm"
                                >
                                    Admin
                                </button>
                            )}

                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold border border-red-200 shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content */}
            <div className="flex-1 flex flex-col p-8 relative honeycomb-bg gap-6 overflow-y-auto">
                {apiaries.length === 0 && sharedApiaries.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur shadow-xl border border-[#E6DCC3] rounded-xl p-10 max-w-md w-full text-center">
                            <div className="text-6xl mb-4">🏠</div>
                            <h2 className="text-2xl font-bold text-[#4A3C28] mb-2">Welcome to Beekeeper!</h2>
                            <p className="text-gray-600 mb-8">
                                It looks like you don't have any apiaries yet. An apiary is a location where you keep your hives. Create your first apiary to get started!
                            </p>
                            <button
                                onClick={() => { setEditingApiary(undefined); setIsEditing(true); }}
                                className="w-full py-3 bg-[#E67E22] text-white rounded-lg font-bold text-lg hover:bg-[#D35400] transition-colors shadow-md"
                            >
                                + Create First Apiary
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {!isManaging && (
                            <div id="task-list-section" className="bg-white/95 backdrop-blur shadow-sm border border-[#E6DCC3] rounded-xl p-4 w-full max-w-4xl mx-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-bold text-[#4A3C28]">📋 My Upcoming Tasks</h3>
                                        <button
                                            id="add-task-button"
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
                                                <button onClick={() => { setSharingApiary(apiary); setIsSharing(true); }} className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded border border-green-200">Share</button>
                                                <button onClick={() => { setEditingApiary(apiary); setIsEditing(true); }} className="text-blue-600 font-bold text-sm px-2 py-1">Edit</button>
                                                <button onClick={() => handleDelete(apiary)} className="text-red-600 font-bold text-sm px-2 py-1">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { setEditingApiary(undefined); setIsEditing(true); }} className="w-full mt-4 py-2 bg-[#E67E22] text-white rounded font-bold">
                                    + Create New Apiary
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editingApiary ? "Edit Apiary" : "New Apiary"}>
                <ApiaryForm
                    initialData={editingApiary}
                    onSuccess={(newApiary) => {
                        setIsEditing(false);

                        // If this was their very first apiary, navigate to it immediately.
                        if (!editingApiary && apiaries.length === 0 && newApiary) {
                            setIsManaging(false); // Ensure they aren't stuck in manage mode
                            handleGo(newApiary.id);
                        } else {
                            // Otherwise just refresh the list
                            fetchApiaries();
                        }
                    }}
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

            {/* Share Modal */}
            <Modal isOpen={isSharing} onClose={() => setIsSharing(false)} title="Share Apiary">
                {sharingApiary && (
                    <ShareApiaryModal
                        apiaryId={sharingApiary.id}
                        apiaryName={sharingApiary.name}
                        onClose={() => setIsSharing(false)}
                        onSuccess={() => { setIsSharing(false); alert('Apiary shared successfully!'); }}
                    />
                )}
            </Modal>

            {/* Guided Tour */}
            <Tour
                tourId="apiary-selection"
                steps={apiarySelectionTour}
                autoStart={false}
            />
        </div>
    );
};

export default ApiarySelectionPage;
