#!/bin/bash

echo "🧹 Cleaning Julley PMS project for fresh installation..."

# Remove node_modules and lock files
echo "Removing node_modules and lock files..."
rm -rf node_modules
rm -rf apps/pms/node_modules
rm -f package-lock.json
rm -f apps/pms/package-lock.json
rm -rf .next
rm -rf apps/pms/.next
rm -rf .turbo

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install

# Install PMS app dependencies
echo "Installing PMS app dependencies..."
cd apps/pms
npm install
cd ../..

echo "✅ Clean installation complete!"
echo "🚀 You can now run: npm run dev"
