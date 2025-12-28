-- =====================================================
-- TBH Beekeeper Database Cleanup Script
-- =====================================================
-- ⚠️  WARNING: This script performs DELETE operations
-- ⚠️  Always backup your database before running
-- ⚠️  Review the DRY RUN queries before uncommenting DELETE statements
-- =====================================================

-- =====================================================
-- 1. CLEANUP OLD COMPLETED TASKS
-- =====================================================
-- Removes tasks that were completed more than 6 months ago
-- These are no longer actionable and can be safely removed

-- DRY RUN: See what would be deleted
SELECT 
    'DRY RUN: Old Completed Tasks to Delete' as action,
    COUNT(*) as records_to_delete,
    pg_size_pretty(COUNT(*) * 346) as space_to_reclaim
FROM tasks
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '6 months'
  AND completed_at IS NOT NULL;

-- Show sample records
SELECT 
    id,
    title, 
    status,
    completed_at,
    AGE(NOW(), completed_at) as age
FROM tasks
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '6 months'
  AND completed_at IS NOT NULL
ORDER BY completed_at ASC
LIMIT 10;

-- ACTUAL DELETE (uncomment to execute)
-- DELETE FROM tasks
-- WHERE status = 'completed'
--   AND completed_at < NOW() - INTERVAL '6 months'
--   AND completed_at IS NOT NULL;

-- =====================================================
-- 2. ARCHIVE OLD SNAPSHOTS (2+ years)
-- =====================================================
-- Creates an archive table and moves old snapshots
-- This preserves historical data while reducing main table size

-- DRY RUN: See what would be archived
SELECT 
    'DRY RUN: Old Snapshots to Archive' as action,
    COUNT(*) as records_to_archive,
    pg_size_pretty(COUNT(*) * 998) as space_to_reclaim,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM hive_snapshots
WHERE created_at < NOW() - INTERVAL '2 years';

-- Create archive table (if it doesn't exist)
-- CREATE TABLE IF NOT EXISTS archived_hive_snapshots (
--     LIKE hive_snapshots INCLUDING ALL
-- );

-- Add archive metadata
-- ALTER TABLE archived_hive_snapshots 
-- ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP DEFAULT NOW();

-- ACTUAL ARCHIVE (uncomment to execute)
-- -- Copy to archive
-- INSERT INTO archived_hive_snapshots 
-- SELECT *, NOW() as archived_at
-- FROM hive_snapshots
-- WHERE created_at < NOW() - INTERVAL '2 years';
-- 
-- -- Delete from main table
-- DELETE FROM hive_snapshots
-- WHERE created_at < NOW() - INTERVAL '2 years';

-- =====================================================
-- 3. CLEANUP CANCELLED TASKS (old)
-- =====================================================
-- Removes cancelled tasks older than 3 months

-- DRY RUN
SELECT 
    'DRY RUN: Old Cancelled Tasks to Delete' as action,
    COUNT(*) as records_to_delete,
    pg_size_pretty(COUNT(*) * 346) as space_to_reclaim
FROM tasks
WHERE status = 'cancelled'
  AND updated_at < NOW() - INTERVAL '3 months';

-- ACTUAL DELETE (uncomment to execute)
-- DELETE FROM tasks
-- WHERE status = 'cancelled'
--   AND updated_at < NOW() - INTERVAL '3 months';

-- =====================================================
-- 4. CLEANUP ORPHANED TASKS
-- =====================================================
-- Removes tasks attached to deleted apiaries or hives

-- DRY RUN: Find orphaned tasks
SELECT 
    'DRY RUN: Orphaned Tasks to Delete' as action,
    COUNT(*) as records_to_delete
FROM tasks t
WHERE NOT EXISTS (
    SELECT 1 FROM apiaries a WHERE a.id = t.apiary_id
);

-- Show sample orphaned tasks
SELECT 
    id,
    title,
    apiary_id,
    hive_id,
    created_at
FROM tasks t
WHERE NOT EXISTS (
    SELECT 1 FROM apiaries a WHERE a.id = t.apiary_id
)
LIMIT 10;

-- ACTUAL DELETE (uncomment to execute)
-- DELETE FROM tasks t
-- WHERE NOT EXISTS (
--     SELECT 1 FROM apiaries a WHERE a.id = t.apiary_id
-- );

-- =====================================================
-- 5. SOFT DELETE INACTIVE USERS
-- =====================================================
-- Marks users as deleted if they haven't been active in 12+ months
-- Preserves data integrity with foreign keys

-- First, add soft delete column if it doesn't exist
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- DRY RUN: Find users to soft delete
WITH user_activity AS (
    SELECT 
        u.id,
        u.email,
        u.created_at,
        GREATEST(
            COALESCE(u.updated_at, u.created_at),
            COALESCE((SELECT MAX(created_at) 
                      FROM inspections i 
                      JOIN hives h ON i.hive_id = h.id 
                      JOIN apiaries a ON h.apiary_id = a.id 
                      WHERE a.user_id = u.id), u.created_at),
            COALESCE((SELECT MAX(created_at) 
                      FROM tasks t 
                      JOIN apiaries a ON t.apiary_id = a.id
                      WHERE a.user_id = u.id), u.created_at),
            COALESCE((SELECT MAX(created_at) 
                      FROM interventions iv
                      JOIN hives h ON iv.hive_id = h.id 
                      JOIN apiaries a ON h.apiary_id = a.id 
                      WHERE a.user_id = u.id), u.created_at)
        ) as last_activity
    FROM users u
    -- WHERE u.deleted_at IS NULL  -- Uncomment if soft delete column exists
)
SELECT 
    'DRY RUN: Inactive Users to Soft Delete' as action,
    COUNT(*) as users_to_mark_deleted,
    email,
    last_activity,
    AGE(NOW(), last_activity) as inactive_for
FROM user_activity
WHERE last_activity < NOW() - INTERVAL '12 months'
GROUP BY email, last_activity
ORDER BY last_activity ASC;

-- ACTUAL SOFT DELETE (uncomment to execute)
-- WITH user_activity AS (
--     SELECT 
--         u.id,
--         GREATEST(
--             COALESCE(u.updated_at, u.created_at),
--             COALESCE((SELECT MAX(created_at) 
--                       FROM inspections i 
--                       JOIN hives h ON i.hive_id = h.id 
--                       JOIN apiaries a ON h.apiary_id = a.id 
--                       WHERE a.user_id = u.id), u.created_at),
--             COALESCE((SELECT MAX(created_at) 
--                       FROM tasks t 
--                       JOIN apiaries a ON t.apiary_id = a.id
--                       WHERE a.user_id = u.id), u.created_at),
--             COALESCE((SELECT MAX(created_at) 
--                       FROM interventions iv
--                       JOIN hives h ON iv.hive_id = h.id 
--                       JOIN apiaries a ON h.apiary_id = a.id 
--                       WHERE a.user_id = u.id), u.created_at)
--         ) as last_activity
--     FROM users u
--     WHERE u.deleted_at IS NULL
-- )
-- UPDATE users u
-- SET deleted_at = NOW()
-- FROM user_activity ua
-- WHERE u.id = ua.id
--   AND ua.last_activity < NOW() - INTERVAL '12 months';

-- =====================================================
-- 6. VACUUM AND ANALYZE (After Cleanup)
-- =====================================================
-- Reclaim disk space and update statistics

-- Run this after performing deletions to actually reclaim space
-- VACUUM FULL ANALYZE tasks;
-- VACUUM FULL ANALYZE hive_snapshots;
-- VACUUM FULL ANALYZE users;

-- Or for all tables (less aggressive, but safer for production)
-- VACUUM ANALYZE;

-- =====================================================
-- 7. VERIFY CLEANUP RESULTS
-- =====================================================
-- Run this to see the impact of cleanup

SELECT 
    'Post-Cleanup Table Sizes' as report;

SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'apiaries', 'hives', 'inspections', 
                     'hive_snapshots', 'interventions', 'tasks')
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- =====================================================
-- RECOMMENDED SCHEDULE
-- =====================================================
-- Run this script monthly or quarterly depending on activity:
-- 
-- 1. Review DRY RUN sections first
-- 2. Uncomment and execute sections you approve
-- 3. Run VACUUM ANALYZE to reclaim space
-- 4. Monitor database size trends
--
-- Always maintain backups before running cleanup operations!
-- =====================================================
