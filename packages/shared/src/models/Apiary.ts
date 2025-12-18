export default interface Apiary {
    id: string;
    user_id: string;
    name: string;
    zip_code: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}
