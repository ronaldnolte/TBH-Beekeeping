import { BarState, WeatherData } from './types';

export default interface HiveSnapshot {
    id: string;
    hive_id: string;
    timestamp: string;
    bars: BarState[];
    inactive_bar_count: number;
    active_bar_count: number;
    empty_bar_count: number;
    brood_bar_count: number;
    resource_bar_count: number;
    follower_board_position?: number;
    weather?: WeatherData;
    notes?: string;
    created_at: string;
    updated_at: string;
}
