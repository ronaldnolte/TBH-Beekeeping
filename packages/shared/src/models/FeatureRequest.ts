export interface FeatureRequest {
    id: string;
    user_id: string;
    title: string;
    description: string;
    status: 'pending' | 'planned' | 'completed' | 'declined';
    created_at: string;
    updated_at: string;
    vote_count?: number; // Computed locally or via view
    user_has_voted?: boolean; // Computed locally
}

export interface FeatureVote {
    feature_id: string;
    user_id: string;
    created_at: string;
}
