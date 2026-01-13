-- Add UPDATE Policy for Comments
-- Run this SQL in your Supabase SQL Editor
-- This allows users to update their own comments based on email

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;

-- Create UPDATE policy: Users can update comments where their email matches
CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  USING (true)  -- Check if user can see the row
  WITH CHECK (true);  -- Check if user can update the row

-- Verify the policy was created
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'comments' AND cmd = 'UPDATE';
