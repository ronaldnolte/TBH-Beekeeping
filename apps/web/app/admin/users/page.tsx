'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser } from '../../actions/user-management';
import { User } from '@supabase/supabase-js';

export default function AdminUsersPage() {
    const { isAdmin, loading: authLoading, user: currentUser } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && isAdmin) {
            fetchUsers();
        }
    }, [authLoading, isAdmin]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await getUsers();
            if (result.success && result.users) {
                setUsers(result.users);
            } else {
                throw new Error(result.error || 'Failed to fetch users');
            }
        } catch (err: any) {
            setError('Error loading users: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone and will remove all their data.')) return;

        setDeleting(userId);
        setMessage('');
        setError('');

        try {
            const result = await deleteUser(userId);
            if (result.success) {
                setMessage('✅ User deleted successfully');
                // Remove from local list
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                throw new Error(result.error || 'Failed to delete user');
            }
        } catch (err: any) {
            setError('Error: ' + err.message);
        } finally {
            setDeleting(null);
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
                        <h1 className="text-xl font-serif font-bold text-[#4A3C28]">User Management</h1>
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
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-[#E6DCC3] p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-[#4A3C28]">Registered Users</h2>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={fetchUsers}
                                className="text-sm text-[#E67E22] hover:underline"
                            >
                                Refresh List
                            </button>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{users.length} users</span>
                        </div>
                    </div>

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin text-4xl mb-4">🐝</div>
                            <p className="text-gray-500">Loading users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No users found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs uppercase text-gray-500 border-b bg-gray-50">
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">User ID</th>
                                        <th className="px-4 py-3">Created At</th>
                                        <th className="px-4 py-3">Last Sign In</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{user.email}</div>
                                                {user.app_metadata?.provider && (
                                                    <span className="text-xs text-gray-400 capitalize">{user.app_metadata.provider}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">{user.id}</code>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(user.created_at).toLocaleDateString()}
                                                <div className="text-xs text-gray-400">{new Date(user.created_at).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {user.last_sign_in_at ? (
                                                    <>
                                                        {new Date(user.last_sign_in_at).toLocaleDateString()}
                                                        <div className="text-xs text-gray-400">{new Date(user.last_sign_in_at).toLocaleTimeString()}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 italic">Never</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {currentUser?.id === user.id ? (
                                                    <span className="text-xs text-gray-400 italic">Current User</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={deleting === user.id}
                                                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded border border-red-200 transition-colors disabled:opacity-50 font-medium"
                                                    >
                                                        {deleting === user.id ? 'Deleting...' : 'Delete User'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
