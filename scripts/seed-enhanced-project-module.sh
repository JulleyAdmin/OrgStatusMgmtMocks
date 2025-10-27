#!/bin/bash

# Enhanced Project Module Seeding Script
# This script seeds the Firebase database with comprehensive project module data

echo "🏭 Starting Enhanced Project Module Seeding..."
echo "=============================================="

# Check if we're in the correct directory
if [ ! -f "apps/pms/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to PMS app directory
cd apps/pms

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if tsx is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not available. Please install Node.js"
    exit 1
fi

# Run the enhanced project module seeding script
echo "🌱 Seeding Enhanced Project Module database..."
echo ""

npx tsx src/scripts/seed-enhanced-project-module.ts

echo ""
echo "✅ Enhanced Project Module seeding completed!"
echo ""
echo "📊 What was created:"
echo "   👥 5 Demo users with different roles"
echo "   🏗️ 2 Comprehensive projects with full lifecycle data"
echo "   📋 Multiple project phases with dependencies"
echo "   📦 Project deliverables with approval workflows"
echo "   🔧 Project resources (equipment, materials, personnel)"
echo "   ⚠️ Project risks with mitigation plans"
echo "   🎯 Project milestones with dependencies"
echo "   📋 Project templates for different equipment types"
echo "   💰 Budget tracking by category"
echo "   ⏰ Time tracking entries"
echo ""
echo "🔐 Login Credentials:"
echo "   admin@autocracy.com / password123"
echo "   sarah.manager@autocracy.com / password123"
echo "   mike.dev@autocracy.com / password123"
echo "   lisa.designer@autocracy.com / password123"
echo "   david.marketing@autocracy.com / password123"
echo ""
echo "🎉 Ready to use the Enhanced Project Module!"
