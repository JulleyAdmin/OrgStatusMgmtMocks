#!/bin/bash

echo "🔧 Setting up Git repository for Julley PMS..."

# Initialize Git repository
echo "Initializing Git repository..."
git init

# Add remote origin
echo "Adding remote origin..."
git remote add origin git@github-jo:JulleyAdmin/OrgStatusMgmtMocks.git

# Add all files
echo "Adding all files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Julley PMS Project Management System

- Next.js 15 + Turbo monorepo setup
- Firebase integration with Firestore
- shadcn/ui components
- Tailwind CSS 4
- Authentication system
- Dashboard with sidebar navigation
- Project management features
- Manufacturing & Technology focus (Autocracy branding)
- Multi-tenant architecture support"

# Set main branch
echo "Setting main branch..."
git branch -M main

# Push to remote
echo "Pushing to remote repository..."
git push -u origin main

echo "✅ Git repository setup complete!"
echo "🌐 Remote: git@github-jo:JulleyAdmin/OrgStatusMgmtMocks.git"
echo "📝 You can now use: git add . && git commit -m 'message' && git push"
