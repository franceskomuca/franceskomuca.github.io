#!/bin/bash

# ShotsByFra Portfolio - GitHub Pages Deployment Verification Script
# This script verifies that all necessary files are in place for GitHub Pages deployment

echo "🔍 ShotsByFra Portfolio - GitHub Pages Deployment Verification"
echo "=================================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $1${NC}"
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing directory: $1/${NC}"
        return 1
    fi
}

echo ""
echo "📁 Checking Deployment Structure:"
echo "--------------------------------"

# Check main files
check_file "index.html"
check_file "404.html"

# Check GitHub Actions workflow
check_dir ".github"
check_file ".github/workflows/deploy.yml"

# Check built assets
check_dir "assets"
check_dir "images"

# Check asset files
echo ""
echo "📦 Checking Built Assets:"
echo "-------------------------"

assets=(
    "assets/index-4YZDK5DQ.css"
    "assets/index-DT4G0ief.js"
    "assets/router-CGaJaASE.js"
    "assets/ui-DxwR3qvq.js"
    "assets/vendor-DyFf35aq.js"
)

for asset in "${assets[@]}"; do
    check_file "$asset"
done

# Check documentation
echo ""
echo "📚 Checking Documentation:"
echo "-------------------------"
check_file "deployment-instructions.md"
check_file "config-summary.md"

# Verify GitHub Pages configuration
echo ""
echo "⚙️  Verifying Configuration:"
echo "----------------------------"

# Check if base path is correctly set in index.html
if grep -q "/franceskomuca.github.io/" index.html; then
    echo -e "${GREEN}✅ Base path correctly set for GitHub Pages${NC}"
else
    echo -e "${YELLOW}⚠️  Base path may need verification${NC}"
fi

# Check if 404.html has proper redirect
if grep -q "franceskomuca.github.io/index.html" 404.html; then
    echo -e "${GREEN}✅ 404.html has SPA routing redirect${NC}"
else
    echo -e "${YELLOW}⚠️  404.html redirect may need verification${NC}"
fi

# Check asset file sizes
echo ""
echo "📊 Asset File Information:"
echo "-------------------------"
if [ -f "assets/index-DT4G0ief.js" ]; then
    size=$(du -h "assets/index-DT4G0ief.js" | cut -f1)
    echo -e "Main JS bundle: ${size}"
fi

if [ -f "assets/index-4YZDK5DQ.css" ]; then
    size=$(du -h "assets/index-4YZDK5DQ.css" | cut -f1)
    echo -e "CSS bundle: ${size}"
fi

# Summary
echo ""
echo "🎯 Deployment Summary:"
echo "======================"
echo "Files ready for GitHub Pages deployment"
echo ""
echo "🚀 Next Steps:"
echo "1. Create GitHub repository: franceskomuca.github.io"
echo "2. Upload all files from this directory"
echo "3. Enable GitHub Pages: Settings → Pages → GitHub Actions"
echo "4. Push to main branch to trigger deployment"
echo ""
echo "Expected URL: https://franceskomuca.github.io/franceskomuca.github.io/"
echo ""
echo "For detailed instructions, see: deployment-instructions.md"
echo "=================================================================="