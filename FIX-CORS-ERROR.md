# Fix CORS Error - Comment Posting Issue

## The Problem

You're seeing "Network error" even though you have internet connection. This is **most likely a CORS (Cross-Origin Resource Sharing) error**, not a real network issue.

## Why This Happens

When your website is deployed on Vercel (`mind-note-blog.vercel.app`), Supabase needs to know that this domain is allowed to make requests. If your domain isn't in the CORS settings, browsers block the request and it looks like a "network error".

## How to Fix It

### Step 1: Add Your Domain to Supabase CORS

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Scroll down to **CORS** section
5. Add these domains:
   - `https://mind-note-blog.vercel.app`
   - `http://localhost:5173` (for local development with Vite)
   - `http://localhost:3000` (if you use this port)
6. Click **Save**

### Step 2: Verify It Works

After adding the domain:
1. Wait 1-2 minutes for changes to propagate
2. Refresh your website
3. Try posting a comment again
4. Check browser console (F12) - you should see the actual error if it's still failing

### Step 3: Check Browser Console

Open **Developer Tools** (F12) → **Console** tab and look for:
- `❌ Error adding comment:` - Shows the actual error
- `Error code:` - The Supabase error code
- `Error message:` - The full error message

## Common CORS Error Messages

- `Access-Control-Allow-Origin`
- `CORS policy`
- `Failed to fetch` (often CORS, not network)
- `No 'Access-Control-Allow-Origin' header`

## Alternative: Use Supabase CLI

If you prefer command line:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Add CORS origin
supabase cors add https://mind-note-blog.vercel.app
```

## Still Not Working?

If you still get errors after adding CORS:

1. **Check the actual error** in browser console
2. **Verify your Supabase URL and API key** are correct in `services/supabase.ts`
3. **Check RLS policies** - Make sure INSERT policy exists:
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'comments' AND cmd = 'INSERT';
   ```
4. **Test the API directly**:
   ```javascript
   // In browser console
   fetch('https://srnkpvgvmcdmzdcsprev.supabase.co/rest/v1/comments', {
     method: 'POST',
     headers: {
       'apikey': 'sb_publishable_1HOC2SMajeBsvkv7vtBICg_2bcls0Y8',
       'Authorization': 'Bearer sb_publishable_1HOC2SMajeBsvkv7vtBICg_2bcls0Y8',
       'Content-Type': 'application/json',
       'Prefer': 'return=representation'
     },
     body: JSON.stringify({
       post_id: 'test',
       author_name: 'Test',
       author_email: 'test@test.com',
       content: 'Test comment'
     })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```

## Quick Checklist

- [ ] Added domain to Supabase CORS settings
- [ ] Waited 1-2 minutes for propagation
- [ ] Refreshed the website
- [ ] Checked browser console for actual error
- [ ] Verified RLS policies exist
- [ ] Verified API key is correct

The improved error handling will now show you the **actual error** instead of just "Network error"!
