'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

interface FeatureRequest {
    id: string;
    title: string;
    description: string | null;
    status: 'pending' | 'planned' | 'completed' | 'declined';
    created_at: string;
    vote_count: number;
}

const STATUS_OPTIONS = ['pending', 'planned', 'completed', 'declined'] as const;
const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    planned: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    declined: 'bg-gray-100 text-gray-600',
};

export default function AdminFeatureRequestsPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<FeatureRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!authLoading && isAdmin) {
            fetchRequests();
        }
    }, [authLoading, isAdmin]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Fetch requests with vote counts
            const { data: requestsData, error: reqError } = await supabase
                .from('feature_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (reqError) throw reqError;

            // Fetch vote counts
            const { data: votesData, error: voteError } = await supabase
                .from('feature_votes')
                .select('feature_id');

            if (voteError) throw voteError;

            // Count votes per feature
            const voteCounts: Record<string, number> = {};
            votesData?.forEach(v => {
                voteCounts[v.feature_id] = (voteCounts[v.feature_id] || 0) + 1;
            });

            // Merge
            const merged = (requestsData || []).map(r => ({
                ...r,
                vote_count: voteCounts[r.id] || 0
            }));

            setRequests(merged);
        } catch (err: any) {
            setMessage('Error loading requests: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        setSaving(id);
        setMessage('');
        try {
            const { error } = await supabase
                .from('feature_requests')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setRequests(prev => prev.map(r =>
                r.id === id ? { ...r, status: newStatus as FeatureRequest['status'] } : r
            ));
            setMessage('✅ Status updated');
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this feature request permanently?')) return;
        setSaving(id);
        try {
            const { error } = await supabase
                .from('feature_requests')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setRequests(prev => prev.filter(r => r.id !== id));
            setMessage('Request deleted');
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        } finally {
            setSaving(null);
        }
    };

    if (authLoading) return <div className="p-8 text-center text-gray-500">Verifying access...</div>;

    if (!isAdmin) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p className="text-gray-600">You do not have permission to view this page.</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex flex-col">
            {/* Header */}
            <header className="bg-[#FFFBF0] px-8 py-4 flex justify-between items-center border-b border-[#E6DCC3]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="/icon-192.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#4A3C28]">Feature Requests</h1>
                        <div className="flex items-center gap-2 text-xs text-[#8B4513] opacity-80">
                            <button onClick={() => router.push('/apiary-selection')} className="hover:text-[#E67E22] hover:underline font-medium">← Dashboard</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => router.push('/admin/mentors')} className="hover:text-[#E67E22] hover:underline font-medium">Manage Users</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => router.push('/admin/users')} className="hover:text-[#E67E22] hover:underline font-medium">User List</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => router.push('/admin/feature-requests')} className="hover:text-[#E67E22] hover:underline font-medium">Features</button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow border border-[#E6DCC3] p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-[#4A3C28]">Manage Feature Requests</h2>
                        <span className="text-sm text-gray-500">{requests.length} total</span>
                    </div>

                    {message && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No feature requests yet.</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs uppercase text-gray-500 border-b">
                                    <th className="pb-2">Request</th>
                                    <th className="pb-2 text-center">Votes</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {requests.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="py-3 pr-4">
                                            <div className="font-medium text-gray-800">{req.title}</div>
                                            {req.description && (
                                                <div className="text-sm text-gray-500 truncate max-w-md">{req.description}</div>
                                            )}
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                                                {req.vote_count}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <select
                                                value={req.status}
                                                onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                                disabled={saving === req.id}
                                                className={`text-sm font-medium px-3 py-1 rounded border-0 cursor-pointer ${STATUS_COLORS[req.status]}`}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(req.id)}
                                                disabled={saving === req.id}
                                                className="text-xs text-red-500 hover:text-red-700 hover:underline disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
