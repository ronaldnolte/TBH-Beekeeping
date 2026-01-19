'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function FeatureRequestForm({ onSuccess }: { onSuccess: () => void }) {
    const { userId } = useCurrentUser();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return alert('Please log in to submit a request.');

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('feature_requests')
                .insert({
                    user_id: userId,
                    title,
                    description,
                    status: 'pending'
                });

            if (error) throw error;

            setTitle('');
            setDescription('');
            onSuccess();
        } catch (error) {
            console.error('Failed to submit feature request:', error);
            alert('Failed to submit request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    required
                    maxLength={100}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Dark Mode Support"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the feature and why it would be useful..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !title.trim()}
                    className="bg-[#F5A623] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#D35400] transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </form>
    );
}
