# Fix Deployment Issues - Complete Guide

## 🔍 The Problems

1. **Sanity CORS Error**: Your Vercel site is using the OLD Sanity project (`j6b4ehw6`)
2. **Comments Issue**: Might be related to Supabase CORS or RLS policies

## ✅ Fix 1: Sanity CORS (Most Important)

### Step 1: Add Vercel Domain to NEW Sanity Project

1. Go to: https://sanity.io/manage
2. Select your **NEW project** (`u3f3sd02`)
3. Go to **API** → **CORS origins**
4. Click **"Add CORS origin"**
5. Add these domains:
   - `https://mind-note-kappa.vercel.app` (your production site)
   - `http://localhost:3000` (for local development)
6. Click **Save**

### Step 2: Redeploy on Vercel

Your Vercel deployment has old code. Update it:

**If connected to GitHub (automatic):**
```bash
git add .
git commit -m "Update to new Sanity project"
git push origin main
```
Vercel will auto-deploy.

**Or manually:**
1. Go to: https://vercel.com/dashboard
2. Find your project
3. Click **"Redeploy"** → **"Redeploy"**

## ✅ Fix 2: Supabase CORS (For Comments)

1. Go to: https://supabase.com/dashboard/project/srnkpvgvmcdmzdcsprev
2. Go to **Settings** → **API**
3. Under **CORS**, add:
   - `https://mind-note-kappa.vercel.app`
   - `http://localhost:3000`

## ✅ Fix 3: Run Fixed SQL Schema

For the comments disappearing issue:

1. Go to Supabase SQL Editor
2. Run the `supabase-schema-fixed.sql` file
3. This fixes RLS policies

## 🎯 Summary

1. ✅ Add Vercel domain to NEW Sanity project CORS
2. ✅ Add Vercel domain to Supabase CORS
3. ✅ Redeploy on Vercel (push to GitHub or manual redeploy)
4. ✅ Run fixed SQL schema in Supabase

After these steps, everything should work!

