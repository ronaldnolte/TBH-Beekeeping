'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../../lib/database';
import { Apiary } from '@tbh-beekeeper/shared';
import { Modal } from '../../components/Modal';
import { ApiaryForm } from '../../components/ApiaryForm';
import { Hive } from '@tbh-beekeeper/shared';
import { Q } from '@nozbe/watermelondb';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { UserTaskList } from '../../components/TaskList';
import { TaskForm } from '../../components/TaskForm';
import { Task } from '@tbh-beekeeper/shared';
import { resetAndSeed } from '../../lib/seed';
import { sync } from '../../lib/sync';
import { supabase } from '../../lib/supabase';
import { WeatherService, InspectionWindow } from '@tbh-beekeeper/shared';

const WeatherWidget = ({ apiaryId, apiaries }: { apiaryId: string, apiaries: Apiary[] }) => {
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

                let { latitude, longitude, zipCode } = apiary;

                // 1. If missing coords, fetch from ZIP
                if (!latitude || !longitude) {
                    if (!zipCode || zipCode === '00000') {
                        // Can't fetch
                        return;
                    }
                    console.log(`Fetching coords for ${zipCode}...`);
                    const coords = await WeatherService.getCoordinates(zipCode);
                    latitude = coords.lat;
                    longitude = coords.lng;

                    // Update Apiary locally (deferred)
                    await database.write(async () => {
                        await apiary.update(a => {
                            a.latitude = coords.lat;
                            a.longitude = coords.lng;
                        });
                    });
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
    }, [apiaryId, apiaries]);

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

// Helper to debug database state
const ViewApiaryDebugItem = withObservables(['apiary'], ({ apiary }) => ({
    apiary,
    hives: apiary.hives.observe(),
}))(({ apiary, hives, onEdit, onDelete }: { apiary: Apiary, hives: Hive[], onEdit: any, onDelete: any }) => (
    <div className="flex flex-col p-3 border rounded bg-gray-50 mb-2">
        <div className="flex justify-between items-start">
            <div>
                <div className="font-bold text-lg">{apiary.name}</div>
                <div className="text-xs text-gray-500 font-mono">ID: {apiary.id} | Zip: {apiary.zipCode}</div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onEdit(apiary)} className="text-blue-600 hover:underline text-sm font-bold">Edit</button>
                <button onClick={() => onDelete(apiary)} className="text-red-600 hover:underline text-sm font-bold">Delete</button>
            </div>
        </div>

        {/* Debug Hive List */}
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Hives ({hives.length})</div>
            {hives.length > 0 ? (
                <div className="space-y-1">
                    {hives.map(hive => (
                        <div key={hive.id} className="text-xs text-gray-600 flex gap-2 font-mono bg-white p-1 rounded border border-gray-100">
                            <span className="font-bold text-gray-800">{hive.name}</span>
                            <span className="opacity-50">{hive.id}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-xs text-gray-400 italic">No hives</div>
            )}
        </div>
    </div>
));

// Component dealing with raw data
const ApiarySelectionRaw = ({ apiaries, userId, userEmail, onLogout }: { apiaries: Apiary[], userId: string, userEmail?: string, onLogout: () => void }) => {
    const safeApiaries = apiaries || [];
    const router = useRouter();
    const [selectedApiaryId, setSelectedApiaryId] = useState<string>('');
    const [isManaging, setIsManaging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingApiary, setEditingApiary] = useState<Apiary | undefined>(undefined);
    const [isRecovering, setIsRecovering] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Task Management State
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [taskRefreshKey, setTaskRefreshKey] = useState(0);

    // Auto-sync on mount
    useEffect(() => {
        sync()
            .then(() => setLastSync(new Date()))
            .catch(err => console.error('Auto-sync failed:', err));
    }, []);

    // Auto-select first apiary if available and none selected
    useEffect(() => {
        if (!selectedApiaryId && safeApiaries.length > 0) {
            setSelectedApiaryId(safeApiaries[0].id);
        }
    }, [safeApiaries, selectedApiaryId]);

    const handleGo = (id: string = selectedApiaryId) => {
        if (id) {
            router.push(`/apiary/${id}`);
        }
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newVal = e.target.value;
        setSelectedApiaryId(newVal);
    };

    const handleCreate = () => {
        setEditingApiary(undefined);
        setIsEditing(true);
    };

    const handleEdit = (apiary: Apiary) => {
        setEditingApiary(apiary);
        setIsEditing(true);
    };

    const handleDelete = async (apiary: Apiary) => {
        try {
            const hiveCount = await apiary.hives.fetchCount();
            if (hiveCount > 0) {
                alert(`Cannot delete apiary "${apiary.name}" because it contains ${hiveCount} hives. Please move them to another apiary first.`);
                return;
            }

            if (confirm(`Delete apiary "${apiary.name}"? This cannot be undone.`)) {
                await database.write(async () => {
                    await apiary.markAsDeleted();
                });
            }
        } catch (err) {
            console.error("Delete failed", err);
            alert("Error checking for hives. See console.");
        }
    };

    const handleRecoverOrphans = async () => {
        setIsRecovering(true);
        try {
            await database.write(async () => {
                const apiariesCollection = database.collections.get<Apiary>('apiaries');

                // Find all apiaries NOT belonging to current user
                const allApiaries = await apiariesCollection.query().fetch();
                const orphanApiaries = allApiaries.filter(a => a.userId !== userId);

                // Tasks
                const taskCollection = database.collections.get<Task>('tasks');
                const allTasks = await taskCollection.query().fetch();
                const orphanTasks = allTasks.filter(t => t.assignedUserId !== userId);

                const totalOrphans = orphanApiaries.length + orphanTasks.length;

                if (totalOrphans > 0) {
                    if (confirm(`Found ${totalOrphans} items (${orphanApiaries.length} apiaries, ${orphanTasks.length} tasks) from previous sessions. Claim them?`)) {
                        // Claim Apiaries
                        for (const apiary of orphanApiaries) {
                            await apiary.update(a => {
                                a.userId = userId;
                            });
                        }
                        // Claim Tasks
                        for (const task of orphanTasks) {
                            await task.update(t => {
                                t.assignedUserId = userId;
                            });
                        }
                        alert(`Successfully recovered ${totalOrphans} items! forcing sync...`);
                        await sync(); // Force immediate sync push
                        setLastSync(new Date());
                    }
                } else {
                    alert('No hidden data found.');
                }
            });
        } catch (error) {
            console.error('Recovery failed:', error);
            alert('Failed to recover orphans.');
        } finally {
            setIsRecovering(false);
        }
    };

    const [lastSync, setLastSync] = useState<Date | null>(null);

    const handleSyncNow = async () => {
        setIsSyncing(true);
        try {
            await sync();
            setLastSync(new Date());
            // alert('Synced successfully! ☁️'); // Removed alert in favor of status text
        } catch (e: any) {
            console.error('Sync failed', e);
            alert(`Sync failed: ${e.message}`);
        } finally {
            setIsSyncing(false);
        }
    };


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
                            <span>Welcome back, {userEmail || (userId === 'user_1' ? 'User' : userId)}</span>
                            <span className="text-[#E6DCC3]">|</span>
                            <button
                                onClick={onLogout}
                                className="hover:text-[#E67E22] hover:underline font-medium transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weather Widget */}
                <WeatherWidget apiaryId={selectedApiaryId} apiaries={safeApiaries} />
            </header>

            {/* 2. Top Toolbar */}
            <div className="bg-white border-b border-[#E6DCC3] px-4 md:px-8 py-3 shadow-sm">
                <div className="flex flex-col md:grid md:grid-cols-3 gap-4 items-center">

                    {/* Mobile: Row 1 - Selector */}
                    {/* Desktop: Col 1 - Selector */}
                    <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 md:gap-3">
                        <label className="font-bold text-[#4A3C28] whitespace-nowrap hidden md:block">Select Apiary:</label>
                        <select
                            value={selectedApiaryId}
                            onChange={handleDropdownChange}
                            className="flex-1 md:flex-none border border-[#D1C4A9] rounded px-3 py-2 md:py-1.5 text-sm focus:ring-1 focus:ring-[#8B4513] outline-none max-w-[200px] md:max-w-none"
                        >
                            {safeApiaries.length === 0 && <option value="">(No Apiaries)</option>}
                            {safeApiaries.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleGo()}
                            disabled={!selectedApiaryId}
                            className="bg-[#C19A6B] hover:bg-[#A68257] text-white px-4 py-2 md:py-1.5 rounded text-sm font-bold transition-colors disabled:opacity-50"
                        >
                            OK
                        </button>
                    </div>

                    {/* Mobile: Row 2 - Actions Bar */}
                    {/* Desktop: Col 2 & 3 Split */}
                    <div className="w-full md:w-auto flex md:contents justify-between gap-2 overflow-x-auto">
                        {/* Desktop: Col 2 - Forecast */}
                        <div className="flex justify-center md:flex-none">
                            <button
                                onClick={() => {
                                    if (selectedApiaryId) {
                                        router.push(`/apiary-selection/forecast?apiaryId=${selectedApiaryId}`);
                                    } else {
                                        alert('Please select an apiary first');
                                    }
                                }}
                                disabled={!selectedApiaryId}
                                className="px-4 md:px-6 py-2 md:py-1.5 bg-[#F5A623] text-white rounded text-xs md:text-sm font-medium hover:bg-[#E09612] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                📊 Forecast
                            </button>
                        </div>

                        {/* Desktop: Col 3 - Manager & Sync */}
                        <div className="flex gap-2 justify-end md:ml-auto">
                            <button
                                onClick={() => setIsManaging(!isManaging)}
                                className={`px-3 md:px-4 py-2 md:py-1.5 rounded text-xs md:text-sm font-medium border transition-colors whitespace-nowrap ${isManaging
                                    ? 'bg-gray-200 border-gray-300 text-gray-700'
                                    : 'bg-white border-[#D1C4A9] text-[#8B4513] hover:bg-[#FFFBF0]'
                                    }`}
                            >
                                {isManaging ? 'Done' : 'Manage'}
                            </button>

                            <button
                                onClick={handleSyncNow}
                                disabled={isSyncing}
                                className="px-3 md:px-4 py-2 md:py-1.5 bg-white border border-[#D1C4A9] text-[#8B4513] rounded text-xs md:text-sm font-medium hover:bg-[#FFFBF0] transition-colors flex items-center gap-1 disabled:opacity-50 whitespace-nowrap"
                            >
                                {isSyncing ? (
                                    <span className="animate-spin">🔄</span>
                                ) : (
                                    <span>☁️</span>
                                )}
                                <span className="hidden sm:inline">Sync</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Area */}
            <div className="flex-1 flex flex-col p-8 relative honeycomb-bg gap-6 overflow-y-auto">

                {/* Empty State / Prompt */}
                {!isManaging && (
                    <div className="text-center opacity-70 mb-4">
                        <div className="mb-4">
                            <img src="/icon-512.png" alt="TBH Beekeeper" className="w-32 h-32 object-contain opacity-80" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-[#4A3C28] mb-1">Select an apiary to begin</h2>
                        <p className="text-[#8B4513] text-sm">Or view your upcoming tasks below</p>
                    </div>
                )}

                {/* Dashboard: User Tasks */}
                {!isManaging && (
                    <div className="bg-white/95 backdrop-blur shadow-sm border border-[#E6DCC3] rounded-xl p-4 w-full max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[#4A3C28] flex items-center gap-2">
                                <span>📋</span> My Upcoming Tasks
                            </h3>
                            <button
                                onClick={() => setIsAddingTask(true)}
                                className="text-xs px-3 py-1 bg-[#E67E22] text-white rounded hover:bg-[#D35400] transition-colors font-semibold"
                            >
                                + New Task
                            </button>
                        </div>

                        <UserTaskList
                            userId={userId}
                            refreshKey={taskRefreshKey}
                            onRefresh={() => setTaskRefreshKey(prev => prev + 1)}
                            onEdit={(task) => {
                                setEditingTask(task);
                                setIsAddingTask(true);
                            }}
                        />
                    </div>
                )}

                {/* Management View (Overlay) */}
                {isManaging && (
                    <div className="w-full max-w-2xl bg-white/95 backdrop-blur shadow-xl border border-[#E6DCC3] rounded-xl p-6 absolute top-8 left-1/2 transform -translate-x-1/2 z-10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-bold text-[#4A3C28]">Manage Apiaries</h3>
                            <button
                                onClick={handleRecoverOrphans}
                                disabled={isRecovering}
                                className="text-xs text-[#E67E22] hover:underline disabled:opacity-50"
                            >
                                {isRecovering ? 'Scanning...' : '🚑 Rescue Missing Data'}
                            </button>
                        </div>

                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {safeApiaries.map(apiary => (
                                <ViewApiaryDebugItem
                                    key={apiary.id}
                                    apiary={apiary}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                            {safeApiaries.length === 0 && (
                                <div className="text-center py-8 text-gray-400 italic">No apiaries yet.</div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                            <button
                                onClick={handleCreate}
                                className="w-full py-2 bg-[#E67E22] text-white rounded font-bold hover:bg-[#D35400]"
                            >
                                + Create New Apiary
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Apiary Modal */}
            <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title={editingApiary ? "Edit Apiary" : "New Apiary"}
            >
                <ApiaryForm
                    initialData={editingApiary}
                    onSuccess={() => setIsEditing(false)}
                    onCancel={() => setIsEditing(false)}
                />
            </Modal>

            {/* Edit Task Modal */}
            <Modal
                isOpen={isAddingTask}
                onClose={() => setIsAddingTask(false)}
                title={editingTask ? "Edit Task" : "New Task"}
            >
                <TaskForm
                    key={editingTask ? editingTask.id : 'new-dashboard-task'}
                    initialData={editingTask}
                    onSuccess={() => {
                        setIsAddingTask(false);
                        setEditingTask(undefined);
                        setTaskRefreshKey(prev => prev + 1);
                    }}
                    onCancel={() => {
                        setIsAddingTask(false);
                        setEditingTask(undefined);
                    }}
                    scope="user"
                />
            </Modal>
        </div>
    );
};

// Manual Subscription Component
const ApiarySelectionPage = () => {
    const [apiaries, setApiaries] = useState<Apiary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userId, user, loading: authLoading } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        // Redirect if not authenticated (and done loading)
        // Note: This is a simple protection. Middleware is better for robust apps.
        if (!authLoading && !userId) {
            router.push('/');
            return;
        }

        if (!userId) return;

        // Safety timeout: stop loading if DB takes too long (e.g. 5s)
        const safetyTimer = setTimeout(() => {
            setIsLoading(prev => {
                if (prev) {
                    console.warn('Hive data loading timed out, forcing UI render');
                    return false;
                }
                return prev;
            });
        }, 5000);

        // Subscribe to apiaries filtered by user
        const query = database.collections.get<Apiary>('apiaries').query(
            Q.where('user_id', userId),
            Q.sortBy('created_at', Q.desc)
        );

        const subscription = query.observe().subscribe(
            (records) => {
                clearTimeout(safetyTimer);
                setApiaries(records);
                setIsLoading(false);
            },
            (err) => {
                clearTimeout(safetyTimer);
                console.warn('Subscription error (likely auth pending):', err);
                setIsLoading(false);
            }
        );

        return () => {
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, [userId, authLoading, router]);

    const handleLogout = async () => {
        try {
            // 1. Sign out of Cloud
            await supabase.auth.signOut();

            // 2. Wipe Local Data (Crucial for multi-user safety)
            try {
                await database.write(async () => {
                    await database.unsafeResetDatabase();
                });
            } catch (e) {
                console.error('DB Reset failed', e);
            }

            // 3. Clear storage and hard reload
            localStorage.clear();
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out');
        }
    };

    if (authLoading || (isLoading && userId)) return (
        <div className="flex items-center justify-center min-h-screen text-[#8B4513] bg-[#FFFBF0]">
            <div className="flex flex-col items-center p-8 rounded-xl bg-white shadow-lg border border-[#E6DCC3]">
                <div className="animate-pulse text-4xl mb-4">🐝</div>
                <div className="font-bold mb-2">Loading...</div>
                <div className="text-xs text-gray-400 mb-6 font-mono">
                    Auth: {authLoading ? '...' : 'OK'} | DB: {(isLoading && userId) ? '...' : 'OK'}
                </div>

                <button
                    onClick={async () => {
                        if (confirm('Force logout and clear local data?')) {
                            await supabase.auth.signOut();
                            localStorage.clear();
                            window.location.href = '/';
                        }
                    }}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                >
                    Stuck? Force Logout & Reset
                </button>
            </div>
        </div>
    );

    return (
        <>
            <ApiarySelectionRaw
                apiaries={apiaries}
                userId={userId!}
                userEmail={user?.email}
                onLogout={handleLogout}
            />
            {/* 
            <div className="fixed bottom-2 right-2 opacity-50 hover:opacity-100">
                <button
                    onClick={() => {
                        if (confirm('Reset all data?')) resetAndSeed();
                    }}
                    className="text-[10px] bg-red-100 text-red-800 px-2 py-1 rounded border border-red-200"
                >
                    Dev: Reset Data
                </button>
            </div>
            */}
        </>
    );
}

export default ApiarySelectionPage;
