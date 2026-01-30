# Debug Comment Posting Error

## Supabase CORS Note

Supabase **doesn't have a separate CORS section** in the dashboard. CORS is handled automatically for REST API requests. If you're getting a "Network error", it's likely **NOT a CORS issue**.

## Real Issues to Check

### 1. Check Browser Console for Actual Error

Open **Developer Tools** (F12) → **Console** tab and look for:
```
❌ Error adding comment: [error object]
Error code: [code]
Error message: [message]
```

**Share the actual error code and message** - this will tell us what's really wrong!

### 2. Common Real Issues

#### Issue: RLS Policy Missing
**Error Code**: `42501` or `PGRST116`
**Fix**: Run this SQL in Supabase SQL Editor:
```sql
-- Check if INSERT policy exists
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'comments' AND cmd = 'INSERT';

-- If missing, create it:
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);
```

#### Issue: Table/Column Missing
**Error Code**: `PGRST116` or message contains "does not exist"
**Fix**: Run `fix-comments-table-complete.sql` script

#### Issue: API Key Wrong
**Error**: Authentication errors
**Fix**: 
1. Go to Supabase Dashboard → Settings → API
2. Copy the **anon/public** key
3. Update `services/supabase.ts` with the correct key

#### Issue: Email Validation Constraint
**Error**: "violates check constraint"
**Fix**: Remove or modify the email constraint:
```sql
ALTER TABLE comments DROP CONSTRAINT IF EXISTS email_format_check;
```

### 3. Test Direct API Call

Try this in browser console to test the connection:

```javascript
fetch('https://srnkpvgvmcdmzdcsprev.supabase.co/rest/v1/comments', {
  method: 'POST',
  headers: {
    'apikey': 'sb_publishable_1HOC2SMajeBsvkv7vtBICg_2bcls0Y8',
    'Authorization': 'Bearer sb_publishable_1HOC2SMajeBsvkv7vtBICg_2bcls0Y8',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    post_id: 'test-post-id',
    author_name: 'Test User',
    author_email: 'test@example.com',
    content: 'Test comment'
  })
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Headers:', r.headers);
  return r.json();
})
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

This will show you the **actual error** from Supabase.

### 4. Check Network Tab

1. Open **Developer Tools** (F12) → **Network** tab
2. Try posting a comment
3. Look for the request to `supabase.co`
4. Click on it and check:
   - **Status Code** (should be 200 or 201)
   - **Response** tab (shows the actual error)
   - **Headers** tab (check if request is being sent)

## Most Likely Causes

1. **RLS Policy Missing** - Most common issue
2. **Wrong API Key** - Check Supabase Dashboard
3. **Table Structure Wrong** - Missing `content` column
4. **Email Constraint** - Email validation blocking

## Next Steps

1. **Check browser console** - Share the actual error code and message
2. **Check Network tab** - See what Supabase is returning
3. **Run the SQL script** - Make sure RLS policies exist
4. **Verify API key** - Check it matches your Supabase project

The improved error handling will now show you the **actual error** instead of "Network error"!
