import { BarState } from './types';
import { HiveType, HiveBox } from './HiveTypes';

export default interface Hive {
    id: string;
    apiary_id: string;
    type?: HiveType; // Optional for backward compatibility, defaults to 'top_bar' logic if missing
    name: string;
    bar_count: number;
    is_active: boolean;
    notes?: string;
    bars?: BarState[] | HiveBox[]; // Supabase JSONB: Stores Bars (TBH) or Boxes (Langstroth)
    last_inspection_date?: string;
    created_at: string;
    updated_at: string;
}
