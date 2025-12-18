import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '@tbh-beekeeper/shared';
import User from '@tbh-beekeeper/shared/src/models/User';
import Apiary from '@tbh-beekeeper/shared/src/models/Apiary';
import Hive from '@tbh-beekeeper/shared/src/models/Hive';
import HiveSnapshot from '@tbh-beekeeper/shared/src/models/HiveSnapshot';
import Inspection from '@tbh-beekeeper/shared/src/models/Inspection';
import Intervention from '@tbh-beekeeper/shared/src/models/Intervention';
import Task from '@tbh-beekeeper/shared/src/models/Task';
import WeatherForecast from '@tbh-beekeeper/shared/src/models/WeatherForecast';

// Configure the SQLite adapter for mobile
const adapter = new SQLiteAdapter({
    schema,
    dbName: 'tbh_beekeeper',
    jsi: true, // Use JSI for better performance
});

// Initialize the database
export const database = new Database({
    adapter,
    modelClasses: [
        User,
        Apiary,
        Hive,
        HiveSnapshot,
        Inspection,
        Intervention,
        Task,
        WeatherForecast,
    ],
});
