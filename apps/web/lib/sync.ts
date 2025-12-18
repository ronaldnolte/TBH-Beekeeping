import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from './database';
import { supabase } from './supabase';

const TABLES = [
    'apiaries',
    'hives',
    'inspections',
    'interventions',
    'hive_snapshots',
    'tasks',
    // 'users' - mostly read-only/profile, handled separately or carefully
];

export async function sync() {
    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
            console.log(`[Sync] Pulling changes since ${lastPulledAt || 'forever'}...`);

            const changes: any = {};
            const timestamp = Date.now(); // WatermelonDB expects number (epoch)

            // 1. Pull changes for each table
            // In a real production app, you'd want a single RPC call to get all changes at once.
            // For this MVP, we will query each table individually.
            for (const table of TABLES) {
                let query = supabase.from(table).select('*');

                if (lastPulledAt) {
                    // Get strictly newer items
                    query = query.gt('updated_at', new Date(lastPulledAt).toISOString());
                }

                const { data, error } = await query;
                if (error) throw new Error(`[Sync] Failed to pull ${table}: ${error.message}`);

                // Segregate created/updated vs deleted
                // Note: Supabase Soft Delete convention usually keeps them in the main table with deleted_at set.
                // WatermelonDB expects: { created: [], updated: [], deleted: [] }
                const created: any[] = [];
                const updated: any[] = [];
                const deleted: any[] = [];

                data.forEach((row: any) => {
                    // @ts-ignore
                    if (row.deleted_at) {
                        deleted.push(row.id);
                    } else if (new Date(row.created_at).getTime() > (lastPulledAt || 0)) {
                        created.push(row);
                    } else {
                        updated.push(row);
                    }
                });

                changes[table] = { created, updated, deleted };
            }

            return { changes, timestamp };
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
            console.log(`[Sync] Pushing changes...`);

            // Get current user to effectively "claim" all pushed local data
            const { data: { session } } = await supabase.auth.getSession();
            const currentUserId = session?.user?.id;

            for (const table of TABLES) {
                if (!(changes as any)[table]) continue;
                const { created, updated, deleted } = (changes as any)[table];

                // 1. Create
                if (created.length > 0) {
                    console.log(`[Sync] Creating ${created.length} in ${table}`);
                    // Use Upsert even for 'created' to handle retry cases (Idempotency)
                    const { error } = await supabase.from(table).upsert(created.map((row: any) => {
                        const { _status, _changed, ...rest } = row;

                        // Overwrite user_id if present (Migration Strategy)
                        if (currentUserId && Object.prototype.hasOwnProperty.call(rest, 'user_id')) {
                            rest.user_id = currentUserId;
                        }
                        if (currentUserId && Object.prototype.hasOwnProperty.call(rest, 'assigned_user_id')) {
                            rest.assigned_user_id = currentUserId;
                        }

                        // Convert timestamps to ISO string for Supabase
                        const dateFields = ['created_at', 'updated_at', 'last_inspection_date', 'due_date', 'completed_at', 'date_time', 'fetched_at', 'timestamp'];
                        dateFields.forEach(field => {
                            if (typeof rest[field] === 'number') rest[field] = new Date(rest[field]).toISOString();
                        });
                        return rest;
                    }));
                    if (error) throw new Error(`[Sync] Push Create Env failed: ${error.message}`);
                }

                // 2. Update
                if (updated.length > 0) {
                    console.log(`[Sync] Updating ${updated.length} in ${table}`);
                    const { error } = await supabase.from(table).upsert(updated.map((row: any) => {
                        const { _status, _changed, ...rest } = row;

                        // Overwrite user_id if present
                        if (currentUserId && Object.prototype.hasOwnProperty.call(rest, 'user_id')) {
                            rest.user_id = currentUserId;
                        }
                        if (currentUserId && Object.prototype.hasOwnProperty.call(rest, 'assigned_user_id')) {
                            rest.assigned_user_id = currentUserId;
                        }

                        // Convert timestamps to ISO string for Supabase
                        const dateFields = ['created_at', 'updated_at', 'last_inspection_date', 'due_date', 'completed_at', 'date_time', 'fetched_at', 'timestamp'];
                        dateFields.forEach(field => {
                            if (typeof rest[field] === 'number') rest[field] = new Date(rest[field]).toISOString();
                        });
                        return rest;
                    }));
                    if (error) throw new Error(`[Sync] Push Update Env failed: ${error.message}`);
                }

                // 3. Delete
                if (deleted.length > 0) {
                    // We perform Soft Delete by updating `deleted_at`
                    // WatermelonDB gives us IDs for deleted records
                    console.log(`[Sync] Deleting ${deleted.length} in ${table}`);
                    const now = new Date().toISOString();
                    // We must update each one or use an 'in' query if we can batch update with same value
                    const { error } = await supabase.from(table)
                        .update({ deleted_at: now })
                        .in('id', deleted);

                    if (error) throw new Error(`[Sync] Push Delete Env failed: ${error.message}`);
                }
            }
        },
        // Advanced options
        // migrationsEnabledAtVersion: 1,
    });
}
