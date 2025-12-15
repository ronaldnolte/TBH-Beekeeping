import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, json, relation } from '@nozbe/watermelondb/decorators';
import type { InterventionType, WeatherData } from './types';

/**
 * Intervention model - Records treatments, feeding, manipulations
 */
export default class Intervention extends Model {
    static table = 'interventions';

    static associations = {
        hives: { type: 'belongs_to' as const, key: 'hive_id' },
        inspections: { type: 'belongs_to' as const, key: 'inspection_id' },
    };

    @field('hive_id') hiveId!: string;
    @date('timestamp') timestamp!: Date;

    @field('type') type!: InterventionType;
    @field('description') description!: string;

    // Optional link to related inspection
    @field('inspection_id') inspectionId?: string;
    @json('weather', (json: unknown) => json as any) weather?: any;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @relation('hives', 'hive_id') hive: any;
    @relation('inspections', 'inspection_id') inspection?: any;
}
