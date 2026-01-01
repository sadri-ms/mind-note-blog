# Guide: Setting Up a New GitHub Repository

This guide will help you create a new GitHub repository on your new account and push your code to it.

## Step 1: Create a New Repository on GitHub

1. Go to [https://github.com](https://github.com) and sign in with your **new account**
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `blog-website` (or your preferred name)
   - **Description**: "Modern AI blog website built with React, TypeScript, and Sanity CMS"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**
5. **Copy the repository URL** that GitHub shows you (it will look like: `https://github.com/yourusername/blog-website.git`)

---

## Step 2: Initialize Git in Your Project (If Not Already Done)

Open terminal in your project folder and run:

```bash
cd "C:\Users\Mahshid Sadri\Desktop\blog-website"
git init
```

---

## Step 3: Add All Files to Git

```bash
# Add all files
git add .

# Create your first commit
git commit -m "Initial commit: Blog website with Sanity CMS integration"
```

---

## Step 4: Connect to Your New GitHub Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add the new remote (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify the remote was added
git remote -v
```

**Example:**
```bash
git remote add origin https://github.com/mahshid/blog-website.git
```

---

## Step 5: Push Your Code to GitHub

```bash
# Push to the main branch (or master if that's your default)
git branch -M main
git push -u origin main
```

If you get an authentication error, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys

---

## Step 6: Remove Old Remote (If Exists)

If you had an old GitHub repository connected, remove it first:

```bash
# Check current remotes
git remote -v

# Remove old remote (if it exists)
git remote remove origin

# Then add the new one (Step 4)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

## Step 7: Update Deployment Settings (If Using Vercel/Netlify)

If you're using Vercel, Netlify, or another deployment platform:

1. Go to your deployment platform dashboard
2. Disconnect the old repository
3. Connect the new repository
4. Redeploy

---

## Quick Command Summary

```bash
# Navigate to project
cd "C:\Users\Mahshid Sadri\Desktop\blog-website"

# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Blog website with Sanity CMS integration"

# Add new remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### "Repository not found" error:
- Make sure the repository exists on GitHub
- Check that you're using the correct URL
- Verify you're logged into the correct GitHub account

### Authentication errors:
- GitHub no longer accepts passwords for HTTPS
- Use a **Personal Access Token** instead:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token with `repo` permissions
  3. Use the token as your password when pushing

### "Remote origin already exists":
```bash
# Remove existing remote
git remote remove origin

# Add new one
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "Permission denied":
- Make sure you're logged into the correct GitHub account
- Check that you have write access to the repository
- Try using SSH instead of HTTPS

---

## Using SSH (Alternative Method)

If you prefer SSH:

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub**:
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste and save

3. **Use SSH URL instead**:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

---

## Next Steps After Setup

1. ✅ Verify your code is on GitHub
2. ✅ Update any deployment platforms (Vercel, Netlify, etc.)
3. ✅ Update any CI/CD configurations
4. ✅ Share the repository URL with collaborators (if needed)

---

**Need help?** Once you create the repository on GitHub, share the URL and I can help you connect it!

