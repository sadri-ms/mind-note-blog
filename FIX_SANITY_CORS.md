# Fix Sanity CORS Error - Quick Guide

## 🔍 The Problem

Your website on Vercel (`https://mind-note-kappa.vercel.app`) is trying to connect to the **OLD Sanity project** (`j6b4ehw6`) which:
- ❌ Doesn't have your Vercel domain in CORS settings
- ❌ Is the old project you wanted to replace

## ✅ Solution: Two Steps

### Step 1: Add Vercel Domain to NEW Sanity Project CORS

1. Go to: https://sanity.io/manage
2. Select your **NEW project** (`u3f3sd02`)
3. Go to **API** → **CORS origins**
4. Click **"Add CORS origin"**
5. Add: `https://mind-note-kappa.vercel.app`
6. Click **Save**

### Step 2: Redeploy on Vercel

Your Vercel deployment has old code. You need to:

**Option A: Automatic (if connected to GitHub)**
- Just push your latest code to GitHub
- Vercel will auto-deploy

**Option B: Manual Redeploy**
1. Go to: https://vercel.com/dashboard
2. Find your project
3. Click **"Redeploy"** → **"Redeploy"**

## 🎯 Why This Happened

- Your local code has the new Sanity project ID (`u3f3sd02`)
- But Vercel is still running old code with the old project ID (`j6b4ehw6`)
- The old project doesn't allow your Vercel domain

## ✅ After Fixing

1. ✅ Add Vercel domain to NEW Sanity project CORS
2. ✅ Redeploy on Vercel
3. ✅ Website will use the new Sanity project
4. ✅ CORS errors will be gone

---

**Note**: The comments issue might also be related - make sure Supabase CORS is configured too!

