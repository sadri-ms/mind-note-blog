# Edit Button Not Showing - Debug Guide

## Quick Check

The Edit button should appear **next to the Delete button** when you can modify a comment.

## Debugging Steps

### 1. Check Browser Console
Open Developer Tools (F12) → Console tab and look for:
```
🔍 Checking modify permission (Edit/Delete):
```
- Check if `canModify: true`
- Check if `willShowEditButton: true`
- Verify `allUserEmails` includes your comment's email

### 2. Verify Edit Button is Rendered
The Edit button should be:
- **Blue color** (pencil icon)
- **Next to** the red Delete button (trash icon)
- **Same size** as Delete button

### 3. Check if Icon is Loading
If you see the Delete button but not Edit:
- The `Edit2` icon from `lucide-react` might not be loading
- Try refreshing the page
- Check browser console for import errors

### 4. Visual Check
The Edit button should look like:
- Small blue pencil icon
- Appears on the right side of your comment
- Hover shows "Edit your comment" tooltip

## If Still Not Showing

1. **Check the code renders both buttons**:
   - Both Edit and Delete should be in the same `<div>` with `flex items-center gap-2`
   - Both should have `canModify && !isEditing` condition

2. **Verify UPDATE policy exists**:
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'comments' AND cmd = 'UPDATE';
   ```
   Should show: `Users can update their own comments`

3. **Check icon import**:
   - Edit button uses: `<Edit2 size={18} strokeWidth={2.5} />`
   - Should be imported: `import { Edit2 } from 'lucide-react'`

## Quick Fix

If Edit button still doesn't show, try:
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check if both buttons are in the same container

The Edit button code is correct - it should appear automatically when Delete button appears!
