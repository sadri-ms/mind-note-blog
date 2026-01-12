-- Complete Fix for Comments Table
-- Run this ENTIRE script in your Supabase SQL Editor
-- This will fix all potential issues

-- Step 1: Add the content column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comments' 
        AND column_name = 'content'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE comments ADD COLUMN content TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Added content column';
    ELSE
        RAISE NOTICE 'Content column already exists';
    END IF;
END $$;

-- Step 2: Ensure RLS is enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Public can read comments" ON comments;
DROP POLICY IF EXISTS "Public can insert comments" ON comments;

-- Step 4: Create SELECT policy (anyone can read)
CREATE POLICY "Comments are viewable by everyone"
  ON comments
  FOR SELECT
  USING (true);

-- Step 5: Create INSERT policy (anyone can insert)
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- Step 6: Verify table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'comments' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 7: Verify RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'comments';

