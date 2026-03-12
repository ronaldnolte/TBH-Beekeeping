# Security Fix: check_hive_access Function

## Issue
Supabase flagged: "Function `public.check_hive_access` has a role mutable search_path"

This is a SQL injection vulnerability where attackers could potentially manipulate the database search path to execute malicious code.

## Solution
The function has been secured by:
1. **Setting a fixed `search_path`** - Prevents manipulation of schema search order
2. **Using `SECURITY DEFINER`** - Runs with controlled permissions
3. **Marking as `STABLE`** - Declares it doesn't modify data

## How to Apply the Fix

### Option 1: Using Supabase SQL Editor (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy the contents of `scripts/fix_check_hive_access_security.sql`
5. Paste into the SQL editor
6. Click **"Run"** or press `Ctrl+Enter`
7. Verify success: You should see "Success. No rows returned"

### Option 2: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push --file scripts/fix_check_hive_access_security.sql
```

## Verification
After running the script:
1. Go to **Database → Reports** in Supabase dashboard
2. Check the **Security** tab
3. The warning about `check_hive_access` should be gone ✅

## What Changed
The function now explicitly sets:
```sql
SET search_path = public, pg_temp
```

This prevents attackers from changing which schema PostgreSQL searches first when resolving table/function names.

## Impact on Your App
- ✅ **No code changes required** - The function signature stays the same
- ✅ **No downtime** - The update is instant
- ✅ **Better security** - Protection against SQL injection via search_path
- ✅ **Same functionality** - The function works exactly as before

---

**Status:** Ready to apply
**Priority:** Medium (fix before public release)
**Estimated time:** 2 minutes
