# Troubleshooting Comments Not Saving

## Step-by-Step Fix Guide

### Step 1: Run the Complete SQL Fix Script

1. Open your **Supabase Dashboard** → Go to **SQL Editor**
2. Open the file `fix-comments-table-complete.sql` in this project
3. **Copy the ENTIRE contents** of that file
4. Paste it into the Supabase SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Check the output - it should show:
   - Whether the content column was added
   - The table structure
   - The RLS policies

### Step 2: Verify Your Table Structure

In Supabase SQL Editor, run this query to check your table:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'comments' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (uuid)
- `post_id` (text)
- `author_name` (text)
- `author_email` (text)
- `content` (text) ← **This must exist!**
- `created_at` (timestamp with time zone)

### Step 3: Verify RLS Policies

Run this query to check your policies:

```sql
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'comments';
```

**You should have:**
1. A SELECT policy (allows reading comments)
2. An INSERT policy (allows creating comments)

### Step 4: Test in Browser Console

1. Open your website in the browser
2. Open **Developer Tools** (F12)
3. Go to the **Console** tab
4. Try to add a comment
5. Look for these messages:
   - `🔄 Loading comments for postId: ...`
   - `📤 Submitting comment: ...`
   - `✅ Comment added successfully` OR `❌ Error...`

### Step 5: Check Common Issues

#### Issue: "column 'content' does not exist"
**Solution:** Run the SQL fix script again. The content column might not have been added.

#### Issue: "permission denied" or "new row violates row-level security policy"
**Solution:** Your RLS policies are blocking the insert. Run the SQL fix script to recreate the policies.

#### Issue: Comments appear but disappear after refresh
**Solution:** This means inserts are working but SELECT is failing. Check your SELECT RLS policy.

#### Issue: No errors but comments don't save
**Solution:** 
1. Check the browser console for any error messages
2. Verify your Supabase URL and API key in `services/supabase.ts`
3. Make sure you're using the correct `postId` format

### Step 6: Manual Test in Supabase

Try inserting a comment directly in Supabase:

1. Go to **Table Editor** → `comments` table
2. Click **Insert** → **Insert row**
3. Fill in:
   - `post_id`: (use a post ID from your blog)
   - `author_name`: Test User
   - `author_email`: test@example.com
   - `content`: This is a test comment
4. Click **Save**

If this works, the issue is in your code. If it doesn't, the issue is with your table/policies.

### Step 7: Verify postId Format

The `postId` must match exactly. Check:
1. What format your blog posts use (e.g., slug, UUID, etc.)
2. Make sure the `postId` passed to `CommentsSection` matches what's in your database

You can check this in the browser console - it will log the `postId` being used.

## Still Not Working?

If after all these steps it still doesn't work:

1. **Share the browser console errors** - Copy all error messages
2. **Share the SQL Editor output** - After running the fix script
3. **Check Supabase logs** - Go to Supabase Dashboard → Logs → API Logs

The enhanced logging I added will help identify exactly where the problem is!

