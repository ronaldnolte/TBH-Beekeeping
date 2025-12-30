-- =====================================================
-- MIGRATE TASKS TABLE TO SUPPORT USER-SCOPED TASKS
-- =====================================================
-- This script updates the tasks table schema to allow:
-- 1. 'user' scope in addition to 'hive' and 'apiary'
-- 2. NULL apiary_id for user-scoped tasks
-- 
-- Run this in: DEV Supabase SQL Editor ONLY
-- =====================================================

-- Step 1: Drop the existing scope constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_scope_check;

-- Step 2: Add new scope constraint that includes 'user'
ALTER TABLE tasks ADD CONSTRAINT tasks_scope_check 
CHECK (scope IN ('hive', 'apiary', 'user'));

-- Step 3: Make apiary_id nullable
ALTER TABLE tasks ALTER COLUMN apiary_id DROP NOT NULL;

-- =====================================================
-- DONE - Tasks table now supports user-scoped tasks
-- =====================================================

SELECT 'Tasks table migrated to support user-scoped tasks!' as message;
