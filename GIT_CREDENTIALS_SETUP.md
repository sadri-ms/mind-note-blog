# Git Credentials Setup - No More Authentication Prompts

## ✅ What I've Done

1. ✅ Configured Git Credential Manager (Windows)
2. ✅ Set your GitHub username for this repository

## 🔐 How to Store Your Token Securely

You have two options:

### Option 1: Store Token in Windows Credential Manager (Recommended)

1. **Open Windows Credential Manager:**
   - Press `Win + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Press Enter

2. **Or search for it:**
   - Press `Win` key
   - Type: "Credential Manager"
   - Open it

3. **Add your GitHub credentials:**
   - Click **"Windows Credentials"**
   - Click **"Add a generic credential"**
   - Fill in:
     - **Internet or network address**: `git:https://github.com`
     - **User name**: `sadri-ms`
     - **Password**: `YOUR_PERSONAL_ACCESS_TOKEN` (paste your token here)
   - Click **OK**

4. **Test it:**
   ```bash
   git push origin main
   ```
   It should work without asking for credentials!

### Option 2: Use Git Credential Store (Alternative)

Run this command to store credentials in a file:

```bash
git config --global credential.helper store
```

Then do one push with your token, and it will be saved:
```bash
git push origin main
# Enter username: sadri-ms
# Enter password: YOUR_PERSONAL_ACCESS_TOKEN (paste your token here)
```

After this first time, it won't ask again.

### Option 3: SSH Keys (Most Secure, Passwordless)

If you want the most secure option without any passwords:

1. **Generate SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```
   - Press Enter to accept default location
   - Press Enter twice for no passphrase (or set one)

2. **Copy your public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   Copy the entire output

3. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click **"New SSH key"**
   - Paste your key
   - Save

4. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:sadri-ms/mind-note-blog.git
   ```

5. **Test:**
   ```bash
   git push origin main
   ```
   No authentication needed!

---

## 🎯 Recommended: Option 1 (Windows Credential Manager)

This is the easiest and most secure for Windows. Your token will be encrypted and stored securely by Windows.

---

## ✅ After Setup

Test with:
```bash
git push origin main
```

You should **NOT** be prompted for credentials anymore!

