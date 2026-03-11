-- ============================================================
-- Varroa Mite Test History Table
-- Run this in the Supabase SQL Editor for the DEV project
-- ============================================================

CREATE TABLE varroa_tests (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hive_id     TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tested_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  bee_count   INTEGER NOT NULL DEFAULT 300,
  mite_count  INTEGER NOT NULL,
  mite_pct    NUMERIC(5,2) GENERATED ALWAYS AS (
                CASE WHEN bee_count > 0
                  THEN ROUND((mite_count::NUMERIC / bee_count) * 100, 2)
                  ELSE 0
                END
              ) STORED,
  threshold   NUMERIC(5,2) NOT NULL,
  notes       TEXT,
  reset_at    TIMESTAMPTZ,            -- set when queen replacement resets history
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fast hive-scoped queries
CREATE INDEX idx_varroa_tests_hive_id ON varroa_tests(hive_id);
CREATE INDEX idx_varroa_tests_user_id ON varroa_tests(user_id);

-- Row Level Security
ALTER TABLE varroa_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own varroa_tests"
  ON varroa_tests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own varroa_tests"
  ON varroa_tests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own varroa_tests"
  ON varroa_tests FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own varroa_tests"
  ON varroa_tests FOR DELETE
  USING (user_id = auth.uid());

-- Grant table-level permissions (required alongside RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON varroa_tests TO authenticated;
GRANT SELECT ON varroa_tests TO anon;
