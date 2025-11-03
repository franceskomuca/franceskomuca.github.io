#!/bin/bash

# ShotsByFra Portfolio - Manual Deployment Script
# This script builds and pushes the website to GitHub Pages

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/franceskomuca/franceskomuca.github.io.git"
PROJECT_DIR="shotsbyfra-portfolio"
BRANCH="main"

echo -e "${BLUE}=== ShotsByFra Portfolio Manual Deployment ===${NC}"
echo "Repository: $REPO_URL"
echo "Branch: $BRANCH"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    echo "Expected to find either package.json or $PROJECT_DIR directory"
    exit 1
fi

# Navigate to project directory if it exists
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    echo -e "${GREEN}✓ Changed to $PROJECT_DIR directory${NC}"
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠ pnpm not found. Please install pnpm:${NC}"
    echo "npm install -g pnpm"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo -e "${BLUE}Step 2: Running pre-build checks...${NC}"

# Run linting (non-blocking)
echo "Running linter..."
if pnpm run lint; then
    echo -e "${GREEN}✓ Linting passed${NC}"
else
    echo -e "${YELLOW}⚠ Linting completed with warnings${NC}"
fi

# Run type checking (non-blocking)
echo "Running type check..."
if pnpm run type-check; then
    echo -e "${GREEN}✓ Type checking passed${NC}"
else
    echo -e "${YELLOW}⚠ Type checking completed with warnings${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Building for production...${NC}"
pnpm run build
echo -e "${GREEN}✓ Build completed${NC}"

# Verify build output
echo ""
echo -e "${BLUE}Step 4: Verifying build output...${NC}"
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓ Build artifacts verified${NC}"
    echo "Build size: $(du -sh dist/ | cut -f1)"
else
    echo -e "${RED}✗ Build verification failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 5: Git operations...${NC}"

# Check if git repository is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git remote add origin "$REPO_URL"
fi

# Check git status
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠ No changes to commit${NC}"
    echo "Building and verifying only. No deployment needed."
else
    echo "Changes detected. Preparing commit..."
    
    # Add files
    git add .
    
    # Create commit message with timestamp
    COMMIT_MSG="Deploy ShotsByFra portfolio - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "Commit message: $COMMIT_MSG"
    
    # Commit changes
    git commit -m "$COMMIT_MSG"
    
    # Check if remote origin exists
    if git remote get-url origin &> /dev/null; then
        # Push to GitHub (this will trigger GitHub Actions)
        echo ""
        echo -e "${BLUE}Step 6: Pushing to GitHub...${NC}"
        echo "This will trigger automatic deployment via GitHub Actions"
        
        # Check if branch exists remotely
        if git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
            git push origin "$BRANCH"
        else
            echo "Branch doesn't exist remotely. Setting upstream..."
            git push -u origin "$BRANCH"
        fi
        
        echo -e "${GREEN}✓ Changes pushed to GitHub${NC}"
        echo ""
        echo -e "${GREEN}=== Deployment initiated successfully! ===${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Monitor deployment at: https://github.com/franceskomuca/franceskomuca.github.io/actions"
        echo "2. Check website at: https://franceskomuca.github.io/franceskomuca.github.io/"
        echo "3. Enable custom domain in repository settings if needed"
    else
        echo -e "${YELLOW}⚠ Remote origin not configured${NC}"
        echo "Please configure remote origin:"
        echo "git remote add origin $REPO_URL"
    fi
fi

echo ""
echo -e "${BLUE}=== Manual deployment script completed ===${NC}"