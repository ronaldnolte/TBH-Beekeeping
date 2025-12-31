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
            // 1. Find the User ID (Using a secure RPC wrapper would be best, but for Admin we can try direct query if policy allows, 
            // OR use the edge function. Since we don't have an edge function, we rely on finding them via the 'users' table which is public-ish for display names? 
            // Wait, we can't query users by email safely. 
            // PROVISIONAL: We will use a dedicated RPC function to specificially resolve email->id for admins.
            // But since I didn't write that RPC yet, let's try to query the public profiles via a new helper or assume we have to add logic.
            // Actually, for this specific admin tool, let's assume we need to resolve the email.

            // ERROR: We can't query auth.users from client. 
            // WORKAROUND: We will assume the Admin knows the target user has already created a public profile (users table).
            // But 'users' table doesn't have email readable by default policy?
            // Let's create a quick Postgres Function to resolve email safely just for admins.

            // For now, let's assume the admin inputs the exact email and we call a Supabase function.
            // I'll call a custom function 'get_user_by_email_for_admin'.

            const { data: userIdData, error: userError } = await supabase.rpc('get_user_by_email_for_admin', { email_input: email });

            if (userError || !userIdData) {
                setMessage('User not found (or you are not an admin). Ensure they have signed up.');
                setLoading(false);
                return;
            }

            const userId = userIdData;

            // 2. Fetch existing mentor profile
            const { data: profile } = await supabase
                .from('mentor_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            setSearchResult({ id: userId });

            if (profile) {
                setDisplayName(profile.display_name || '');
                setLocation(profile.location || '');
                setBio(profile.bio || '');
                setIsMentor(true); // Existing profile implies they are a mentor (or were)
                setMessage('Existing Mentor Profile Loaded.');
            } else {
                // Fetch basic display name from public users table if possible
                const { data: userData } = await supabase.from('users').select('display_name').eq('id', userId).single();
                setDisplayName(userData?.display_name || '');
                setLocation('');
                setBio('');
                setIsMentor(false);
                setMessage('User found. No mentor profile yet.');
            }

        } catch (err: any) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!searchResult?.id) return;
        setLoading(true);

        try {
            if (!isMentor) {
                // If checking "OFF", we delete the profile? Or just update it?
                // For "Sidecar", deleting the row usually removes them from search.
                const { error } = await supabase.from('mentor_profiles').delete().eq('user_id', searchResult.id);
                if (error) throw error;
                setMessage('Mentor profile removed.');
                setDisplayName(''); setLocation(''); setBio(''); setIsMentor(false); setSearchResult(null);
            } else {
                // Upsert
                const { error } = await supabase.from('mentor_profiles').upsert({
                    user_id: searchResult.id,
                    display_name: displayName,
                    location: location,
                    bio: bio,
                    is_accepting_students: true
                });
                if (error) throw error;
                setMessage('Success! Mentor profile updated.');
            }
        } catch (err: any) {
            setMessage('Save Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin: Manage Mentors</h1>

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
                    <div className="space-y-4 border-t pt-6">
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
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
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

                        <div className="pt-4 flex justify-end">
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
    );
}
