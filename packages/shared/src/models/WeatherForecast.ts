import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, relation } from '@nozbe/watermelondb/decorators';
import type { SuitabilityScore } from './types';

/**
 * WeatherForecast model - Stores 14-day forecast with inspection suitability
 */
export default class WeatherForecast extends Model {
    static table = 'weather_forecasts';

    @field('apiary_id') apiaryId!: string;
    @date('date_time') dateTime!: Date;

    // Weather data
    @field('temperature') temperature!: number;
    @field('wind_speed') windSpeed!: number;
    @field('precipitation') precipitation!: number;
    @field('humidity') humidity!: number;
    @field('cloud_cover') cloudCover!: number;

    // Inspection suitability
    @field('inspection_score') inspectionScore!: number; // 0-100
    @field('inspection_suitability') inspectionSuitability!: SuitabilityScore;
    @field('score_breakdown') scoreBreakdown?: string; // JSON explaining factors

    @date('fetched_at') fetchedAt!: Date;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @relation('apiaries', 'apiary_id') apiary: any;
}
