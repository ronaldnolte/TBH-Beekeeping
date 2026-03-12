-- Grant table-level permissions to authenticated role
-- Run this in Supabase SQL Editor after creating the varroa_tests table
-- (RLS policies handle row-level filtering, but the role needs base access)

GRANT SELECT, INSERT, UPDATE, DELETE ON varroa_tests TO authenticated;
