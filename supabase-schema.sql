-- Supabase Comments Table Schema
-- Run this SQL in your Supabase SQL Editor

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert comments (for public commenting)
-- If you want to restrict this later, you can modify or remove this policy
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- Optional: Policy to allow users to delete their own comments (if you add user auth later)
-- CREATE POLICY "Users can delete their own comments"
--   ON comments
--   FOR DELETE
--   USING (auth.uid()::text = author_email);

-- Optional: Add email validation constraint
ALTER TABLE comments
  ADD CONSTRAINT email_format_check
  CHECK (author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

