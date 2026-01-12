-- Fix Comments Table - Add Missing Content Column
-- Run this SQL in your Supabase SQL Editor

-- Add the content column if it doesn't exist
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '';

-- If the column already exists but has a default, you can remove the default after adding existing data
-- ALTER TABLE comments ALTER COLUMN content DROP DEFAULT;

-- Verify the table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'comments' AND table_schema = 'public';

