import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

/**
 * User model for authentication and data ownership
 */
export default class User extends Model {
    static table = 'users';

    @field('email') email!: string;
    @field('display_name') displayName?: string;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}
