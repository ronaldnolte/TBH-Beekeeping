-- =====================================================
-- ADD DELETE AND UPDATE POLICIES FOR HIVE SNAPSHOTS
-- =====================================================
-- This adds missing RLS policies to allow users to delete
-- and update snapshots for their own hives
-- 
-- Run this in: Your Supabase SQL Editor
-- =====================================================

-- Allow users to delete snapshots of their own hives
CREATE POLICY "Users can delete snapshots of own hives"
ON hive_snapshots FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = hive_snapshots.hive_id
        AND a.user_id = auth.uid()
    )
);

-- Allow users to update snapshots of their own hives
CREATE POLICY "Users can update snapshots of own hives"
ON hive_snapshots FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM hives h
        JOIN apiaries a ON a.id = h.apiary_id
        WHERE h.id = hive_snapshots.hive_id
        AND a.user_id = auth.uid()
    )
);

-- =====================================================
-- DONE!
-- =====================================================

SELECT 'Snapshot DELETE and UPDATE policies added successfully!' as message;
