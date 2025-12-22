'use client';

import { useState, useEffect } from 'react';
import { Hive, Task } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { Modal } from './Modal';

// --- Task Item Component (UI Only) ---
const TaskItem = ({ task, onToggle, onDelete, onEdit, onView, location }: { task: Task, onToggle: (task: Task) => void, onDelete: (task: Task) => void, onEdit: (task: Task) => void, onView?: (task: Task) => void, location?: { apiaryName?: string, hiveName?: string } }) => {
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 font-bold';
            case 'medium': return 'text-amber-600 font-medium';
            case 'low': return 'text-blue-600';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className={`grid grid-cols-[50px_40px_60px_80px_140px_1fr_160px] border-b border-gray-100 hover:bg-gray-50 transition-colors group items-center py-0 ${task.status === 'completed' ? 'opacity-50' : ''}`} onClick={() => onView?.(task)}>
            <div className="flex gap-2 justify-center px-1 items-center h-8">
                <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="text-gray-400 p-2 text-lg">✎</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(task); }} className="text-gray-400 p-2 text-lg">×</button>
            </div>

            <div className="flex justify-center items-center h-8">
                <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => onToggle(task)}
                    className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
            </div>

            <div className="px-2 flex items-center justify-center h-8">
                <span className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'medium' ? 'Med' : task.priority}
                </span>
            </div>

            <div className="px-2 flex items-center h-8">
                {dueDate ? (
                    <span className={`text-[10px] truncate ${isOverdue ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                        {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                ) : <span className="text-[10px] text-gray-300">-</span>}
            </div>

            <div className={`px-2 min-w-0 flex items-center h-8 text-[11px] text-gray-700 truncate ${task.status === 'completed' ? 'line-through' : ''}`} title={task.title}>
                {task.title}
            </div>

            <div className="px-2 min-w-0 flex items-center h-8 text-[11px] text-gray-500 truncate" title={task.description}>
                {task.description || '-'}
            </div>

            <div className="px-2 min-w-0 flex items-center h-8 text-[10px] text-gray-600 truncate">
                {location?.apiaryName && (
                    <span className="font-medium">{location.apiaryName}</span>
                )}
                {location?.hiveName && (
                    <span className="ml-1 text-gray-400">/ {location.hiveName}</span>
                )}
                {!location?.apiaryName && !location?.hiveName && (
                    <span className="italic text-gray-400">General Task</span>
                )}
            </div>
        </div>
    );
};

// --- Reusable Task Grid (Accepts List of Tasks) ---
export const TaskGrid = ({ tasks, onEdit, onRefresh, showCompleted = false, taskLocations = {} }: { tasks: Task[], onEdit: (task: Task) => void, onRefresh?: () => void, showCompleted?: boolean, taskLocations?: Record<string, { apiaryName?: string, hiveName?: string }> }) => {
    const [itemToDelete, setItemToDelete] = useState<Task | null>(null);
    const [viewingItem, setViewingItem] = useState<Task | null>(null);

    const handleToggle = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

        await supabase
            .from('tasks')
            .update({ status: newStatus, completed_at: completedAt })
            .eq('id', task.id);

        if (onRefresh) onRefresh();
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        await supabase.from('tasks').delete().eq('id', itemToDelete.id);
        setItemToDelete(null);
        if (onRefresh) onRefresh();
    };

    const visibleTasks = tasks.filter(t => showCompleted || t.status !== 'completed');

    if (tasks.length === 0) return <div className="text-center py-4 text-gray-400 text-xs italic">No tasks.</div>;

    return (
        <>


            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-[50px_40px_60px_80px_140px_1fr_160px] bg-gray-50 border-b border-gray-200 py-1.5 items-center">
                    <div></div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Done</div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pri</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Due</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Title</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Description</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Location</div>
                </div>

                {visibleTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={setItemToDelete}
                        onEdit={onEdit}
                        onView={setViewingItem}
                        location={taskLocations[task.id]}
                    />
                ))}
            </div>

            <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Delete Task">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Delete "{itemToDelete?.title}"?</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setItemToDelete(null)} className="px-3 py-1 text-xs border rounded">Cancel</button>
                        <button onClick={confirmDelete} className="px-3 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title="Task Details">
                {viewingItem && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b pb-2">
                            <div>
                                <h4 className="text-lg font-bold text-gray-800">{viewingItem.title}</h4>
                                <div className="text-xs text-gray-500 mt-1">Due: {viewingItem.due_date ? new Date(viewingItem.due_date).toLocaleDateString() : 'No due date'}</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${viewingItem.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{viewingItem.priority}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border border-gray-100">
                            <p className="text-sm text-gray-800">{viewingItem.description || 'No description.'}</p>
                        </div>
                        <div className="flex justify-between pt-2">
                            <div className="flex gap-2">
                                <button onClick={() => { setViewingItem(null); onEdit(viewingItem); }} className="px-3 py-2 bg-amber-100 text-amber-800 rounded text-xs font-bold">Edit</button>
                                <button onClick={() => { setViewingItem(null); setItemToDelete(viewingItem); }} className="px-3 py-2 bg-red-100 text-red-800 rounded text-xs font-bold">Delete</button>
                            </div>
                            <button onClick={() => setViewingItem(null)} className="px-4 py-2 bg-gray-100 rounded text-xs">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

// --- Sorting Logic ---
const sortTasks = (tasks: Task[]) => {
    const getPriorityVal = (p: string) => {
        if (p === 'high') return 3;
        if (p === 'medium') return 2;
        if (p === 'low') return 1;
        return 0;
    };

    return [...tasks].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'completed' ? 1 : -1;
        const dateA = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        if (dateA !== dateB) return dateA - dateB;
        const priA = getPriorityVal(a.priority);
        const priB = getPriorityVal(b.priority);
        if (priA !== priB) return priB - priA;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
};

// --- Hive-Specific List ---
export const TaskList = ({ hive, refreshKey, onRefresh, onEdit, showCompleted = false }: { hive: Hive, refreshKey?: number, onRefresh?: () => void, onEdit: (task: Task) => void, showCompleted?: boolean }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data } = await supabase.from('tasks').select('*').eq('hive_id', hive.id);
            setTasks(sortTasks(data || []));
        };
        fetchTasks();
    }, [hive.id, refreshKey]);

    return <TaskGrid tasks={tasks} onEdit={onEdit} onRefresh={onRefresh} showCompleted={showCompleted} />;
};

// --- User-Specific List (Dashboard) ---
export const UserTaskList = ({ userId, refreshKey, onRefresh, onEdit, showCompleted = false }: { userId: string, refreshKey?: number, onRefresh?: () => void, onEdit: (task: Task) => void, showCompleted?: boolean }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskLocations, setTaskLocations] = useState<Record<string, { apiaryName?: string, hiveName?: string }>>({});

    useEffect(() => {
        if (!userId) return;
        const fetchTasks = async () => {
            // Fetch tasks first
            const { data: tasksData, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .eq('assigned_user_id', userId);

            if (tasksError) {
                console.error('Error fetching tasks:', tasksError);
                return;
            }

            if (tasksData) {
                setTasks(sortTasks(tasksData || []));

                // Fetch location names separately
                const locations: Record<string, { apiaryName?: string, hiveName?: string }> = {};

                // Get unique hive IDs first (we'll get apiary info from hives)
                const hiveIds = [...new Set(tasksData.map(t => t.hive_id).filter(Boolean))];

                // Fetch hive names AND their apiary_ids
                const hiveToApiaryMap = new Map<string, string>(); // Maps hive_id to apiary_id
                if (hiveIds.length > 0) {
                    const { data: hives } = await supabase
                        .from('hives')
                        .select('id, name, apiary_id')
                        .in('id', hiveIds);

                    const hiveMap = new Map(hives?.map(h => [h.id, h.name]) || []);
                    hives?.forEach(h => {
                        if (h.apiary_id) {
                            hiveToApiaryMap.set(h.id, h.apiary_id);
                        }
                    });

                    tasksData.forEach(task => {
                        if (task.hive_id) {
                            if (!locations[task.id]) locations[task.id] = {};
                            locations[task.id].hiveName = hiveMap.get(task.hive_id);
                        }
                    });
                }

                // Collect all apiary IDs (both from tasks and from hives)
                const apiaryIdsFromTasks = tasksData.map(t => t.apiary_id).filter(Boolean);
                const apiaryIdsFromHives = Array.from(hiveToApiaryMap.values());
                const apiaryIds = [...new Set([...apiaryIdsFromTasks, ...apiaryIdsFromHives])];

                // Fetch apiary names
                if (apiaryIds.length > 0) {
                    const { data: apiaries } = await supabase
                        .from('apiaries')
                        .select('id, name')
                        .in('id', apiaryIds);

                    const apiaryMap = new Map(apiaries?.map(a => [a.id, a.name]) || []);

                    tasksData.forEach(task => {
                        // Try to get apiary from task first, then from hive
                        let apiaryId = task.apiary_id;
                        if (!apiaryId && task.hive_id) {
                            apiaryId = hiveToApiaryMap.get(task.hive_id);
                        }

                        if (apiaryId) {
                            if (!locations[task.id]) locations[task.id] = {};
                            locations[task.id].apiaryName = apiaryMap.get(apiaryId);
                        }
                    });
                }

                setTaskLocations(locations);
            }
        };
        fetchTasks();
    }, [userId, refreshKey]);

    return <TaskGrid tasks={tasks} onEdit={onEdit} onRefresh={onRefresh} showCompleted={showCompleted} taskLocations={taskLocations} />;
};
