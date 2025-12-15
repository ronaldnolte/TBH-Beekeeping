import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, json, relation } from '@nozbe/watermelondb/decorators';
import type { QueenStatus, BroodPattern, Temperament, PopulationStrength, StoreLevel, WeatherData } from './types';

/**
 * Inspection model - Records hive inspection details
 */
export default class Inspection extends Model {
    static table = 'inspections';

    @field('hive_id') hiveId!: string;
    @date('timestamp') timestamp!: Date;

    // Inspection fields
    @field('queen_status') queenStatus!: QueenStatus;
    @field('brood_pattern') broodPattern?: BroodPattern;
    @field('population_strength') populationStrength?: PopulationStrength;
    @field('temperament') temperament?: Temperament;
    @field('honey_stores') honeyStores?: StoreLevel;
    @field('pollen_stores') pollenStores?: StoreLevel;
    @field('observations') observations?: string;

    // Optional links
    @field('snapshot_id') snapshotId?: string;
    @json('weather', (json: unknown) => json as WeatherData | undefined) weather?: WeatherData;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @relation('hives', 'hive_id') hive: any;
    @relation('hive_snapshots', 'snapshot_id') snapshot?: any;
}
