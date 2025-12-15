import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, children, relation } from '@nozbe/watermelondb/decorators';

/**
 * Apiary model - Container for hives and weather lookup
 */
export default class Apiary extends Model {
    static table = 'apiaries';

    @field('user_id') userId!: string;
    @field('name') name!: string;
    @field('zip_code') zipCode!: string;
    @field('latitude') latitude?: number;
    @field('longitude') longitude?: number;
    @field('notes') notes?: string;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @children('hives') hives: any;
    @relation('users', 'user_id') user: any;
}
