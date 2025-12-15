import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, relation } from '@nozbe/watermelondb/decorators';
import type { TaskScope, TaskStatus, TaskPriority } from './types';

/**
 * Task model - Tracks pending work for hives or apiaries
 */
export default class Task extends Model {
    static table = 'tasks';

    @field('scope') scope!: TaskScope;
    @field('apiary_id') apiaryId!: string;
    @field('hive_id') hiveId?: string; // Only set if scope is 'hive'

    @field('title') title!: string;
    @field('description') description?: string;
    @date('due_date') dueDate?: Date;
    @field('status') status!: TaskStatus;
    @field('priority') priority!: TaskPriority;
    @field('assigned_user_id') assignedUserId?: string;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
    @date('completed_at') completedAt?: Date;

    @relation('apiaries', 'apiary_id') apiary: any;
    @relation('hives', 'hive_id') hive?: any;
}
