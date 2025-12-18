'use client';

import { useState, useEffect } from 'react';
import { Hive, Task } from '@tbh-beekeeper/shared';
import { database } from '../lib/database';
import { Q, Query } from '@nozbe/watermelondb';
import { Modal } from './Modal';

// --- Task Item Component (UI Only) ---
const TaskItem = ({ task, onToggle, onDelete, onEdit }: { task: Task, onToggle: (task: Task) => void, onDelete: (task: Task) => void, onEdit: (task: Task) => void }) => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
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
        <div className={`grid grid-cols-[50px_40px_60px_80px_140px_1fr] border-b border-gray-100 hover:bg-gray-50 transition-colors group items-center py-0 ${task.status === 'completed' ? 'opacity-50' : ''}`}>
            {/* Actions */}
            <div className="flex gap-1 justify-center px-1 items-center h-8">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                    className="text-gray-300 hover:text-amber-500 p-1"
                >
                    ✎
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                    className="text-gray-300 hover:text-red-500 p-1"
                >
                    ×
                </button>
            </div>

            {/* Checkbox */}
            <div className="flex justify-center items-center h-8">
                <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => onToggle(task)}
                    className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
            </div>

            {/* Priority */}
            <div className="px-2 flex items-center justify-center h-8">
                <span className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'medium' ? 'Med' : task.priority}
                </span>
            </div>

            {/* Due Date */}
            <div className="px-2 flex items-center h-8">
                {dueDate ? (
                    <span className={`text-[10px] truncate ${isOverdue ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                        {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                ) : (
                    <span className="text-[10px] text-gray-300">-</span>
                )}
            </div>

            {/* Title */}
            <div className="px-2 min-w-0 flex items-center h-8">
                <span className={`text-[11px] text-gray-700 truncate ${task.status === 'completed' ? 'line-through' : ''}`} title={task.title}>
                    {task.title}
                </span>
            </div>

            {/* Description */}
            <div className="px-2 min-w-0 flex items-center h-8">
                {task.description ? (
                    <span className="text-[11px] text-gray-500 truncate" title={task.description}>
                        {task.description}
                    </span>
                ) : (
                    <span className="text-[10px] text-gray-300 italic">-</span>
                )}
            </div>


        </div>
    );
};

// --- Reusable Task Grid (Accepts List of Tasks) ---
export const TaskGrid = ({ tasks, onEdit, onRefresh }: { tasks: Task[], onEdit: (task: Task) => void, onRefresh?: () => void }) => {
    const [showCompleted, setShowCompleted] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Task | null>(null);

    const handleToggle = async (task: Task) => {
        await database.write(async () => {
            await task.update(t => {
                t.status = t.status === 'completed' ? 'pending' : 'completed';
                t.completedAt = t.status === 'completed' ? new Date() : undefined;
            });
        });
        if (onRefresh) onRefresh();
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        await database.write(async () => {
            await itemToDelete.destroyPermanently();
        });
        setItemToDelete(null);
        if (onRefresh) onRefresh();
    };

    const visibleTasks = tasks.filter(t => showCompleted || t.status !== 'completed');

    if (tasks.length === 0) {
        return <div className="text-center py-4 text-gray-400 text-xs italic">No tasks.</div>;
    }

    return (
        <>
            <div className="flex justify-end mb-2">
                <label className="flex items-center text-[10px] text-gray-500 cursor-pointer select-none space-x-1.5 hover:text-gray-700">
                    <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        className="w-3 h-3 text-gray-500 border-gray-300 rounded focus:ring-0"
                    />
                    <span>Show Completed</span>
                </label>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="grid grid-cols-[50px_40px_60px_80px_140px_1fr] bg-gray-50 border-b border-gray-200 py-1.5 items-center">
                    <div></div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Done</div>
                    <div className="px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pri</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Due</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Title</div>
                    <div className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Description</div>
                    <div></div>
                </div>

                {visibleTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={setItemToDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>

            <Modal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title="Delete Task"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Delete "{itemToDelete?.title}"?</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setItemToDelete(null)} className="px-3 py-1 text-xs border rounded">Cancel</button>
                        <button onClick={confirmDelete} className="px-3 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
                    </div>
                </div>
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
        // 1. Completion status (should be filtered out usually, but just in case)
        if (a.status !== b.status) return a.status === 'completed' ? 1 : -1;

        // 2. Due Date: Items WITH dates come before items WITHOUT
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;

        if (dateA !== dateB) {
            return dateA - dateB; // Ascending (earliest first), nulls last
        }

        // 3. Priority (High > Medium > Low)
        const priA = getPriorityVal(a.priority);
        const priB = getPriorityVal(b.priority);
        if (priA !== priB) {
            return priB - priA; // Descending value
        }

        // 4. Created At (Newest first)
        return b.createdAt.getTime() - a.createdAt.getTime();
    });
};

// --- Hive-Specific List ---
export const TaskList = ({ hive, refreshKey, onRefresh, onEdit }: { hive: Hive, refreshKey?: number, onRefresh?: () => void, onEdit: (task: Task) => void }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const query = database.collections.get<Task>('tasks').query(
            Q.where('hive_id', hive.id)
        );
        const subscription = query.observe().subscribe(records => {
            setTasks(sortTasks(records));
        });
        return () => subscription.unsubscribe();
    }, [hive.id, refreshKey]);

    return <TaskGrid tasks={tasks} onEdit={onEdit} onRefresh={onRefresh} />;
};

// --- User-Specific List (Dashboard) ---
export const UserTaskList = ({ userId, refreshKey, onRefresh, onEdit }: { userId: string, refreshKey?: number, onRefresh?: () => void, onEdit: (task: Task) => void }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (!userId) {
            setTasks([]);
            return;
        }

        const query = database.collections.get<Task>('tasks').query(
            Q.where('assigned_user_id', userId)
        );
        const subscription = query.observe().subscribe(records => {
            setTasks(sortTasks(records));
        });
        return () => subscription.unsubscribe();
    }, [userId, refreshKey]);

    return <TaskGrid tasks={tasks} onEdit={onEdit} onRefresh={onRefresh} />;
};
