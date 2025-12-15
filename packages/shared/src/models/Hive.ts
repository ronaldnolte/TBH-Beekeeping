import { Model, Q } from '@nozbe/watermelondb';
import { field, readonly, date, relation } from '@nozbe/watermelondb/decorators';

/**
 * Hive model - Core entity for top-bar hive management
 */
export default class Hive extends Model {
    static table = 'hives';

    @field('apiary_id') apiaryId!: string;
    @field('name') name!: string;
    @field('bar_count') barCount!: number;
    @field('is_active') isActive!: boolean;
    @field('notes') notes?: string;
    @field('bars') rawBars?: string; // Stored as JSON string

    // Helper to get parsed bars
    get bars() {
        if (!this.rawBars) return [];
        try {
            return JSON.parse(this.rawBars);
        } catch {
            return [];
        }
    }

    @date('last_inspection_date') lastInspectionDate?: Date;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @relation('apiaries', 'apiary_id') apiary: any;

    get snapshots() {
        return this.collections.get('hive_snapshots').query(Q.where('hive_id', this.id));
    }

    get inspections() {
        return this.collections.get('inspections').query(Q.where('hive_id', this.id));
    }

    get interventions() {
        return this.collections.get('interventions').query(Q.where('hive_id', this.id));
    }

    get tasks() {
        return this.collections.get('tasks').query(Q.where('hive_id', this.id));
    }
}
