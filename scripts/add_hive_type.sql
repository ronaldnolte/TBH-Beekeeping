-- Add type column to hives table
ALTER TABLE hives ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'top_bar';

-- Update existing hives to be 'top_bar' if they are null
UPDATE hives SET type = 'top_bar' WHERE type IS NULL;
