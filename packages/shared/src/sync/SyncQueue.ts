import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

/**
 * SyncQueue model - Tracks local changes for background sync
 */
export default class SyncQueue extends Model {
    static table = 'sync_queue';

    @field('table_name') tableName!: string;
    @field('record_id') recordId!: string;
    @field('action') action!: 'create' | 'update' | 'delete';
    @field('payload') payload?: string; // JSON
    @field('synced') synced!: boolean;

    @readonly @date('created_at') createdAt!: Date;
    @date('synced_at') syncedAt?: Date;
}
