-- =====================================================
-- FIX: ALLOW MENTORS TO VIEW HIVES (SIMPLIFIED RLS)
-- =====================================================
-- Problem: 'check_hive_access' function might be failing or causing recursion.
-- Solution: Inline the permission logic into the RLS policy.
--           Allow access if user is Apiary Owner OR Viewer (via Share).

DROP POLICY IF EXISTS "Users manage hives in own apiaries" ON hives;

CREATE POLICY "Access hives via apiary ownership or share" ON hives
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM apiaries a
        LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
        WHERE a.id = hives.apiary_id
        AND (
            a.user_id = auth.uid() -- Owner
            OR s.id IS NOT NULL    -- Shared
        )
    )
);

SELECT 'Fixed: Hives RLS now explicitly allows shared access.' as message;
