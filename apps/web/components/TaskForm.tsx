'use client';

import { useState } from 'react';
import { Task, TaskPriority } from '@tbh-beekeeper/shared';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { supabase } from '../lib/supabase';

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];

export function TaskForm({
    hiveId,
    scope = 'hive',
    initialData,
    onSuccess,
    onCancel
}: {
    hiveId?: string,
    scope?: 'hive' | 'apiary' | 'user',
    initialData?: Task,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const { userId } = useCurrentUser();
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
    const [dueDate, setDueDate] = useState<string>(() => {
        if (initialData?.due_date) {
            return new Date(initialData.due_date).toISOString().split('T')[0];
        }
        const d = new Date();
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (scope === 'hive' && !hiveId) {
            alert('Error: Hive ID is missing for this task.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title,
                description,
                priority,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
                scope,
                hive_id: hiveId || null,
                status: initialData?.status || 'pending',
                assigned_user_id: userId
            };

            if (initialData) {
                const { error } = await supabase.from('tasks').update(payload).eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('tasks').insert(payload);
                if (error) throw error;
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save task:', error);
            alert('Failed to save task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Inspect Brood Pattern"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <div className="space-y-2">
                        {PRIORITIES.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setPriority(p.value)}
                                className={`w-full px-3 py-1.5 text-xs font-medium rounded-md border text-center transition-all ${priority === p.value
                                    ? `ring-2 ring-offset-1 ring-[#F5A623] border-transparent ${p.color}`
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details..."
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-sm"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[#F5A623] text-white rounded-md text-sm font-medium hover:bg-[#E09612] disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Task' : 'Add Task')}
                </button>
            </div>
        </form>
    );
}
