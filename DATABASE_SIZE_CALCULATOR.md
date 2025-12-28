# TBH Beekeeper Database Size Calculator

## Overview
This document provides formulas and calculations to estimate database size as your user base and data grow. It includes cleanup strategies to manage database growth over time.

## Database Schema Summary

### Core Tables
1. **users** - User accounts
2. **apiaries** - Beekeeping locations (multiple per user)
3. **hives** - Individual hives (multiple per apiary)
4. **hive_snapshots** - Point-in-time hive state records
5. **inspections** - Detailed hive inspections
6. **interventions** - Actions taken on hives
7. **tasks** - To-do items for apiaries/hives
8. **weather_forecasts** - Cached weather data (if used)

---

## Size Estimation Formulas

### 1. Users Table
**Fields:**
- `id` (UUID): 16 bytes
- `email` (VARCHAR): ~30 bytes average
- `display_name` (VARCHAR): ~25 bytes average
- `created_at` (TIMESTAMP): 8 bytes
- `updated_at` (TIMESTAMP): 8 bytes
- PostgreSQL row overhead: ~24 bytes

**Row Size:** ~111 bytes per user  
**Formula:** `Users × 111 bytes`

---

### 2. Apiaries Table
**Fields:**
- `id` (UUID): 16 bytes
- `user_id` (UUID): 16 bytes
- `name` (VARCHAR): ~30 bytes average
- `zip_code` (VARCHAR): ~10 bytes
- `latitude` (NUMERIC): 8 bytes
- `longitude` (NUMERIC): 8 bytes
- `notes` (TEXT): ~100 bytes average (optional)
- `created_at` (TIMESTAMP): 8 bytes
- `updated_at` (TIMESTAMP): 8 bytes
- PostgreSQL row overhead: ~24 bytes

**Row Size:** ~228 bytes per apiary  
**Formula:** `Users × Apiaries_per_user × 228 bytes`

---

### 3. Hives Table
**Fields:**
- `id` (UUID): 16 bytes
- `apiary_id` (UUID): 16 bytes
- `name` (VARCHAR): ~20 bytes
- `bar_count` (INTEGER): 4 bytes
- `is_active` (BOOLEAN): 1 byte
- `notes` (TEXT): ~100 bytes average (optional)
- `bars` (JSONB): ~600 bytes (assuming 24 bars × 25 bytes each)
- `last_inspection_date` (TIMESTAMP): 8 bytes
- `created_at` (TIMESTAMP): 8 bytes
- `updated_at` (TIMESTAMP): 8 bytes
- PostgreSQL row overhead: ~24 bytes

**Row Size:** ~805 bytes per hive  
**Formula:** `Users × Apiaries_per_user × Hives_per_apiary × 805 bytes`

---

### 4. Hive Snapshots Table
**Fields:**
- `id` (UUID): 16 bytes
- `hive_id` (UUID): 16 bytes
- `timestamp` (TIMESTAMP): 8 bytes
- `bars` (JSONB): ~600 bytes (24 bars)
- `inactive_bar_count` (INTEGER): 4 bytes
- `active_bar_count` (INTEGER): 4 bytes
- `empty_bar_count` (INTEGER): 4 bytes
- `brood_bar_count` (INTEGER): 4 bytes
- `resource_bar_count` (INTEGER): 4 bytes
- `follower_board_position` (INTEGER): 4 bytes
- `weather` (JSONB): ~200 bytes (optional)
- `notes` (TEXT): ~100 bytes average (optional)
- `created_at` (TIMESTAMP): 8 bytes
- `updated_at` (TIMESTAMP): 8 bytes
- PostgreSQL row overhead: ~24 bytes

**Row Size:** ~998 bytes per snapshot (~1 KB)  
**Formula:** `Total_hives × Snapshots_per_hive_per_year × Years × 998 bytes`

---

### 5. Inspections Table
**Fields:**
- `id` (UUID): 16 bytes
- `hive_id` (UUID): 16 bytes
- `timestamp` (TIMESTAMP): 8 bytes
- `queen_status` (VARCHAR): ~15 bytes
- `brood_pattern` (VARCHAR): ~10 bytes
- `population_strength` (VARCHAR): ~10 bytes
- `temperament` (VARCHAR): ~12 bytes
- `honey_stores` (VARCHAR): ~10 bytes
- `pollen_stores` (VARCHAR): ~10 bytes
- `observations` (TEXT): ~200 bytes average
- `snapshot_id` (UUID): 16 bytes
- `weather` (JSONB): ~200 bytes
- `created_at` (TIMESTAMP): 8 bytes
- `updated_at` (TIMESTAMP): 8 bytes
- PostgreSQL row overhead: ~24 bytes

**Row Size:** ~563 bytes per inspection  
**Formula:** `Total_hives × Inspections_per_hive_per_year × Years × 563 bytes`

---

### 6. Interventions Table
**Fields:**
- `id` (UUID): 16 bytes
- `hive_id` (UUID): 16 bytes
- `timestamp` (TIMESTAMP): 8 bytes
- `type` (VARCHAR): ~15 bytes
- `description` (TEXT): ~150 bytes average
- `inspection_id` (UUID): 16 bytes
- `weather` (JSONB): ~200 bytes
- `created_at` (TIMESTAMP): 8 bytes
- `updated_at` (TIMESTAMP): 8 bytes
- PostgreSQL row overhead: ~24 bytes

**Row Size:** ~461 bytes per intervention  
**Formula:** `Total_hives × Interventions_per_hive_per_year × Years × 461 bytes`

---

### 7. Tasks Table
**Fields:**
- `id` (UUID): 16 bytes
- `scope` (VARCHAR): ~10 bytes
- `apiary_id` (UUID): 16 bytes
- `hive_id` (UUID): 16 bytes
- `title` (VARCHAR): ~50 bytes
- `description` (TEXT): ~150 bytes average
- `due_date` (TIMESTAMP): 8 bytes
- `status` (VARCHAR): ~12 bytes
- `priority` (VARCHAR): ~8 bytes
- `assigned_user_id` (UUID): 16 bytes
- `created_at` (TIMESTAMP): 8 bytes
- `updated_at` (TIMESTAMP): 8 bytes
- `completed_at` (TIMESTAMP): 8 bytes
- PostgreSQL row overhead: ~24 bytes

**Row Size:** ~346 bytes per task  
**Formula:** `Users × Active_tasks_per_user × 346 bytes`

---

## Example Calculation: 100 Users

### Assumptions
- 100 users
- Each user has 1 apiary (on average)
- Each apiary has 3.5 hives (average of 3-4)
- Each hive gets:
  - 12 inspections per year (monthly)
  - 3 interventions per year
  - 4 tasks created per year (some completed, some active)
  - 12 snapshots per year (one per inspection)
- Operating for 1 year

### Calculations

| Table | Formula | Size |
|-------|---------|------|
| **Users** | 100 × 111 bytes | 11.1 KB |
| **Apiaries** | 100 × 1 × 228 bytes | 22.8 KB |
| **Hives** | 100 × 1 × 3.5 × 805 bytes | 281.75 KB |
| **Inspections** | 350 hives × 12 × 563 bytes | 2.37 MB |
| **Snapshots** | 350 hives × 12 × 998 bytes | 4.19 MB |
| **Interventions** | 350 hives × 3 × 461 bytes | 484.05 KB |
| **Tasks** | 100 users × 10 active × 346 bytes | 346 KB |
| **Indexes** | ~30% overhead | ~2.4 MB |

### **Total Year 1:** ~9.8 MB

### **Total Year 2:** ~19.6 MB (cumulative)
### **Total Year 3:** ~29.4 MB (cumulative)

---

## Growth Projections

### Conservative (100 users, 3-4 hives each)
| Year | Total Size | Growth |
|------|------------|--------|
| 1 | 9.8 MB | +9.8 MB |
| 2 | 19.6 MB | +9.8 MB |
| 3 | 29.4 MB | +9.8 MB |
| 5 | 49 MB | ~10 MB/year |

### Medium (500 users, 3-4 hives each)
| Year | Total Size | Growth |
|------|------------|--------|
| 1 | 49 MB | +49 MB |
| 2 | 98 MB | +49 MB |
| 3 | 147 MB | +49 MB |
| 5 | 245 MB | ~49 MB/year |

### Large (1,000 users, 3-4 hives each)
| Year | Total Size | Growth |
|------|------------|--------|
| 1 | 98 MB | +98 MB |
| 2 | 196 MB | +98 MB |
| 3 | 294 MB | +98 MB |
| 5 | 490 MB | ~98 MB/year |

### Enterprise (10,000 users, 3-4 hives each)
| Year | Total Size | Growth |
|------|------------|--------|
| 1 | 980 MB (~1 GB) | +980 MB |
| 2 | 1.96 GB | +980 MB |
| 3 | 2.94 GB | +980 MB |
| 5 | 4.9 GB | ~1 GB/year |

---

## Database Cleanup Strategies

### 1. Inactive User Cleanup
**Criteria:** Users who haven't logged in for 12+ months

```sql
-- Find inactive users
SELECT 
    u.id,
    u.email,
    u.created_at,
    MAX(GREATEST(
        u.updated_at,
        (SELECT MAX(created_at) FROM inspections i 
         JOIN hives h ON i.hive_id = h.id 
         JOIN apiaries a ON h.apiary_id = a.id 
         WHERE a.user_id = u.id),
        (SELECT MAX(created_at) FROM tasks t 
         WHERE t.assigned_user_id = u.id)
    )) as last_activity
FROM users u
GROUP BY u.id
HAVING MAX(GREATEST(
    u.updated_at,
    COALESCE((SELECT MAX(created_at) FROM inspections i 
     JOIN hives h ON i.hive_id = h.id 
     JOIN apiaries a ON h.apiary_id = a.id 
     WHERE a.user_id = u.id), u.updated_at),
    COALESCE((SELECT MAX(created_at) FROM tasks t 
     WHERE t.assigned_user_id = u.id), u.updated_at)
)) < NOW() - INTERVAL '12 months';
```

**Actions:**
1. Send warning email at 11 months
2. Archive data at 12 months (optional)
3. Delete at 13 months (with user consent via ToS)

**Estimated Savings:** ~98 KB per inactive user (1 year of data)

---

### 2. Completed Task Cleanup
**Criteria:** Tasks completed more than 6 months ago

```sql
-- Delete old completed tasks
DELETE FROM tasks
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '6 months';
```

**Estimated Savings:** ~173 KB per 500 completed tasks

---

### 3. Old Snapshot Retention Policy
**Criteria:** Keep only snapshots from the last 2 years

```sql
-- Archive old snapshots to separate table
CREATE TABLE archived_hive_snapshots AS
SELECT * FROM hive_snapshots
WHERE created_at < NOW() - INTERVAL '2 years';

-- Delete archived snapshots from main table
DELETE FROM hive_snapshots
WHERE created_at < NOW() - INTERVAL '2 years';
```

**Estimated Savings:** For 350 hives with 12 snapshots/year: ~4.2 MB per year archived

---

### 4. Weather Forecast Cleanup
**Criteria:** Delete forecasts older than 7 days

```sql
-- Delete old weather forecasts
DELETE FROM weather_forecasts
WHERE created_at < NOW() - INTERVAL '7 days';
```

**Estimated Savings:** Prevents unbounded growth in forecast cache

---

### 5. Soft Delete Strategy
Instead of hard deletes, consider soft deletes for audit trails:

```sql
-- Add deleted_at column to tables
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE apiaries ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE hives ADD COLUMN deleted_at TIMESTAMP;

-- Soft delete instead of hard delete
UPDATE users SET deleted_at = NOW() WHERE id = 'user_id';

-- Exclude soft-deleted records in queries
SELECT * FROM users WHERE deleted_at IS NULL;
```

---

## Monitoring Queries

### Current Database Size
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Row Counts
```sql
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'apiaries', COUNT(*) FROM apiaries
UNION ALL
SELECT 'hives', COUNT(*) FROM hives
UNION ALL
SELECT 'inspections', COUNT(*) FROM inspections
UNION ALL
SELECT 'hive_snapshots', COUNT(*) FROM hive_snapshots
UNION ALL
SELECT 'interventions', COUNT(*) FROM interventions
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
ORDER BY row_count DESC;
```

### Growth Rate (Last 30 Days)
```sql
SELECT 
    'inspections' as table_name,
    COUNT(*) as new_records,
    pg_size_pretty(COUNT(*) * 563) as estimated_size
FROM inspections
WHERE created_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
    'hive_snapshots',
    COUNT(*),
    pg_size_pretty(COUNT(*) * 998)
FROM hive_snapshots
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## Recommended Cleanup Schedule

| Frequency | Action | Target |
|-----------|--------|--------|
| **Daily** | Clean weather forecasts | > 7 days old |
| **Weekly** | Archive completed tasks | > 6 months old |
| **Monthly** | Check for inactive users | > 11 months inactive |
| **Quarterly** | Archive old snapshots | > 2 years old |
| **Annually** | Full database review | Optimization opportunities |

---

## Additional Optimization Strategies

### 1. Partitioning
For tables that grow large (snapshots, inspections), consider partitioning by date:

```sql
-- Example: Partition snapshots by year
CREATE TABLE hive_snapshots_2024 PARTITION OF hive_snapshots
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### 2. Compression
PostgreSQL supports TOAST compression for large text fields. Ensure it's enabled:

```sql
ALTER TABLE inspections ALTER COLUMN observations SET STORAGE EXTENDED;
ALTER TABLE hives ALTER COLUMN notes SET STORAGE EXTENDED;
```

### 3. Index Optimization
Only create indexes you actually use. Review unused indexes:

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexname::regclass) DESC;
```

---

## Supabase-Specific Considerations

### Storage Limits
- **Free Tier:** 500 MB database
- **Pro Tier:** 8 GB included, $0.125/GB additional
- **Team Tier:** 100 GB included

### Your Projected Costs (Pro Tier)
- **100 users:** ~50 MB/year → Stay within free limit for 10+ years
- **500 users:** ~245 MB/year → Stay within free limit for 3+ years
- **1,000 users:** ~490 MB/year → Stay within free limit for 18 months
- **10,000 users:** ~4.9 GB/year → Need additional storage after 1 year (~$0.50/month extra in year 2)

---

## Conclusion

Based on your schema and usage patterns:

✅ **100 users with 3-4 hives each = ~10 MB/year**  
✅ Database growth is very manageable  
✅ Cleanup strategies can reduce growth by 30-40%  
✅ Even at 10,000 users, costs remain minimal (<$1/month for storage)

Your database is well-designed for efficient storage. The biggest tables (snapshots and inspections) are the primary growth drivers, but they're essential for your app's functionality. With sensible retention policies, you can maintain a lean database indefinitely.
