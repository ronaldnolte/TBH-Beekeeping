# RLS Policy Migration - Matching Production

## Summary

I incorrectly wrote the `setup_dev_database.sql` script with granular RLS policies (separate SELECT, INSERT, UPDATE, DELETE) when production uses a simpler ALL policy approach. This caused snapshot deletion (and potentially other operations) to fail in dev.

## What Changed

### Before (My Incorrect Approach)
```sql
-- 4 separate policies for each table
CREATE POLICY "Users can view snapshots..." ON hive_snapshots FOR SELECT ...
CREATE POLICY "Users can insert snapshots..." ON hive_snapshots FOR INSERT ...
CREATE POLICY "Users can update snapshots..." ON hive_snapshots FOR UPDATE ...
CREATE POLICY "Users can delete snapshots..." ON hive_snapshots FOR DELETE ...
```

### After (Matching Production)
```sql
-- 1 simple ALL policy per table
CREATE POLICY "Users manage snapshots in own hives" 
ON hive_snapshots FOR ALL
USING (...) 
WITH CHECK (...);
```

## Changes Made

1. **Updated `setup_dev_database.sql`** - Now uses ALL policies matching production
2. **Created migration script** - `scripts/migrate_policies_to_production_format.sql`
3. **Added error handling** - Better error messages in deletion code

## To Fix Your Dev Database

Run this in your dev/beta Supabase SQL Editor:

```sql
-- File: scripts/migrate_policies_to_production_format.sql
```

This will:
1. Drop all the old granular policies
2. Create new ALL policies that match production exactly
3. Fix snapshot deletion and ensure all operations work correctly

## Why This is Better

**Simpler:**
- 6 policies instead of 24+
- Easier to understand and maintain
- Less code duplication

**Matches Production:**
- Dev and production now have identical policies
- No more surprises when deploying

**More Maintainable:**
- One place to update permissions per table
- Less chance of forgetting to add UPDATE or DELETE

## Future Database Setups

The corrected `setup_dev_database.sql` now matches production, so future dev environments will work correctly from the start.

## Lesson Learned

When creating database setup scripts, always export the actual schema from production rather than writing it by hand. This prevents discrepancies like missing policies or different policy structures.
