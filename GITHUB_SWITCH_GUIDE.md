# Switch to New GitHub Repository - Quick Guide

## Current Setup
- **Current Repository**: `https://github.com/mahshid-sadri/mind-note-blog.git`
- **Branch**: `main`
- **Status**: Connected and working

## Steps to Switch to New GitHub Account

### Step 1: Create New Repository on GitHub

1. Go to [https://github.com](https://github.com) and **sign in with your NEW account**
2. Click **"+"** → **"New repository"**
3. Repository settings:
   - **Name**: `blog-website` (or any name you prefer)
   - **Visibility**: Public or Private
   - **DO NOT** check "Initialize with README" (we already have files)
4. Click **"Create repository"**
5. **Copy the repository URL** (e.g., `https://github.com/your-new-username/blog-website.git`)

---

### Step 2: Commit Your Current Changes

Before switching, let's commit the Sanity project ID changes:

```bash
cd "C:\Users\Mahshid Sadri\Desktop\blog-website"
git add .
git commit -m "Update Sanity project ID to u3f3sd02"
```

---

### Step 3: Remove Old Remote and Add New One

Once you have your new repository URL, run:

```bash
# Remove the old remote
git remote remove origin

# Add your new repository (replace with your actual URL)
git remote add origin https://github.com/YOUR-NEW-USERNAME/YOUR-REPO-NAME.git

# Verify it's set correctly
git remote -v
```

---

### Step 4: Push to New Repository

```bash
# Push all branches to the new repository
git push -u origin main
```

If you have other branches:
```bash
git push -u origin --all
```

---

## Complete Command Sequence

**After you create the new repository on GitHub, run these commands:**

```powershell
# Navigate to project
cd "C:\Users\Mahshid Sadri\Desktop\blog-website"

# Commit current changes
git add .
git commit -m "Update Sanity project ID to u3f3sd02 and prepare for new GitHub account"

# Remove old remote
git remote remove origin

# Add new remote (REPLACE WITH YOUR ACTUAL URL)
git remote add origin https://github.com/YOUR-NEW-USERNAME/YOUR-REPO-NAME.git

# Verify
git remote -v

# Push to new repository
git push -u origin main
```

---

## Important Notes

1. **Don't delete the old repository yet** - Keep it as a backup until you verify everything works
2. **Authentication**: You may need to use a Personal Access Token instead of password
3. **Deployment**: If you're using Vercel/Netlify, you'll need to reconnect to the new repository

---

## Need Help?

Once you create the new repository and have the URL, I can help you run these commands automatically!

