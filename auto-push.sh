#!/bin/bash

# 🎯 ShotsByFra Website - Auto Push Script
# This script will automatically push your website to GitHub

echo "🚀 ShotsByFra GitHub Push - Starting..."
echo "======================================"

# Change to deployment directory
cd /workspace/deployment/

# Verify we're ready
echo "📊 Checking repository status..."
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Run: git init"
    exit 1
fi

echo "✅ Git repository ready"

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/franceskomuca/franceskomuca.github.io.git
fi

# Check current status
echo "📈 Repository status:"
git status --porcelain | head -5
echo "... and $(git status --porcelain | wc -l) total files"

# Ensure we're on main branch
git branch -M main

echo ""
echo "🚀 Ready to push to GitHub!"
echo "Your website will be live at: https://franceskomuca.github.io"
echo ""
echo "Press Enter to continue with push, or Ctrl+C to cancel..."
read

# Attempt the push
echo "🔄 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your ShotsByFra website is now on GitHub!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Enable GitHub Pages: https://github.com/franceskomuca/franceskomuca.github.io/settings/pages"
    echo "2. Select 'GitHub Actions' as source"
    echo "3. Your site will be live at: https://franceskomuca.github.io"
    echo ""
    echo "📖 Don't forget to set up your API keys for automatic content updates!"
else
    echo ""
    echo "❌ Push failed - authentication required"
    echo "💡 Try:"
    echo "   git push -u origin main"
    echo "   (You'll be prompted for your GitHub credentials)"
fi