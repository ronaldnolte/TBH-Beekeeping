-- =====================================================
-- FIX: ALLOW MENTORS TO READ SHARED APIARIES
-- =====================================================
-- Problem: Mentors can see the 'share' record but cannot read the 'apiary' record
-- because the RLS on 'apiaries' table only allows Owners.
-- Result: 'apiary' comes back as NULL, causing frontend crash.

-- Solution: Update 'apiaries' policy to allow VIEWERS to SELECT.

-- 1. Drop the restrictive policy (or old policies if any)
DROP POLICY IF EXISTS "Users can all on own apiaries" ON apiaries;
DROP POLICY IF EXISTS "Apiary access based on ownership or share" ON apiaries;

-- 2. Re-create Policy for ALL operations (Owner Only)
-- We split this because we don't want Mentors to UPDATE/DELETE, only SELECT.

CREATE POLICY "Owners have full access to apiaries" ON apiaries
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Create Policy for SELECT (Viewers)
CREATE POLICY "Viewers can read shared apiaries" ON apiaries
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM apiary_shares 
        WHERE apiary_id = apiaries.id 
        AND viewer_id = auth.uid()
    )
);

SELECT 'Fixed: Apiary RLS now allows shared access.' as message;
