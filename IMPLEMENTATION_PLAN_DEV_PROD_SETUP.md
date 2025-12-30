# Dev/Prod Setup & Roles Feature Implementation Plan
**Date Created:** December 28, 2025  
**Status:** Ready to Implement  
**Estimated Time:** Phase 1 = 45 minutes, Phase 2 = TBD

---

## Executive Decision Summary

### What We Decided Today

✅ **Use Option 2C: Two Free Supabase Projects**
- Dev database for development/testing
- Prod database for testers
- Complete isolation, $0 cost
- Manual schema sync (acceptable)

✅ **Set up Git branching workflow**
- `main` branch = Production (testers)
- `develop` branch = Development (you)
- Vercel auto-deploys both separately

✅ **Roles Feature Design: Minimal Schema Changes**
- Add `role` column to users table
- Create `user_relationships` table for mentor/admin relationships
- NO changes to apiaries, hives, inspections, tasks tables
- Update RLS policies only

### Why This Approach

1. **Protects tester data** during development
2. **Zero cost** during testing phase ($0/month)
3. **Minimal schema changes** = easier upgrades later
4. **Backward compatible** = existing users unaffected
5. **Scalable** = works for 10 or 10,000 users

---

## Phase 1: Set Up Dev/Prod Infrastructure

**Goal:** Create isolated development environment  
**Time:** 45 minutes  
**Cost:** $0  
**Risk:** Very Low

### Step 1: Create Second Supabase Project (15 min)

1. **Go to:** https://supabase.com/dashboard
2. **Click:** "New Project"
3. **Configure:**
   ```
   Organization: [Your existing org]
   Name: TBH Beekeeper Dev
   Database Password: [Generate strong password - SAVE THIS!]
   Region: [Same as production for consistency]
   Plan: Free
   ```
4. **Wait:** ~2 minutes for project creation
5. **Save credentials:**
   ```
   Project URL: https://[project-ref].supabase.co
   Anon/Public Key: [Copy from Settings > API]
   Service Role Key: [Copy from Settings > API]
   ```

### Step 2: Clone Production Schema to Dev (10 min)

**Option A: SQL Dump (Recommended)**

1. **In Production Supabase:**
   - Go to SQL Editor
   - Run this query to get schema:
   ```sql
   -- This exports your schema
   SELECT table_name, column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_schema = 'public'
   ORDER BY table_name, ordinal_position;
   ```

2. **Manually recreate in Dev:**
   - Go to Table Editor in Dev project
   - Create each table matching production structure
   - Or use SQL schema from your migrations if you have them

**Option B: Use Supabase CLI (Advanced)**

```bash
# Export from production
npx supabase db dump --db-url "postgresql://[prod-connection-string]" > schema.sql

# Import to dev
npx supabase db push --db-url "postgresql://[dev-connection-string]" < schema.sql
```

### Step 3: Set Up Git Branching (10 min)

```bash
# Navigate to project
cd "c:\Users\ronno\Antigravity\Beeks\TBH Beekeeper"

# Ensure you're on main
git checkout main
git pull origin main

# Create develop branch
git checkout -b develop
git push -u origin develop

# Protect main branch on GitHub
# Go to: GitHub repo > Settings > Branches > Add rule
# Branch name pattern: main
# Check: Require pull request before merging
```

### Step 4: Configure Vercel Environment Variables (10 min)

1. **Go to:** https://vercel.com/dashboard
2. **Select:** Your TBH Beekeeper project
3. **Go to:** Settings > Environment Variables

4. **Update existing production variables:**
   - Find: `NEXT_PUBLIC_SUPABASE_URL`
   - Click: Edit
   - Set to: **Production only** ✓
   - Value: [Your current/production Supabase URL]
   - Save

   - Find: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click: Edit
   - Set to: **Production only** ✓
   - Value: [Your current/production anon key]
   - Save

5. **Add new development variables:**
   - Click: Add New
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: [Your NEW dev Supabase URL]
   - Environments: **Preview** ✓ (and optionally Development)
   - Save

   - Click: Add New
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: [Your NEW dev anon key]
   - Environments: **Preview** ✓ (and optionally Development)
   - Save

6. **Set production branch:**
   - Go to: Settings > Git
   - Production Branch: `main`
   - Save

### Step 5: Test the Setup (5 min)

```bash
# Make a small change on develop
git checkout develop
echo "# Dev Environment Test" >> TEST.md
git add TEST.md
git commit -m "test: Verify dev environment setup"
git push origin develop

# Check Vercel dashboard - should see preview deployment
# URL will be: develop-tbh-beekeeper.vercel.app

# Verify it connects to DEV database (check Supabase dashboard for activity)

# Clean up test file
git rm TEST.md
git commit -m "chore: Remove test file"
git push origin develop
```

### Verification Checklist

After Phase 1, verify:
- [ ] Two Supabase projects exist (prod and dev)
- [ ] Both have same schema structure
- [ ] Two Git branches exist (main and develop)
- [ ] Vercel has separate env vars for production and preview
- [ ] Deploying to `main` uses prod database
- [ ] Deploying to `develop` uses dev database
- [ ] Testers can still access production at normal URL

---

## Phase 2: Roles Feature Implementation

**Goal:** Add Admin and Mentor roles with minimal schema changes  
**Time:** TBD (design + implementation)  
**Database:** Dev only (safe testing)

### Database Schema Changes

**File: `migrations/001_add_roles_feature.sql`**

```sql
-- =====================================================
-- Migration: Add Roles Feature
-- Date: TBD
-- Author: Ron
-- Description: Adds admin/mentor roles with user relationships
-- =====================================================

-- Step 1: Add role column to users
-- Default to 'user' for all existing users
ALTER TABLE users 
ADD COLUMN role TEXT DEFAULT 'user' 
CHECK (role IN ('user', 'mentor', 'admin'));

-- Step 2: Create user relationships table
-- Tracks mentor-student and admin relationships
CREATE TABLE user_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supervisor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supervised_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship_type TEXT DEFAULT 'mentorship' 
        CHECK (relationship_type IN ('mentorship', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Prevent duplicate relationships
    UNIQUE(supervisor_id, supervised_id)
);

-- Step 3: Add indexes for performance
CREATE INDEX idx_user_relationships_supervisor 
    ON user_relationships(supervisor_id);
    
CREATE INDEX idx_user_relationships_supervised 
    ON user_relationships(supervised_id);

-- Step 4: Enable RLS on new table
ALTER TABLE user_relationships ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for user_relationships
CREATE POLICY "Users can view their own relationships"
ON user_relationships FOR SELECT
USING (
    supervisor_id = auth.uid() 
    OR supervised_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Only admins can create relationships"
ON user_relationships FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Only admins can delete relationships"
ON user_relationships FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- Update RLS Policies for Existing Tables
-- =====================================================

-- APIARIES: Allow viewing own + supervised apiaries
DROP POLICY IF EXISTS "Users can view own apiaries" ON apiaries;
CREATE POLICY "Users can view own and supervised apiaries"
ON apiaries FOR SELECT
USING (
    user_id = auth.uid()  -- Own apiaries
    OR 
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )  -- Admins see everything
    OR
    EXISTS (
        SELECT 1 FROM user_relationships
        WHERE supervisor_id = auth.uid() 
        AND supervised_id = apiaries.user_id
    )  -- Mentors see supervised
);

-- HIVES: Allow viewing own + supervised hives
DROP POLICY IF EXISTS "Users can view own hives" ON hives;
CREATE POLICY "Users can view own and supervised hives"
ON hives FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = hives.apiary_id 
        AND apiaries.user_id = auth.uid()
    )  -- Own hives
    OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )  -- Admins see everything
    OR
    EXISTS (
        SELECT 1 FROM apiaries a
        JOIN user_relationships ur ON ur.supervised_id = a.user_id
        WHERE a.id = hives.apiary_id
        AND ur.supervisor_id = auth.uid()
    )  -- Mentors see supervised
);

-- INSPECTIONS: Allow viewing own + supervised inspections
DROP POLICY IF EXISTS "Users can view own inspections" ON inspections;
CREATE POLICY "Users can view own and supervised inspections"
ON inspections FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = inspections.hive_id
        AND a.user_id = auth.uid()
    )  -- Own inspections
    OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )  -- Admins see everything
    OR
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        JOIN user_relationships ur ON ur.supervised_id = a.user_id
        WHERE h.id = inspections.hive_id
        AND ur.supervisor_id = auth.uid()
    )  -- Mentors see supervised
);

-- TASKS: Allow viewing own + supervised tasks
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
CREATE POLICY "Users can view own and supervised tasks"
ON tasks FOR SELECT
USING (
    assigned_user_id = auth.uid()  -- Assigned to them
    OR
    EXISTS (
        SELECT 1 FROM apiaries 
        WHERE apiaries.id = tasks.apiary_id 
        AND apiaries.user_id = auth.uid()
    )  -- Own apiaries
    OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )  -- Admins see everything
    OR
    EXISTS (
        SELECT 1 FROM apiaries a
        JOIN user_relationships ur ON ur.supervised_id = a.user_id
        WHERE a.id = tasks.apiary_id
        AND ur.supervisor_id = auth.uid()
    )  -- Mentors see supervised
);

-- Repeat similarly for: hive_snapshots, interventions
-- (Same pattern for each table)

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check role distribution
SELECT role, COUNT(*) as user_count 
FROM users 
GROUP BY role;

-- Check relationships
SELECT 
    u1.email as supervisor_email,
    u2.email as supervised_email,
    ur.relationship_type
FROM user_relationships ur
JOIN users u1 ON u1.id = ur.supervisor_id
JOIN users u2 ON u2.id = ur.supervised_id;
```

### Sample SQL for Initial Role Assignment

```sql
-- =====================================================
-- After migration, assign initial roles
-- Run this ONLY when you're ready to activate feature
-- =====================================================

-- Assign admin role to yourself
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Assign mentor role to specific users
UPDATE users 
SET role = 'mentor' 
WHERE email IN ('mentor1@example.com', 'mentor2@example.com');

-- Create sample mentorship relationship
INSERT INTO user_relationships (supervisor_id, supervised_id, relationship_type)
VALUES (
    (SELECT id FROM users WHERE email = 'mentor1@example.com'),
    (SELECT id FROM users WHERE email = 'student1@example.com'),
    'mentorship'
);
```

### UI Changes Needed

**1. User Role Management (Admin Only)**
- Page: `/admin/users`
- Features:
  - List all users
  - Assign roles (user → mentor → admin)
  - Create mentorship relationships
  - Remove mentorship relationships

**2. Apiary List (Show Ownership)**
```typescript
// In apiary list component
interface ApiaryWithOwner extends Apiary {
  owner_email?: string;
  is_supervised?: boolean;
}

// Display logic
{apiaries.map(apiary => (
  <ApiaryCard 
    apiary={apiary}
    badge={
      apiary.is_supervised ? "Mentoring" : 
      apiary.user_id !== currentUser.id ? "Admin View" : 
      null
    }
    ownerName={apiary.owner_email}
  />
))}
```

**3. Access Level Indicator**
- Show badge: "Owner", "Mentoring", "Admin View"
- Maybe restrict certain actions (e.g., mentors can't delete supervised apiaries)

---

## Development Workflow (Going Forward)

### Daily Development Pattern

```bash
# Always start from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/roles-ui

# Make changes, test on preview URL
git add .
git commit -m "feat: add role management UI"
git push origin feature/roles-ui

# Create PR on GitHub: feature/roles-ui → develop
# Review & merge

# When feature is stable and tested
# Create PR: develop → main
# This deploys to production (testers)
```

### Database Migration Workflow

```bash
# 1. Test migration on DEV database
# In Supabase Dev project SQL Editor, run migration

# 2. Test application on develop preview URL
# Verify everything works

# 3. When ready to deploy to production:
# In Supabase Prod project SQL Editor, run SAME migration

# 4. Deploy code to production
# Merge develop → main
```

---

## Emergency Rollback Procedures

### If Migration Breaks Dev Database

```sql
-- Rollback migration (reverse the changes)
DROP TABLE user_relationships;
ALTER TABLE users DROP COLUMN role;

-- Restore original RLS policies (copy from backup/git history)
```

### If Deployment Breaks Production

```bash
# Revert the merge commit
git revert HEAD
git push origin main

# Vercel auto-deploys the revert
```

---

## Next Steps (Tomorrow or When Ready)

### Immediate Priority
1. [ ] Implement Phase 1 (dev/prod setup) - 45 minutes
2. [ ] Test that both environments work
3. [ ] Verify tester environment is stable

### When Ready for Roles Feature
1. [ ] Review database schema design above
2. [ ] Run migration on DEV database
3. [ ] Build role management UI
4. [ ] Test thoroughly on dev environment
5. [ ] Deploy to production when confident

---

## Resources Created Today

- [DEPLOYMENT_STRATEGY_OPTIONS.md](./DEPLOYMENT_STRATEGY_OPTIONS.md) - Full analysis of deployment approaches
- [DATABASE_SIZE_CALCULATOR.md](./DATABASE_SIZE_CALCULATOR.md) - Database growth projections
- [FREE_TIER_CAPACITY_ANALYSIS.md](./FREE_TIER_CAPACITY_ANALYSIS.md) - User capacity on free tier
- This document - Implementation roadmap

---

## Questions to Consider Before Implementing

1. **Mentor Permissions:** Should mentors be able to:
   - Create inspections for supervised hives? (Probably yes)
   - Create apiaries for supervised users? (Probably no)
   - Assign tasks to supervised users? (Probably yes)
   - Delete data in supervised apiaries? (Probably no)

2. **Admin Permissions:** Should admins have:
   - Full CRUD on all data? (Probably yes)
   - Ability to reassign ownership? (Consider)
   - Ability to delete users? (Consider implications)

3. **UI/UX:** How to make it clear when you're viewing someone else's data?
   - Color coding?
   - Banner at top?
   - Badge on each item?

4. **Data Privacy:** Should supervised users know they're being supervised?
   - Notification when relationship created?
   - Ability to see who their mentors are?
   - Ability to opt out?

---

## Contact / Getting Help

When you return to this:
1. Open this document
2. Start with Phase 1, Step 1
3. Follow checklist item by item
4. If stuck, refer to DEPLOYMENT_STRATEGY_OPTIONS.md for context

**Estimated total time for Phase 1: 45 minutes**

Good luck! 🐝
