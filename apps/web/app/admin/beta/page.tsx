'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getBetaSignups, approveBetaTester, BetaSignup } from '../../actions/beta-admin';

export default function AdminBetaPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [signups, setSignups] = useState<BetaSignup[]>([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && isAdmin) {
            fetchSignups();
        }
    }, [authLoading, isAdmin]);

    const fetchSignups = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await getBetaSignups();
            if (result.success && result.signups) {
                setSignups(result.signups);
            } else {
                throw new Error(result.error || 'Failed to fetch signups');
            }
        } catch (err: any) {
            setError('Error loading signups: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (signup: BetaSignup) => {
        if (!confirm(`Approve ${signup.email} and send them the install link?`)) return;

        setApproving(signup.id);
        setMessage('');
        setError('');

        try {
            const result = await approveBetaTester(signup.id, signup.email);
            if (result.success) {
                if (result.error) {
                    // Approved but email issue
                    setMessage(`⚠️ ${result.error}`);
                } else {
                    setMessage(`✅ Approved! Install email sent to ${signup.email}`);
                }
                // Update local state
                setSignups(prev => prev.map(s =>
                    s.id === signup.id ? { ...s, approved: true, approved_at: new Date().toISOString() } : s
                ));
            } else {
                throw new Error(result.error || 'Failed to approve');
            }
        } catch (err: any) {
            setError('Error: ' + err.message);
        } finally {
            setApproving(null);
        }
    };

    const pendingCount = signups.filter(s => !s.approved).length;
    const approvedCount = signups.filter(s => s.approved).length;

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
                        <h1 className="text-xl font-serif font-bold text-[#4A3C28]">Beta Tester Management</h1>
                        <div className="flex items-center gap-2 text-xs text-[#8B4513] opacity-80">
                            <button onClick={() => router.push('/apiary-selection')} className="hover:text-[#E67E22] hover:underline font-medium">← Dashboard</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => router.push('/admin/mentors')} className="hover:text-[#E67E22] hover:underline font-medium">Manage Users</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => router.push('/admin/users')} className="hover:text-[#E67E22] hover:underline font-medium">User List</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => router.push('/admin/feature-requests')} className="hover:text-[#E67E22] hover:underline font-medium">Features</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => router.push('/admin/beta')} className="hover:text-[#E67E22] hover:underline font-medium font-bold">Beta</button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow border border-[#E6DCC3] p-4 text-center">
                            <div className="text-3xl font-bold text-[#4A3C28]">{signups.length}</div>
                            <div className="text-sm text-gray-500">Total Signups</div>
                        </div>
                        <div className="bg-white rounded-lg shadow border border-amber-200 p-4 text-center">
                            <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
                            <div className="text-sm text-gray-500">Pending</div>
                        </div>
                        <div className="bg-white rounded-lg shadow border border-green-200 p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
                            <div className="text-sm text-gray-500">Approved</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow border border-[#E6DCC3] p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-[#4A3C28]">Beta Signups</h2>
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={fetchSignups}
                                    className="text-sm text-[#E67E22] hover:underline"
                                >
                                    Refresh List
                                </button>
                                <a
                                    href="https://play.google.com/console"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Open Play Console ↗
                                </a>
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

                        {/* Reminder */}
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
                            <strong>Reminder:</strong> Add the tester's email to the Play Console testers list <em>before</em> clicking Approve.
                            The approval email includes a link to install from Google Play, which only works after they've been added.
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin text-4xl mb-4">🐝</div>
                                <p className="text-gray-500">Loading signups...</p>
                            </div>
                        ) : signups.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No beta signups yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs uppercase text-gray-500 border-b bg-gray-50">
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Signed Up</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Approved At</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {signups.map(signup => (
                                            <tr key={signup.id} className="hover:bg-amber-50/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-gray-900">{signup.email}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {new Date(signup.created_at).toLocaleDateString()}
                                                    <div className="text-xs text-gray-400">{new Date(signup.created_at).toLocaleTimeString()}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {signup.approved ? (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                            ✅ Approved
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                                                            ⏳ Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {signup.approved_at ? (
                                                        <>
                                                            {new Date(signup.approved_at).toLocaleDateString()}
                                                            <div className="text-xs text-gray-400">{new Date(signup.approved_at).toLocaleTimeString()}</div>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {signup.approved ? (
                                                        <span className="text-xs text-gray-400 italic">Email sent</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApprove(signup)}
                                                            disabled={approving === signup.id}
                                                            id={`approve-${signup.id}`}
                                                            className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded border border-green-200 transition-colors disabled:opacity-50 font-medium"
                                                        >
                                                            {approving === signup.id ? 'Sending...' : '✅ Approve & Notify'}
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
        </div>
    );
}
