-- =====================================================
-- TBH Beekeeper Database Health & Size Monitor
-- =====================================================
-- Run this script to get a comprehensive view of your
-- database size, growth trends, and cleanup opportunities
-- =====================================================

-- 1. CURRENT DATABASE SIZE BY TABLE
-- =====================================================
SELECT 
    'DATABASE SIZE BY TABLE' as report_section;

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 2. ROW COUNTS FOR ALL TABLES
-- =====================================================
SELECT 
    'ROW COUNTS' as report_section;

SELECT 
    'users' as table_name, 
    COUNT(*) as total_rows,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as rows_last_30_days,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as rows_last_7_days
FROM users
UNION ALL
SELECT 
    'apiaries',
    COUNT(*),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days'),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM apiaries
UNION ALL
SELECT 
    'hives',
    COUNT(*),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days'),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM hives
UNION ALL
SELECT 
    'inspections',
    COUNT(*),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days'),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM inspections
UNION ALL
SELECT 
    'hive_snapshots',
    COUNT(*),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days'),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM hive_snapshots
UNION ALL
SELECT 
    'interventions',
    COUNT(*),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days'),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM interventions
UNION ALL
SELECT 
    'tasks',
    COUNT(*),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days'),
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')
FROM tasks
ORDER BY total_rows DESC;

-- 3. ESTIMATED GROWTH RATE
-- =====================================================
SELECT 
    'ESTIMATED MONTHLY GROWTH' as report_section;

WITH monthly_growth AS (
    SELECT 
        'inspections' as table_name,
        COUNT(*) as records_last_30_days,
        563 as avg_bytes_per_row
    FROM inspections
    WHERE created_at > NOW() - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        'hive_snapshots',
        COUNT(*),
        998
    FROM hive_snapshots
    WHERE created_at > NOW() - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        'interventions',
        COUNT(*),
        461
    FROM interventions
    WHERE created_at > NOW() - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        'tasks',
        COUNT(*),
        346
    FROM tasks
    WHERE created_at > NOW() - INTERVAL '30 days'
)
SELECT 
    table_name,
    records_last_30_days,
    pg_size_pretty(records_last_30_days * avg_bytes_per_row) as estimated_size_gained,
    pg_size_pretty((records_last_30_days * avg_bytes_per_row * 12)) as projected_annual_growth
FROM monthly_growth
ORDER BY records_last_30_days DESC;

-- 4. INACTIVE USERS (Cleanup Candidates)
-- =====================================================
SELECT 
    'INACTIVE USERS - NO ACTIVITY IN 6+ MONTHS' as report_section;

WITH user_activity AS (
    SELECT 
        u.id,
        u.email,
        u.display_name,
        u.created_at,
        u.updated_at as user_updated_at,
        (SELECT MAX(created_at) 
         FROM inspections i 
         JOIN hives h ON i.hive_id = h.id 
         JOIN apiaries a ON h.apiary_id = a.id 
         WHERE a.user_id = u.id) as last_inspection,
        (SELECT MAX(created_at) 
         FROM tasks t 
         JOIN apiaries a ON t.apiary_id = a.id
         WHERE a.user_id = u.id) as last_task,
        (SELECT MAX(created_at) 
         FROM interventions iv
         JOIN hives h ON iv.hive_id = h.id 
         JOIN apiaries a ON h.apiary_id = a.id 
         WHERE a.user_id = u.id) as last_intervention
    FROM users u
)
SELECT 
    email,
    display_name,
    created_at,
    GREATEST(
        COALESCE(user_updated_at, created_at),
        COALESCE(last_inspection, created_at),
        COALESCE(last_task, created_at),
        COALESCE(last_intervention, created_at)
    ) as last_activity,
    AGE(NOW(), GREATEST(
        COALESCE(user_updated_at, created_at),
        COALESCE(last_inspection, created_at),
        COALESCE(last_task, created_at),
        COALESCE(last_intervention, created_at)
    )) as inactive_duration
FROM user_activity
WHERE GREATEST(
    COALESCE(user_updated_at, created_at),
    COALESCE(last_inspection, created_at),
    COALESCE(last_task, created_at),
    COALESCE(last_intervention, created_at)
) < NOW() - INTERVAL '6 months'
ORDER BY last_activity ASC;

-- 5. OLD COMPLETED TASKS (Cleanup Candidates)
-- =====================================================
SELECT 
    'OLD COMPLETED TASKS - COMPLETED 6+ MONTHS AGO' as report_section;

SELECT 
    COUNT(*) as old_completed_tasks,
    pg_size_pretty(COUNT(*) * 346) as estimated_size,
    MIN(completed_at) as oldest_completion,
    MAX(completed_at) as newest_completion
FROM tasks
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '6 months'
  AND completed_at IS NOT NULL;

-- Show sample of old completed tasks
SELECT 
    id,
    title,
    completed_at,
    AGE(NOW(), completed_at) as age
FROM tasks
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '6 months'
  AND completed_at IS NOT NULL
ORDER BY completed_at ASC
LIMIT 10;

-- 6. OLD SNAPSHOTS (Archive Candidates)
-- =====================================================
SELECT 
    'OLD SNAPSHOTS - 2+ YEARS OLD' as report_section;

SELECT 
    COUNT(*) as old_snapshots,
    pg_size_pretty(COUNT(*) * 998) as estimated_size,
    MIN(created_at) as oldest_snapshot,
    MAX(created_at) as newest_old_snapshot
FROM hive_snapshots
WHERE created_at < NOW() - INTERVAL '2 years';

-- 7. USER STATISTICS
-- =====================================================
SELECT 
    'USER STATISTICS' as report_section;

SELECT 
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT a.id) as total_apiaries,
    ROUND(AVG(apiaries_per_user), 2) as avg_apiaries_per_user,
    COUNT(DISTINCT h.id) as total_hives,
    ROUND(AVG(hives_per_apiary), 2) as avg_hives_per_apiary
FROM users u
LEFT JOIN apiaries a ON a.user_id = u.id
LEFT JOIN hives h ON h.apiary_id = a.id
LEFT JOIN LATERAL (
    SELECT COUNT(*) as apiaries_per_user
    FROM apiaries a2
    WHERE a2.user_id = u.id
) apa ON true
LEFT JOIN LATERAL (
    SELECT COUNT(*) as hives_per_apiary
    FROM hives h2
    WHERE h2.apiary_id = a.id
) hpa ON true;

-- 8. INSPECTION FREQUENCY
-- =====================================================
SELECT 
    'INSPECTION FREQUENCY' as report_section;

WITH hive_inspection_counts AS (
    SELECT 
        h.id as hive_id,
        h.name as hive_name,
        a.name as apiary_name,
        COUNT(i.id) as inspection_count,
        MAX(i.timestamp) as last_inspection,
        MIN(i.timestamp) as first_inspection,
        EXTRACT(EPOCH FROM (MAX(i.timestamp) - MIN(i.timestamp))) / 86400 as days_tracked
    FROM hives h
    LEFT JOIN inspections i ON i.hive_id = h.id
    LEFT JOIN apiaries a ON h.apiary_id = a.id
    WHERE h.is_active = true
    GROUP BY h.id, h.name, a.name
)
SELECT 
    AVG(inspection_count) as avg_inspections_per_hive,
    AVG(inspection_count / NULLIF(days_tracked, 0) * 365) as avg_inspections_per_year,
    MAX(inspection_count) as max_inspections_for_a_hive,
    MIN(inspection_count) as min_inspections_for_a_hive
FROM hive_inspection_counts
WHERE days_tracked > 0;

-- 9. LARGEST INDIVIDUAL RECORDS
-- =====================================================
SELECT 
    'LARGEST INDIVIDUAL RECORDS' as report_section;

-- Largest inspections (by observations text)
SELECT 
    'Large Inspections (by observations)' as record_type,
    id,
    hive_id,
    LENGTH(observations) as text_length,
    pg_size_pretty(LENGTH(observations)) as size,
    timestamp
FROM inspections
WHERE observations IS NOT NULL
ORDER BY LENGTH(observations) DESC
LIMIT 5;

-- Largest hive notes
SELECT 
    'Large Hive Notes' as record_type,
    id,
    name,
    LENGTH(notes) as text_length,
    pg_size_pretty(LENGTH(notes)) as size,
    created_at as timestamp
FROM hives
WHERE notes IS NOT NULL
ORDER BY LENGTH(notes) DESC
LIMIT 5;

-- 10. SUMMARY & RECOMMENDATIONS
-- =====================================================
SELECT 
    'SUMMARY & RECOMMENDATIONS' as report_section;

WITH cleanup_potential AS (
    SELECT 
        (SELECT COUNT(*) FROM tasks 
         WHERE status = 'completed' 
         AND completed_at < NOW() - INTERVAL '6 months') as old_tasks,
        (SELECT COUNT(*) FROM hive_snapshots 
         WHERE created_at < NOW() - INTERVAL '2 years') as old_snapshots,
        (SELECT COUNT(*) 
         FROM users u
         WHERE NOT EXISTS (
             SELECT 1 FROM inspections i 
             JOIN hives h ON i.hive_id = h.id 
             JOIN apiaries a ON h.apiary_id = a.id 
             WHERE a.user_id = u.id 
             AND i.created_at > NOW() - INTERVAL '12 months'
         )
         AND u.created_at < NOW() - INTERVAL '12 months') as inactive_users
)
SELECT 
    'Cleanup Opportunities' as category,
    CONCAT(old_tasks, ' old completed tasks (', 
           pg_size_pretty(old_tasks * 346), ')') as old_tasks,
    CONCAT(old_snapshots, ' old snapshots (', 
           pg_size_pretty(old_snapshots * 998), ')') as old_snapshots,
    CONCAT(inactive_users, ' inactive users') as inactive_users,
    pg_size_pretty((old_tasks * 346) + (old_snapshots * 998)) as total_reclaimable_space
FROM cleanup_potential;

-- =====================================================
-- END OF REPORT
-- =====================================================
