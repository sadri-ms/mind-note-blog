# Comment Posting Error - Debug Guide

## What I Fixed

I've improved error handling to show the **actual error** instead of always showing "Network error". The code now:

1. ✅ Logs detailed error information to console
2. ✅ Checks for specific Supabase error codes
3. ✅ Provides more accurate error messages
4. ✅ Shows the actual error message for unknown errors

## How to Debug

### Step 1: Check Browser Console

When you try to post a comment, open **Developer Tools** (F12) → **Console** tab and look for:

```
❌ Error adding comment: [error object]
Error code: [code]
Error message: [message]
Error details: [full error]
```

### Step 2: Common Error Codes

- **PGRST116**: Table doesn't exist - Run the SQL setup script
- **42501**: Permission denied - Check RLS policies
- **23505**: Duplicate entry
- **23503**: Invalid reference
- **CORS error**: Need to add your domain to Supabase CORS settings

### Step 3: Check Supabase Settings

1. **Verify Table Exists**:
   - Go to Supabase Dashboard → Table Editor
   - Check if `comments` table exists
   - Verify it has: `id`, `post_id`, `author_name`, `author_email`, `content`, `created_at`

2. **Check RLS Policies**:
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'comments';
   ```
   Should show: SELECT, INSERT, DELETE, UPDATE policies

3. **Check CORS Settings**:
   - Go to Supabase Dashboard → Settings → API
   - Under "CORS", make sure your domain is added:
     - `https://mind-note-blog.vercel.app`
     - `http://localhost:3000` (for local dev)

4. **Verify API Key**:
   - Check if the anon key in `services/supabase.ts` matches your Supabase project
   - Go to Supabase Dashboard → Settings → API → Project API keys

### Step 4: Test Connection

Try this in browser console:
```javascript
// Test Supabase connection
fetch('https://srnkpvgvmcdmzdcsprev.supabase.co/rest/v1/comments?select=count', {
  headers: {
    'apikey': 'sb_publishable_1HOC2SMajeBsvkv7vtBICg_2bcls0Y8',
    'Authorization': 'Bearer sb_publishable_1HOC2SMajeBsvkv7vtBICg_2bcls0Y8'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Most Likely Issues

1. **CORS Error**: Your domain isn't in Supabase CORS settings
2. **RLS Policy**: INSERT policy might be missing or incorrect
3. **API Key**: The anon key might be wrong or expired
4. **Table Structure**: The `content` column might be missing

## Next Steps

After checking the console logs, share:
- The **Error code** (if any)
- The **Error message** (full text)
- Any **CORS errors** in the Network tab

This will help identify the exact issue!
