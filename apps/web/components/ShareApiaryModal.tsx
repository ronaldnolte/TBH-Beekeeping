'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface MentorProfile {
    user_id: string;
    display_name: string;
    location: string;
    bio: string;
}

interface ShareApiaryModalProps {
    apiaryId: string;
    apiaryName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function ShareApiaryModal({ apiaryId, apiaryName, onClose, onSuccess }: ShareApiaryModalProps) {
    const { userId } = useCurrentUser();
    const [step, setStep] = useState<'list' | 'confirm'>('list');
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Load Mentors
    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            try {
                // Fetch all mentors who are accepting students
                // Note: RLS protects this table, so we only see public mentors
                const { data, error } = await supabase
                    .from('mentor_profiles')
                    .select('*')
                    .eq('is_accepting_students', true)
                    .neq('user_id', userId); // Don't show myself

                if (error) throw error;
                setMentors(data || []);
            } catch (err: any) {
                setError('Failed to load mentors: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, [userId]);

    const handleShare = async () => {
        if (!selectedMentor) return;
        setLoading(true);

        try {
            const { error } = await supabase.from('apiary_shares').insert({
                apiary_id: apiaryId,
                owner_id: userId,
                viewer_id: selectedMentor.user_id
            });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    alert('You have already shared this apiary with this mentor.');
                    onClose();
                    return;
                }
                throw error;
            }

            // Success
            onSuccess();
        } catch (err: any) {
            setError('Share failed: ' + err.message);
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredMentors = mentors.filter(m =>
        (m.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {step === 'list' && (
                <>
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 border border-blue-200">
                        Sharing <strong>{apiaryName}</strong> allows a mentor to view your hive logs (read-only). They cannot edit or delete your data.
                    </div>

                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />

                    <div className="max-h-60 overflow-y-auto border rounded border-gray-200 bg-gray-50">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading mentors...</div>
                        ) : filteredMentors.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                {searchTerm ? 'No mentors found matching your search.' : 'No available mentors found.'}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filteredMentors.map(mentor => (
                                    <div
                                        key={mentor.user_id}
                                        onClick={() => { setSelectedMentor(mentor); setStep('confirm'); }}
                                        className="p-3 hover:bg-white cursor-pointer transition-colors"
                                    >
                                        <div className="font-bold text-gray-800">{mentor.display_name}</div>
                                        <div className="text-xs text-gray-500">{mentor.location}</div>
                                        {mentor.bio && <div className="text-xs text-gray-600 mt-1 italic line-clamp-2">{mentor.bio}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    </div>
                </>
            )}

            {step === 'confirm' && selectedMentor && (
                <div className="text-center py-4">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-lg font-bold mb-2">Share with {selectedMentor.display_name}?</h3>
                    <p className="text-gray-600 mb-6 text-sm">
                        They will have read-only access to all hives in <strong>{apiaryName}</strong>.
                        You can revoke this at any time.
                    </p>

                    {error && <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{error}</div>}

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setStep('list')}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 shadow"
                        >
                            {loading ? 'Sharing...' : 'Confirm Access'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
