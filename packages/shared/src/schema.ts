import { appSchema, tableSchema } from '@nozbe/watermelondb';

/**
 * WatermelonDB schema for TBH Beekeeper
 * Version 1: Initial schema
 */
export const schema = appSchema({
    version: 2,
    tables: [
        // Users table
        tableSchema({
            name: 'users',
            columns: [
                { name: 'email', type: 'string', isIndexed: true },
                { name: 'display_name', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Apiaries table
        tableSchema({
            name: 'apiaries',
            columns: [
                { name: 'user_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'zip_code', type: 'string' },
                { name: 'latitude', type: 'number', isOptional: true },
                { name: 'longitude', type: 'number', isOptional: true },
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Hives table
        tableSchema({
            name: 'hives',
            columns: [
                { name: 'apiary_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'bar_count', type: 'number' },
                { name: 'bars', type: 'string', isOptional: true }, // Added: Current bar configuration (JSON)
                { name: 'is_active', type: 'boolean' },
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'last_inspection_date', type: 'number', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Hive Snapshots table
        tableSchema({
            name: 'hive_snapshots',
            columns: [
                { name: 'hive_id', type: 'string', isIndexed: true },
                { name: 'timestamp', type: 'number' },
                { name: 'bars', type: 'string' }, // JSON
                { name: 'inactive_bar_count', type: 'number' },
                { name: 'active_bar_count', type: 'number' },
                { name: 'empty_bar_count', type: 'number' },
                { name: 'brood_bar_count', type: 'number' },
                { name: 'resource_bar_count', type: 'number' },
                { name: 'follower_board_position', type: 'number', isOptional: true },
                { name: 'weather', type: 'string', isOptional: true }, // JSON
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Inspections table
        tableSchema({
            name: 'inspections',
            columns: [
                { name: 'hive_id', type: 'string', isIndexed: true },
                { name: 'timestamp', type: 'number' },
                { name: 'queen_status', type: 'string' },
                { name: 'brood_pattern', type: 'string', isOptional: true },
                { name: 'population_strength', type: 'string', isOptional: true },
                { name: 'temperament', type: 'string', isOptional: true },
                { name: 'honey_stores', type: 'string', isOptional: true },
                { name: 'pollen_stores', type: 'string', isOptional: true },
                { name: 'observations', type: 'string', isOptional: true },
                { name: 'snapshot_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'weather', type: 'string', isOptional: true }, // JSON
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Interventions table
        tableSchema({
            name: 'interventions',
            columns: [
                { name: 'hive_id', type: 'string', isIndexed: true },
                { name: 'timestamp', type: 'number' },
                { name: 'type', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'inspection_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'weather', type: 'string', isOptional: true }, // JSON
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Tasks table
        tableSchema({
            name: 'tasks',
            columns: [
                { name: 'scope', type: 'string' },
                { name: 'apiary_id', type: 'string', isIndexed: true },
                { name: 'hive_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'due_date', type: 'number', isOptional: true },
                { name: 'status', type: 'string' },
                { name: 'priority', type: 'string' },
                { name: 'assigned_user_id', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'completed_at', type: 'number', isOptional: true },
            ],
        }),

        // Weather Forecasts table
        tableSchema({
            name: 'weather_forecasts',
            columns: [
                { name: 'apiary_id', type: 'string', isIndexed: true },
                { name: 'date_time', type: 'number' },
                { name: 'temperature', type: 'number' },
                { name: 'wind_speed', type: 'number' },
                { name: 'precipitation', type: 'number' },
                { name: 'humidity', type: 'number' },
                { name: 'cloud_cover', type: 'number' },
                { name: 'inspection_score', type: 'number' },
                { name: 'inspection_suitability', type: 'string' },
                { name: 'score_breakdown', type: 'string', isOptional: true },
                { name: 'fetched_at', type: 'number' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
    ],
});
