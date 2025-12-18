import { SuitabilityScore } from './types';

export default interface WeatherForecast {
    id: string;
    apiary_id: string;
    date_time: string;
    temperature: number;
    wind_speed: number;
    precipitation: number;
    humidity: number;
    cloud_cover: number;
    inspection_score: number;
    inspection_suitability: SuitabilityScore;
    score_breakdown?: string;
    fetched_at: string;
    created_at: string;
    updated_at: string;
}
