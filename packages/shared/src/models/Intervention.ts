import { InterventionType, WeatherData } from './types';

export default interface Intervention {
    id: string;
    hive_id: string;
    timestamp: string;
    type: InterventionType;
    description: string;
    inspection_id?: string;
    weather?: WeatherData;
    created_at: string;
    updated_at: string;
}
