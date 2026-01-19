'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FeatureRequest } from '@tbh-beekeeper/shared';
import { useCurrentUser } from '../hooks/useCurrentUser';

type FeatureWithVotes = FeatureRequest & { is_voted_by_me: boolean, votes: number };

export function FeatureRequestList({ refreshKey }: { refreshKey: number }) {
    const { userId } = useCurrentUser();
    const [features, setFeatures] = useState<FeatureWithVotes[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeatures = async () => {
        setLoading(true);
        // Fetch Features
        const { data: featureData, error } = await supabase
            .from('feature_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching features:', error);
            setLoading(false);
            return;
        }

        // Fetch Votes (This is a simplified approach. In a larger app, use RPC or Views)
        // We'll fetch all votes for now since the dataset is small.
        const { data: allVotes } = await supabase.from('feature_votes').select('*');

        const combined = featureData.map((f: any) => {
            const votesForThis = allVotes?.filter(v => v.feature_id === f.id) || [];
            const isVoted = userId ? votesForThis.some(v => v.user_id === userId) : false;
            return {
                ...f,
                votes: votesForThis.length,
                is_voted_by_me: isVoted
            };
        });

        // Sort by votes then date
        combined.sort((a, b) => {
            if (b.votes !== a.votes) return b.votes - a.votes;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setFeatures(combined);
        setLoading(false);
    };

    useEffect(() => {
        fetchFeatures();
    }, [userId, refreshKey]);

    const handleVote = async (featureId: string, currentVoteStatus: boolean) => {
        if (!userId) return alert('Please log in to vote.');

        // Optimistic UI Update
        setFeatures(prev => prev.map(f => {
            if (f.id === featureId) {
                return {
                    ...f,
                    votes: currentVoteStatus ? f.votes - 1 : f.votes + 1,
                    is_voted_by_me: !currentVoteStatus
                };
            }
            return f;
        }));

        try {
            if (currentVoteStatus) {
                // Remove vote
                await supabase
                    .from('feature_votes')
                    .delete()
                    .match({ feature_id: featureId, user_id: userId });
            } else {
                // Add vote
                await supabase
                    .from('feature_votes')
                    .insert({ feature_id: featureId, user_id: userId });
            }
        } catch (error) {
            console.error('Vote failed:', error);
            fetchFeatures(); // Revert on error
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Loading requests...</div>;

    if (features.length === 0) return (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-gray-600">No feature requests yet. Be the first!</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {features.map(feature => (
                <div key={feature.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 transition-all hover:border-[#F5A623]/30">
                    <button
                        onClick={() => handleVote(feature.id, feature.is_voted_by_me)}
                        className={`
                            flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg border transition-all
                            ${feature.is_voted_by_me
                                ? 'bg-[#FFF8F0] border-[#F5A623] text-[#F5A623]'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-[#F5A623] hover:text-[#F5A623]'
                            }
                        `}
                    >
                        <span className="text-lg">▲</span>
                        <span className="font-bold">{feature.votes}</span>
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{feature.title}</h3>
                            <span className={`
                                text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider
                                ${feature.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    feature.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-500'}
                            `}>
                                {feature.status}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm whitespace-pre-line">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
