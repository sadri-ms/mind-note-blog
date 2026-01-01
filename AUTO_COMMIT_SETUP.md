# Automatic Git Commit & Push Setup

## ⚠️ Important Warning

**Automatically pushing every change is generally NOT recommended** because:
- You might push broken code
- You might accidentally commit sensitive data
- You lose control over commit messages
- Creates messy commit history
- No code review process

## 🎯 Recommended Approach

**Option 1: Auto-commit only (Manual Push)** ✅ **RECOMMENDED**
- Automatically commits changes
- You manually push when ready
- Best balance of convenience and control

**Option 2: Auto-commit + Auto-push**
- Fully automatic
- Use with caution
- Only for small personal projects

## 🚀 Setup Instructions

### Step 1: Install Required Package

```bash
npm install --save-dev chokidar
```

### Step 2: Add Script to package.json

Add this to your `package.json` scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "watch": "node auto-commit.js"
}
```

### Step 3: Run the Watcher

In a separate terminal (while your dev server runs):

```bash
npm run watch
```

Or run both together:

```bash
npm run dev & npm run watch
```

## 📝 How It Works

1. **Watches for file changes** in your project
2. **Waits 5 seconds** after the last change (to batch multiple edits)
3. **Automatically commits** with timestamp
4. **Optionally pushes** to GitHub (you can disable this)

## ⚙️ Configuration Options

### Change Commit Delay

Edit `auto-commit.js`:
```javascript
const COMMIT_DELAY = 5000; // Change to 10000 for 10 seconds
```

### Disable Auto-Push

In `auto-commit.js`, comment out the push section:
```javascript
// exec('git push origin main', ...); // Disabled
```

### Ignore Specific Files

Edit the `ignorePaths` array in `auto-commit.js`:
```javascript
const ignorePaths = [
  'node_modules',
  '.git',
  'dist',
  'package-lock.json', // Add files to ignore
];
```

## 🔄 Alternative: Git Hooks (More Advanced)

You can also use Git hooks for automatic commits:

### Pre-commit Hook

Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
git add -A
git commit -m "Auto-commit: $(date)"
```

But this runs BEFORE commit, so it's less flexible.

## 🎯 Best Practice Workflow

1. **Use auto-commit for development** (saves your work)
2. **Manually push when ready** (you control what goes to GitHub)
3. **Write meaningful commit messages** for important changes
4. **Review before pushing** to avoid pushing broken code

## 🛑 Stop Auto-commit

Press `Ctrl+C` in the terminal running the watcher.

---

**Remember**: Automatic commits are convenient but use them wisely! 🎯

