-- Fixed Supabase Comments Table Schema
-- This version handles existing tables/policies gracefully

-- Create comments table (if not exists)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;

-- Policy: Anyone can read comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert comments (for public commenting)
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- Drop and recreate email constraint (if it exists)
ALTER TABLE comments DROP CONSTRAINT IF EXISTS email_format_check;
ALTER TABLE comments
  ADD CONSTRAINT email_format_check
  CHECK (author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

