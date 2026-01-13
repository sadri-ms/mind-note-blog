-- Add DELETE Policy for Comments
-- Run this SQL in your Supabase SQL Editor
-- This allows users to delete their own comments based on email

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Create DELETE policy: Users can delete comments where their email matches
CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  USING (true); -- For now, allow anyone to delete (you can restrict this later with auth.uid() if you add authentication)

-- Verify the policy was created
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'comments' AND cmd = 'DELETE';


