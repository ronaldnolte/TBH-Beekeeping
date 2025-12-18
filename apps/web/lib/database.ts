import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from '@tbh-beekeeper/shared';
// Import all models from shared
import {
    Apiary,
    Hive,
    HiveSnapshot,
    Inspection,
    Intervention,
    Task,
    User,
    WeatherForecast
} from '@tbh-beekeeper/shared';

const adapter = new LokiJSAdapter({
    schema,
    // (You might want to comment out migrations if you haven't created them yet)
    // migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    extraLokiOptions: {
        autosave: true,
        autosaveInterval: 1000,
    },
    // dbName: 'tbh_beekeeper', // optional name, defaults to 'watermelon'

    // Called when the database failed to load/setup, e.g. because of newer
    // browser schema versions.
    onSetUpError: error => {
        // Database failed to load -- consider resetting it
        console.error('Database setup failed', error);
    }
});

export const database = new Database({
    adapter,
    modelClasses: [
        Apiary,
        Hive,
        HiveSnapshot,
        Inspection,
        Intervention,
        Task,
        User,
        WeatherForecast,
    ],
});

// Debug singleton instance
const dbId = Math.random().toString(36).substring(7);
console.log(`[Database] Initialized instance: ${dbId}`);
// @ts-ignore
if (typeof window !== 'undefined') {
    // @ts-ignore
    window._db = database;
    // @ts-ignore
    window._dbId = dbId;
}
