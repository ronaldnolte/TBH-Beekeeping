import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, json, relation } from '@nozbe/watermelondb/decorators';
import type { BarState, WeatherData } from './types';

/**
 * HiveSnapshot model - Captures bar configuration at a point in time
 */
export default class HiveSnapshot extends Model {
    static table = 'hive_snapshots';

    @field('hive_id') hiveId!: string;
    @date('timestamp') timestamp!: Date;

    // Bar configuration stored as JSON
    @json('bars', (json: unknown) => json as BarState[]) bars!: BarState[];

    // Summary counts (denormalized for performance)
    @field('inactive_bar_count') inactiveBarCount!: number;
    @field('active_bar_count') activeBarCount!: number;
    @field('empty_bar_count') emptyBarCount!: number;
    @field('brood_bar_count') broodBarCount!: number;
    @field('resource_bar_count') resourceBarCount!: number;
    @field('follower_board_position') followerBoardPosition?: number;

    // Optional weather data
    @json('weather', (json: unknown) => json as WeatherData | undefined) weather?: WeatherData;
    @field('notes') notes?: string;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @relation('hives', 'hive_id') hive: any;
}
