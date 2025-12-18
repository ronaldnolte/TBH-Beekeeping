import { database } from './database';
import { Q } from '@nozbe/watermelondb';

export async function seedDatabase() {
    const usersCount = await database.get('users').query().fetchCount();

    if (usersCount > 0) {
        console.log('Database already seeded');
        return;
    }

    // SEEDING DISABLED: We are moving to real Supabase Auth.
    // Users should sign up to create their account and data.

    // await database.write(async () => {
    //    ... (Legacy Seeding Logic)
    // });
    console.log('Seeding skipped (Supabase Mode)');
}


// Force delete all records
// Force delete all records
export async function resetAndSeed() {
    console.log('☢️ Starting Nuclear Option...');

    try {
        // 1. Wipe all data manually
        await database.write(async () => {
            const tables = ['users', 'apiaries', 'hives', 'hive_snapshots', 'inspections', 'interventions', 'tasks', 'weather_forecasts'];

            for (const table of tables) {
                const collection = database.get(table);
                const allRecords = await collection.query().fetch();
                // Using loop for safety, batch() would be faster but more complex to setup here
                for (const record of allRecords) {
                    await record.destroyPermanently();
                }
            }
        });

        console.log('All tables wiped.');

        // 2. Run Seed (it has its own transaction)
        await seedDatabase();

        console.log('Reset complete.');
        alert("Database has been reset and re-seeded. Reloading to refresh view...");
        window.location.reload();

    } catch (e) {
        console.error('Reset failed:', e);
        alert('Reset failed. Check console.');
    }
}
