#!/bin/bash

# ShotsByFra GitHub Push Script
# This script will push your website to GitHub Pages

echo "🚀 ShotsByFra Website - GitHub Push Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the /workspace/deployment/ directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📄 Files ready for push:"
ls -la | grep -E "\.html$|\.css$|\.js$|\.yml$|\.md$"

echo ""
echo "🔧 Setting up GitHub repository..."

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add remote repository
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/franceskomuca/franceskomuca.github.io.git

# Ensure we're on main branch
echo "🌿 Checking branch..."
git branch -M main

# Show current status
echo ""
echo "📊 Git Status:"
git status --short

echo ""
echo "🚀 Ready to push! Execute this command:"
echo "   git push -u origin main"
echo ""
echo "📖 After push:"
echo "   1. Enable GitHub Pages: Settings → Pages → GitHub Actions"
echo "   2. Your site will be live at: https://franceskomuca.github.io"
echo "   3. Configure API keys for automatic content updates"
echo ""
echo "🔑 Don't forget to set up your API keys in GitHub repository secrets!"
echo "   - Google Drive API Key"
echo "   - YouTube Data API v3 Key"
echo "   - Supabase credentials"
echo ""
echo "Press Enter to continue with the push, or Ctrl+C to cancel..."
read

# Perform the push
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your ShotsByFra website is now on GitHub!"
    echo ""
    echo "🌐 Your website will be available at:"
    echo "   https://franceskomuca.github.io"
    echo ""
    echo "⚙️  Next steps:"
    echo "   1. Enable GitHub Pages in repository settings"
    echo "   2. Set up your custom domain (see CUSTOM-DOMAIN-SETUP.md)"
    echo "   3. Configure API keys for Google Drive & YouTube integration"
    echo "   4. Read DEPLOYMENT_GUIDE.md for complete setup instructions"
    echo ""
    echo "🎉 Your cinematic photography portfolio is ready to showcase your work!"
else
    echo ""
    echo "❌ Push failed. Please check your GitHub credentials and try again."
    echo "💡 You might need to:"
    echo "   - Set up SSH keys for GitHub"
    echo "   - Use a personal access token instead of password"
    echo "   - Check your internet connection"
fi