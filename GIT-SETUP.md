# Git Setup Commands for Julley PMS

## Manual Git Setup Instructions

Since the terminal automation isn't working, please run these commands manually in your terminal:

### 1. Initialize Git Repository
```bash
cd /Users/gsuresh86/Projects/julley/Julley-PMS
git init
```

### 2. Add Remote Origin
```bash
git remote add origin git@github-jo:JulleyAdmin/OrgStatusMgmtMocks.git
```

### 3. Add All Files
```bash
git add .
```

### 4. Create Initial Commit
```bash
git commit -m "Initial commit: Julley PMS Project Management System

- Next.js 15 + Turbo monorepo setup
- Firebase integration with Firestore
- shadcn/ui components
- Tailwind CSS 4
- Authentication system
- Dashboard with sidebar navigation
- Project management features
- Manufacturing & Technology focus (Autocracy branding)
- Multi-tenant architecture support
- Platform app for tenant management"
```

### 5. Set Main Branch
```bash
git branch -M main
```

### 6. Push to Remote
```bash
git push -u origin main
```

## Alternative: Use the Setup Script

If you prefer, you can also run the setup script:
```bash
chmod +x setup-git.sh
./setup-git.sh
```

## Verification

After setup, verify the remote is configured correctly:
```bash
git remote -v
```

You should see:
```
origin  git@github-jo:JulleyAdmin/OrgStatusMgmtMocks.git (fetch)
origin  git@github-jo:JulleyAdmin/OrgStatusMgmtMocks.git (push)
```

## Future Git Operations

After the initial setup, you can use these commands for regular development:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull
```
