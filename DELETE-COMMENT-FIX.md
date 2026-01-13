# Fix: Can't Delete Comments

## Quick Checklist

### Step 1: Run the DELETE Policy SQL
**You MUST run this SQL in Supabase!**

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this SQL:

```sql
-- Add DELETE Policy for Comments
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  USING (true);
```

3. Click **Run**
4. Verify it worked - you should see a success message

### Step 2: Check Your Email Match

The delete button only appears if:
- ✅ You've entered your email in the comment form (or it's saved in localStorage)
- ✅ Your email **exactly matches** the email used when posting the comment
- ✅ The email is case-insensitive (test@example.com = TEST@EXAMPLE.COM)

**How to check:**
1. Open browser **Developer Tools** (F12) → **Console** tab
2. Look for messages like:
   - `🔍 Checking delete permission:` - Shows if email matches
   - `🗑️ Delete attempt:` - Shows email comparison

### Step 3: Find the Delete Button

The delete button:
- ✅ Shows as a **trash icon** on the right side of your comment
- ✅ Only appears on **your own comments** (matching email)
- ✅ Is always visible (not hidden on hover anymore)

### Step 4: Common Issues

#### Issue: "No delete button visible"
**Solution:**
- Make sure you entered the **same email** you used when posting
- Type your email in the form below the comments
- Refresh the page after entering your email

#### Issue: "Email mismatch" error
**Solution:**
- Check the console logs to see what emails are being compared
- Make sure there are no extra spaces in your email
- The email is case-insensitive, but must match exactly otherwise

#### Issue: "Permission denied" error
**Solution:**
- Run the DELETE policy SQL script (Step 1)
- Check Supabase → Table Editor → RLS policies
- Make sure the DELETE policy exists

#### Issue: Delete button doesn't work
**Solution:**
1. Open browser console (F12)
2. Click the delete button
3. Look for error messages
4. Share the error message if you need help

### Step 5: Test It

1. **Post a new comment** with your email
2. **Refresh the page**
3. **Enter the same email** in the form (if not already there)
4. **Look for the trash icon** next to your comment
5. **Click it** and confirm deletion

## Still Not Working?

1. **Check browser console** for error messages
2. **Verify DELETE policy exists** in Supabase:
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'comments' AND cmd = 'DELETE';
   ```
3. **Check your email** matches exactly (check console logs)
4. **Try clearing localStorage** and re-entering your email:
   ```javascript
   localStorage.removeItem('commentUserEmail');
   ```

