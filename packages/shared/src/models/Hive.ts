import { BarState } from './types';

export default interface Hive {
    id: string;
    apiary_id: string;
    name: string;
    bar_count: number;
    is_active: boolean;
    notes?: string;
    bars?: BarState[]; // Supabase JSONB auto-parsed
    last_inspection_date?: string;
    created_at: string;
    updated_at: string;
}
