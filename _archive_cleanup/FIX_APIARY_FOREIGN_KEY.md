# Fix: Foreign Key Constraint Violation on Apiary Creation

## Problem

When testing the beta environment, attempting to create an apiary fails with:
```
Failed to save apiary: insert or update on table "apiaries" violates 
foreign key constraint "apiaries_user_id_fkey"
```

## Root Cause

The application has two user tables:
1. **`auth.users`** - Supabase Auth system (created automatically on signup)
2. **`public.users`** - Your application's user table (referenced by apiaries)

When users sign up, Supabase creates a record in `auth.users`, but there's no automatic trigger to create a corresponding record in `public.users`. This means:
- User signs up → Gets `auth.users` record ✓
- User tries to create apiary → Fails because `public.users` has no matching user_id ✗

## Solution

Add a database trigger that automatically creates a `public.users` record whenever someone signs up.

### Step 1: Run the Migration on Your Beta Database

1. Go to your **beta/dev Supabase project** dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/add_user_creation_trigger.sql`
4. Click **Run**

Alternatively, you can use the updated `scripts/setup_dev_database.sql` which now includes this trigger.

### Step 2: Fix Existing Users (Manual)

If you've already created test accounts that don't have `public.users` records, you'll need to add them manually:

```sql
-- Check which auth users are missing from public.users
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Insert missing user records
INSERT INTO public.users (id, email, display_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'display_name' as display_name,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
```

### Step 3: Test

1. Try creating an apiary again with your existing account
2. If still failing, sign up a new test account and verify:
   - New account can be created
   - New account can immediately create apiaries

## What the Trigger Does

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,           -- Same ID as auth.users
    NEW.email,        -- Copy email
    NEW.raw_user_meta_data->>'display_name',  -- Extract display name from metadata
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

This ensures every new signup automatically creates both:
1. Auth user (handled by Supabase Auth)
2. Public user record (handled by this trigger)

## Production Deployment

When deploying to production, make sure to:
1. Run the same migration on your production Supabase database
2. Insert any missing user records from existing users
3. Test with a new account before announcing to users

## Future Prevention

This trigger is now included in the `setup_dev_database.sql` script, so any future database setups will automatically include it.
