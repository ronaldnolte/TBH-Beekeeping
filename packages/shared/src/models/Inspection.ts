import { QueenStatus, BroodPattern, Temperament, PopulationStrength, StoreLevel, WeatherData } from './types';

export default interface Inspection {
    id: string;
    hive_id: string;
    timestamp: string;
    queen_status: QueenStatus;
    brood_pattern?: BroodPattern;
    population_strength?: PopulationStrength;
    temperament?: Temperament;
    honey_stores?: StoreLevel;
    pollen_stores?: StoreLevel;
    observations?: string;
    snapshot_id?: string;
    weather?: WeatherData;
    created_at: string;
    updated_at: string;
}
