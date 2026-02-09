'use client';

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminMentorPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Mentor Form State
    const [displayName, setDisplayName] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [isMentor, setIsMentor] = useState(false);

    // Ban State
    const [isBanned, setIsBanned] = useState(false);

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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setSearchResult(null);

        try {
            console.log('Searching for:', email);

            // 1. Call Helper RPC
            const { data: userIdData, error: rpcError } = await supabase.rpc('get_user_by_email_for_admin', { email_input: email });

            if (rpcError) {
                console.error('RPC Error:', rpcError);
                setMessage(`Database Error: ${rpcError.message} (Hint: Did you run add_admin_email_lookup.sql?)`);
                setLoading(false);
                return;
            }

            if (!userIdData) {
                console.warn('User not found');
                setMessage(`User with email "${email}" not found. Check spelling or ensure they have signed up.`);
                setLoading(false);
                return;
            }

            const userId = userIdData;
            console.log('User Found ID:', userId);

            // 2. Fetch existing mentor profile
            const { data: profile, error: profileError } = await supabase
                .from('mentor_profiles')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            // 3. Fetch Banned Status (Check user_roles)
            const { data: bannedRole } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .eq('role', 'banned')
                .maybeSingle();

            if (profileError) {
                console.error('Profile Fetch Error:', profileError);
                setMessage(`Profile Query Failed: ${profileError.message}`);
                setLoading(false);
                return;
            }

            setSearchResult({ id: userId });
            setIsBanned(!!bannedRole); // Set banned state

            if (profile) {
                setDisplayName(profile.display_name || '');
                setLocation(profile.location || '');
                setBio(profile.bio || '');
                setIsMentor(true);
                setMessage('✅ User Found: Loaded existing profile.');
            } else {
                // Fetch display name from public users table (if available) - purely for UI helpfulness
                const { data: userData } = await supabase.from('users').select('display_name').eq('id', userId).maybeSingle();
                setDisplayName(userData?.display_name || '');
                setLocation('');
                setBio('');
                setIsMentor(false);
                setMessage('✅ User Found.');
            }

        } catch (err: any) {
            console.error('Unexpected Error:', err);
            setMessage('CRITICAL ERROR: ' + (err.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!searchResult?.id) return;
        setLoading(true);

        try {
            // 1. Handle Mentor Profile
            if (!isMentor) {
                const { error } = await supabase.from('mentor_profiles').delete().eq('user_id', searchResult.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('mentor_profiles').upsert({
                    user_id: searchResult.id,
                    display_name: displayName,
                    location: location,
                    bio: bio,
                    is_accepting_students: true
                });
                if (error) throw error;
            }

            // 2. Handle Banned Role
            if (isBanned) {
                // Add 'banned' role
                const { error } = await supabase.from('user_roles').upsert({ user_id: searchResult.id, role: 'banned' }, { onConflict: 'user_id, role' });
                if (error) throw error;
            } else {
                // Remove 'banned' role
                const { error } = await supabase.from('user_roles').delete().eq('user_id', searchResult.id).eq('role', 'banned');
                if (error) throw error;
            }

            // 3. Reset UI but keep search result for feedback
            setMessage('Success! User settings updated.');

        } catch (err: any) {
            setMessage('Save Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex flex-col">
            {/* Header */}
            <header className="bg-[#FFFBF0] px-8 py-4 flex justify-between items-center border-b border-[#E6DCC3]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="/icon-192.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#4A3C28]">Admin Panel</h1>
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
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow border border-[#E6DCC3] p-8">
                    <h2 className="text-2xl font-bold text-[#4A3C28] mb-6 border-b pb-4">Manage Users</h2>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Find User by Email</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="flex-1 px-3 py-2 border rounded shadow-sm focus:ring-amber-500 focus:border-amber-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                            >
                                {loading ? '...' : 'Find'}
                            </button>
                        </div>
                        {message && <p className="mt-2 text-sm text-amber-600 font-medium">{message}</p>}
                    </form>

                    {/* Edit Form */}
                    {searchResult && (
                        <div className="space-y-6 border-t pt-6">

                            {/* Ban Controls */}
                            <div className="p-4 bg-red-50 border border-red-200 rounded">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isBanned"
                                        checked={isBanned}
                                        onChange={e => setIsBanned(e.target.checked)}
                                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                                    />
                                    <div>
                                        <label htmlFor="isBanned" className="font-bold text-red-800 select-none block">
                                            SUSPEND ACCOUNT (Soft Ban)
                                        </label>
                                        <p className="text-xs text-red-600">
                                            User will be effectively locked out. They can log in, but cannot see or edit any data.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mentor Controls */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded">
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="isMentor"
                                        checked={isMentor}
                                        onChange={e => setIsMentor(e.target.checked)}
                                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500"
                                    />
                                    <label htmlFor="isMentor" className="font-bold text-gray-800 select-none">Enable Mentor Profile</label>
                                </div>

                                {isMentor && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pl-7">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Display Name (Public)</label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={e => setDisplayName(e.target.value)}
                                                className="mt-1 w-full px-3 py-2 border rounded shadow-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location (e.g. "Austin, TX")</label>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                                className="mt-1 w-full px-3 py-2 border rounded shadow-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bio / Credentials</label>
                                            <textarea
                                                rows={3}
                                                value={bio}
                                                onChange={e => setBio(e.target.value)}
                                                className="mt-1 w-full px-3 py-2 border rounded shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-between">
                                <button
                                    onClick={() => {
                                        setSearchResult(null);
                                        setDisplayName(''); setLocation(''); setBio('');
                                        setIsMentor(false); setIsBanned(false);
                                        setMessage(''); setEmail('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
                                >
                                    ← Search Again
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2 bg-amber-500 text-white font-bold rounded hover:bg-amber-600 shadow-md transition-colors"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
