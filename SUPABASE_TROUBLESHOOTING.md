# Supabase Comments Troubleshooting Guide

## 🔍 Issue: Comments Disappear After Refresh

If comments disappear after refreshing the page, here's how to diagnose and fix it:

## Step 1: Check if Comments Are Being Saved

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/srnkpvgvmcdmzdcsprev
   - Click **"Table Editor"** in the left sidebar
   - Click on **"comments"** table

2. **Check if your test comment is there:**
   - If you see your comment → The save is working, but loading might be broken
   - If you DON'T see your comment → The save is failing

## Step 2: Fix the SQL Schema

The error you saw is because policies already exist. Run this **fixed SQL** instead:

1. Go to **SQL Editor** in Supabase
2. Copy and paste the contents of `supabase-schema-fixed.sql`
3. Click **Run**

This will:
- ✅ Handle existing tables/policies gracefully
- ✅ Recreate policies correctly
- ✅ Fix any permission issues

## Step 3: Check Browser Console

1. Open your website
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try posting a comment
5. Look for any **red error messages**

Common errors:
- `Error fetching comments` → RLS policy issue
- `Error adding comment` → Insert policy issue
- `CORS error` → Supabase CORS settings

## Step 4: Verify RLS Policies

1. Go to Supabase Dashboard
2. Click **"Authentication"** → **"Policies"**
3. Or go to **"Table Editor"** → **"comments"** → **"Policies"** tab
4. Make sure you see:
   - ✅ "Comments are viewable by everyone" (SELECT policy)
   - ✅ "Anyone can insert comments" (INSERT policy)

## Step 5: Check Post ID

The comment system uses `postId` to filter comments. Make sure:

1. Your blog post has a valid `postId` in the URL
2. The `postId` matches what's stored in the database

**To check:**
- Look at your browser URL: `/blogs/some-post-id`
- The `some-post-id` is what gets saved as `post_id` in Supabase

## Step 6: Test with Simple Query

Run this in Supabase SQL Editor to see all comments:

```sql
SELECT * FROM comments ORDER BY created_at DESC;
```

If you see comments here but not on your website, it's a loading issue.
If you don't see comments here, it's a saving issue.

## 🔧 Quick Fixes

### Fix 1: Re-run Fixed SQL Schema
Run `supabase-schema-fixed.sql` - it handles existing policies correctly.

### Fix 2: Check CORS Settings
1. Go to Supabase Dashboard
2. **Settings** → **API**
3. Under **CORS**, make sure your domain is added:
   - `http://localhost:3000` (for development)
   - Your production domain (if deployed)

### Fix 3: Verify Supabase Keys
Check that `services/supabase.ts` has the correct:
- URL: `https://srnkpvgvmcdmzdcsprev.supabase.co`
- Key: Your anon key

## 🎯 Most Likely Issues

1. **RLS Policies not set correctly** → Run the fixed SQL
2. **CORS not configured** → Add your domain to CORS settings
3. **Post ID mismatch** → Check that postId in URL matches database

## ✅ After Fixing

1. Clear your browser cache
2. Refresh the page
3. Post a test comment
4. Refresh again - comment should still be there!

---

**Need more help?** Check the browser console for specific error messages and share them.




