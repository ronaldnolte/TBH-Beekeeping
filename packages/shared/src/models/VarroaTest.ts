export default interface VarroaTest {
    id: string;
    hive_id: string;
    user_id: string;
    tested_at: string;
    bee_count: number;
    mite_count: number;
    mite_pct: number;
    threshold: number;
    notes?: string;
    reset_at?: string;
    created_at: string;
    updated_at: string;
}
