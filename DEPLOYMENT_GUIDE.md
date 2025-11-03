# ShotsByFra Portfolio - Complete Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Custom Domain Setup](#custom-domain-setup)
5. [API Key Configuration](#api-key-configuration)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Maintenance and Updates](#maintenance-and-updates)
8. [Performance Monitoring](#performance-monitoring)

---

## Overview

The ShotsByFra portfolio is a cinematic photography website built with React, TypeScript, and Vite, deployed on GitHub Pages with Supabase backend integration for Google Drive and YouTube API connectivity.

**Current Deployment Status:**
- ✅ Frontend: React + TypeScript + Vite
- ✅ Backend: Supabase (Edge Functions + Database)
- ✅ Hosting: GitHub Pages with automatic deployment
- 🔄 API Integration: Requires API keys for full functionality

---

## Prerequisites

### Required Accounts
- **GitHub Account** (for repository hosting)
- **Google Cloud Account** (for API keys)
- **Supabase Account** (for backend services)

### Required Tools
- Node.js 18+ installed locally
- pnpm package manager
- Git command line tool

### System Requirements
- Minimum 2GB RAM for local development
- Internet connection for API access
- Modern web browser for testing

---

## Step-by-Step Deployment

### Phase 1: Repository Setup

#### 1.1 Clone/Initialize Repository
```bash
# If starting fresh
git init
git remote add origin https://github.com/franceskomuca/franceskomuca.github.io.git

# If using existing repository
git clone https://github.com/franceskomuca/franceskomuca.github.io.git
cd franceskomuca.github.io
```

#### 1.2 Install Dependencies
```bash
# Install all project dependencies
pnpm install

# Verify installation
pnpm --version
```

### Phase 2: Environment Configuration

#### 2.1 Create Environment File
Create `.env` file in project root:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google APIs
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

#### 2.2 Verify Environment Setup
```bash
# Test local development server
pnpm run dev

# Expected output: Server running on http://localhost:5173
```

### Phase 3: Database Setup (Supabase)

#### 3.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down:
   - Project URL
   - Anonymous Key
   - Service Role Key

#### 3.2 Deploy Database Schema
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your_project_ref

# Deploy database migration
supabase db push

# Deploy Edge Functions
supabase functions deploy sync-google-drive
supabase functions deploy sync-youtube-videos
supabase functions deploy get-photos
supabase functions deploy get-videos
```

#### 3.3 Configure Supabase Secrets
```bash
# Set API keys as secrets
supabase secrets set GOOGLE_DRIVE_API_KEY=your_api_key
supabase secrets set YOUTUBE_API_KEY=your_api_key
```

### Phase 4: GitHub Repository Secrets

#### 4.1 Add Repository Secrets
1. Go to GitHub repository settings
2. Navigate to Secrets and Variables → Actions
3. Add the following secrets:

```
GOOGLE_DRIVE_API_KEY
YOUTUBE_API_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Phase 5: Build and Deploy

#### 5.1 Local Testing
```bash
# Build for production
pnpm run build

# Preview build locally
pnpm run preview

# Verify build output in dist/ directory
ls -la dist/
```

#### 5.2 Pre-Deployment Validation
Run these tests before pushing to production:

```bash
# Check for TypeScript errors
pnpm run lint

# Build and preview
pnpm run build && pnpm run preview

# Test all pages in browser:
# - Homepage
# - About section
# - Contact form functionality
# - Gallery sections (Videos/Photos)
# - Showreel video playback
# - Email links (contact@shotsbyfra.com)
```

**Expected Results:**
- ✅ All pages load without errors
- ✅ Navigation works smoothly
- ✅ Video playback functions
- ✅ Contact links work correctly
- ✅ No console errors present

#### 5.3 Deploy to GitHub Pages
```bash
# Method 1: Using the deploy script
pnpm run deploy

# Method 2: Manual deployment
pnpm run build:gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# GitHub Actions will automatically deploy
```

#### 5.4 Verify Deployment

**Automated Checks:**
1. Check GitHub Actions tab for build/deploy status
2. Verify no failed workflows
3. Confirm deployment URL is accessible

**Manual Testing Checklist:**
- [ ] **Homepage**: Loads with all sections (About, Contact, Videos, Photos)
- [ ] **Navigation**: All menu items scroll to correct sections
- [ ] **Showreel**: Video plays correctly in modal
- [ ] **Contact**: Email link (contact@shotsbyfra.com) works
- [ ] **Mobile**: Website responsive on mobile devices
- [ ] **Performance**: Page loads within 3 seconds
- [ ] **Console**: No JavaScript errors in browser console

**API Integration Verification (when configured):**
- [ ] **Google Drive**: Gallery shows real photos from Google Drive folder
- [ ] **YouTube**: Videos page displays latest channel videos
- [ ] **Sync**: Manual sync button works correctly
- [ ] **Error Handling**: Proper error messages for API failures

---

## Custom Domain Setup

### For GitHub Pages Custom Domain (e.g., shotsbyfra.com)

#### Step 1: GitHub Repository Configuration
1. Go to repository Settings → Pages
2. Under "Custom domain", enter: `www.shotsbyfra.com`
3. Click "Save"
4. Wait for DNS check to complete
5. Enable "Enforce HTTPS"

#### Step 2: DNS Configuration
Configure your domain's DNS settings:

**If using Cloudflare:**
```
Type: CNAME
Name: www
Content: franceskomuca.github.io
Proxied: Yes (orange cloud)

Type: A
Name: @
Content: 185.199.108.153
TTL: Auto

Type: A  
Name: @
Content: 185.199.109.153
TTL: Auto

Type: A
Name: @
Content: 185.199.110.153
TTL: Auto

Type: A
Name: @
Content: 185.199.111.153
TTL: Auto
```

**If using other DNS providers:**
```
Type: CNAME
Name: www
Value: franceskomuca.github.io

Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

#### Step 3: SSL Certificate
- GitHub automatically provisions SSL certificates
- Process takes 5-24 hours after DNS configuration
- Certificate will be automatically renewed

#### Step 4: Verification
```bash
# Test custom domain
curl -I https://www.shotsbyfra.com
curl -I http://www.shotsbyfra.com  # Should redirect to HTTPS
```

---

## API Key Configuration

### Google Drive API Setup

#### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable "Google Drive API"

#### Step 2: Create API Key
1. Navigate to "Credentials" → "Create Credentials" → "API Key"
2. Copy the API key
3. Restrict to Google Drive API only (recommended)
4. Set HTTP referrer restrictions:
   ```
   https://*.supabase.co/*
   https://franceskomuca.github.io/*
   ```

#### Step 3: OAuth Consent Screen
1. Configure OAuth consent screen
2. Add testing users if needed
3. Add required scopes for Google Drive

### YouTube Data API Setup

#### Step 1: Enable API
1. In Google Cloud Console
2. Enable "YouTube Data API v3"

#### Step 2: Create API Key
1. Create new API key
2. Restrict to YouTube Data API v3
3. Set application restrictions:
   ```
   HTTP referrer restrictions:
   https://*.supabase.co/*
   https://franceskomuca.github.io/*
   ```

#### Step 3: API Quotas
- Default quota: 10,000 units/day
- Video search costs 100 units
- Channel list costs 1 unit
- Consider quota management for production

### Supabase Configuration

#### Step 1: Environment Variables
Set these in both GitHub repository secrets and local `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 2: Database Tables
The following tables are created automatically:
- `photos` - Gallery images metadata
- `videos` - YouTube videos metadata
- `sync_logs` - Content synchronization logs

#### Step 3: Edge Functions
Four Edge Functions handle API integrations:
- `sync-google-drive` - Syncs photos from Google Drive
- `sync-youtube-videos` - Syncs videos from YouTube
- `get-photos` - Retrieves photos for frontend
- `get-videos` - Retrieves videos for frontend

---

## Troubleshooting Guide

### Common Deployment Issues

#### Issue 1: Build Fails with TypeScript Errors
**Symptoms:**
- GitHub Actions build fails
- TypeScript compilation errors
- Missing type definitions

**Solution:**
```bash
# Clear node modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Run type checking
pnpm run build

# Fix any TypeScript errors in src/ files
```

#### Issue 2: Environment Variables Not Loading
**Symptoms:**
- "Invalid supabaseUrl" error
- API calls failing
- Missing environment variables

**Solution:**
1. Verify variables are set in GitHub repository secrets
2. Check environment file format (.env)
3. Ensure VITE_ prefix for frontend variables
4. Redeploy after adding secrets

```bash
# Test locally
echo $VITE_SUPABASE_URL

# In deployment logs, verify secrets are injected
```

#### Issue 3: GitHub Pages Not Updating
**Symptoms:**
- Old content showing
- 404 errors
- Build successful but no changes

**Solution:**
1. Check GitHub Actions deployment logs
2. Verify correct branch is configured
3. Wait 5-10 minutes for CDN refresh
4. Force refresh browser cache (Ctrl+F5)

```bash
# Verify GitHub Pages URL
curl -I https://franceskomuca.github.io/franceskomuca.github.io/
```

#### Issue 4: API Integration Errors
**Symptoms:**
- Gallery shows placeholder images
- Videos not loading
- Sync button not working

**Solution:**
1. Verify API keys are valid and not expired
2. Check API quotas have not been exceeded
3. Verify Supabase Edge Functions are deployed
4. Check browser console for CORS errors

```javascript
// Browser console - check for errors
console.error('API Error:', error.message)
```

#### Issue 5: Custom Domain SSL Issues
**Symptoms:**
- "Not secure" warnings
- SSL certificate errors
- Mixed content warnings

**Solution:**
1. Wait 24 hours for certificate provisioning
2. Verify DNS records are correct
3. Check GitHub Pages custom domain settings
4. Clear browser cache and cookies

```bash
# Test SSL certificate
curl -I https://www.shotsbyfra.com

# Check certificate details
openssl s_client -connect www.shotsbyfra.com:443 -servername www.shotsbyfra.com
```

### Performance Issues

#### Issue 6: Slow Loading Times
**Symptoms:**
- Long initial page load
- Image gallery loads slowly
- Poor mobile performance

**Solutions:**
1. Enable GitHub Pages compression
2. Optimize images (use WebP format)
3. Implement lazy loading (already configured)
4. Use a CDN if needed

#### Issue 7: Mobile Responsiveness
**Symptoms:**
- Layout broken on mobile
- Text too small
- Touch interactions not working

**Solutions:**
1. Test on various devices
2. Check responsive breakpoints
3. Verify viewport meta tag
4. Test touch interactions

### API and Backend Issues

#### Issue 8: Supabase Connection Errors
**Symptoms:**
- Database queries failing
- Authentication errors
- Timeouts on API calls

**Solutions:**
1. Verify Supabase URL and keys
2. Check database connection limits
3. Review Edge Function logs
4. Verify RLS policies

```bash
# Check Supabase logs
supabase logs --project-ref your_project_ref
```

#### Issue 9: Google Drive API Errors
**Symptoms:**
- "API key invalid" errors
- Permission denied errors
- Quota exceeded warnings

**Solutions:**
1. Check API key restrictions
2. Verify Google Drive API is enabled
3. Review OAuth consent screen
4. Check API usage quotas

#### Issue 10: YouTube API Issues
**Symptoms:**
- Videos not loading
- Channel information missing
- API quota exceeded errors

**Solutions:**
1. Verify YouTube API key is valid
2. Check channel ID is correct
3. Monitor API usage in Google Cloud Console
4. Consider implementing API key rotation

---

## Maintenance and Updates

### Regular Maintenance Tasks

#### Weekly Tasks
1. **Monitor API Usage**
   - Check Google Cloud Console quotas
   - Review Supabase dashboard
   - Monitor GitHub Actions runs

2. **Check Website Health**
   - Test all pages load correctly
   - Verify contact forms work
   - Check mobile responsiveness

3. **Review Error Logs**
   - GitHub Actions logs
   - Supabase function logs
   - Browser console errors

#### Monthly Tasks
1. **Update Dependencies**
   ```bash
   # Check for updates
   pnpm outdated
   
   # Update packages
   pnpm update
   
   # Test after updates
   pnpm run build
   ```

2. **Review API Performance**
   - Monitor response times
   - Check error rates
   - Analyze usage patterns

3. **Security Updates**
   - Review GitHub repository security
   - Update API keys if compromised
   - Check for security advisories

#### Quarterly Tasks
1. **Performance Audit**
   - Lighthouse audits
   - Mobile performance testing
   - SEO optimization review

2. **Content Review**
   - Update portfolio images
   - Add new videos
   - Refresh testimonials

### Content Management

#### Adding New Photos
1. Upload to Google Drive folder: `1jMUVG-ma5w9Xz82YFA534E0aElpG_yT-`
2. Name files as `1.jpg`, `2.jpg`, etc.
3. Trigger manual sync from website
4. Wait for Edge Function to process

#### Adding New Videos
1. Upload videos to YouTube channel @ShotsByFra
2. Wait for automatic sync (runs daily)
3. Or trigger manual sync from website
4. Videos will appear automatically with metadata

#### Manual Content Sync
```bash
# Via website UI:
# 1. Go to homepage
# 2. Click "Sync Content" button
# 3. Wait for confirmation message

# Via Supabase CLI:
curl -X POST https://your-project.supabase.co/functions/v1/sync-google-drive
curl -X POST https://your-project.supabase.co/functions/v1/sync-youtube-videos
```

### Backup Procedures

#### Database Backup
```bash
# Export Supabase data
supabase db dump > backup_$(date +%Y%m%d).sql

# Backup Edge Functions
supabase functions list > functions_backup.txt
```

#### Code Repository Backup
```bash
# Ensure all changes are committed
git add .
git commit -m "Monthly backup - $(date)"
git push origin main
```

### Monitoring Setup

#### Uptime Monitoring
- Set up monitoring for `https://www.shotsbyfra.com`
- Monitor GitHub Actions workflow status
- Track API response times

#### Analytics Setup
1. Google Analytics (if not already configured)
2. GitHub Pages usage statistics
3. Supabase dashboard monitoring

#### Alert Configuration
- API quota warnings
- Website downtime alerts
- Build failure notifications

---

## Performance Monitoring

### Key Performance Indicators (KPIs)

#### Technical KPIs
- **Page Load Time**: Target < 3 seconds
- **First Contentful Paint**: Target < 1.5 seconds
- **Largest Contentful Paint**: Target < 2.5 seconds
- **Cumulative Layout Shift**: Target < 0.1

#### Business KPIs
- **Page Views**: Monthly active users
- **Photo Gallery Views**: Content engagement
- **Contact Form Submissions**: Lead generation
- **Video Play Rate**: Content performance

### Monitoring Tools

#### Google Lighthouse
```bash
# Run lighthouse audit
npx lighthouse https://www.shotsbyfra.com --output html --output-path ./lighthouse-report.html
```

#### Performance Testing
1. Test on multiple devices
2. Monitor under different network conditions
3. Use browser dev tools
4. Test with 3G throttling

#### API Performance
- Monitor Supabase function response times
- Track Google API usage and costs
- Review YouTube API quota usage

### Optimization Guidelines

#### Image Optimization
1. Use WebP format with JPEG fallbacks
2. Implement responsive images
3. Use appropriate compression levels
4. Consider image CDN for production

#### Code Optimization
1. Code splitting (already implemented)
2. Lazy loading (already implemented)
3. Bundle size optimization
4. Tree shaking unused code

#### Network Optimization
1. Enable compression
2. Use browser caching
3. Optimize font loading
4. Minimize HTTP requests

---

## Support and Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)

### Support Contacts
- **GitHub Issues**: Use repository issue tracker
- **Supabase Support**: Available through dashboard
- **Google Cloud Support**: Community forums and paid support

### Emergency Procedures

#### Website Down
1. Check GitHub repository status
2. Verify DNS configuration
3. Review GitHub Pages status
4. Check Supabase service status

#### API Failures
1. Verify API key validity
2. Check quota usage
3. Review error logs
4. Implement fallback content

#### Data Loss Prevention
1. Regular database backups
2. Version control for code
3. Image backups in Google Drive
4. Documentation updates

---

## Appendix

### Useful Commands

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run linting

# Supabase
supabase login        # Login to Supabase
supabase link         # Link to project
supabase db push      # Deploy database schema
supabase functions deploy  # Deploy Edge Functions
supabase logs         # View function logs

# Git
git add .             # Add all changes
git commit -m "msg"   # Commit changes
git push origin main  # Push to repository
git status            # Check repository status

# Deployment
pnpm run deploy       # Deploy to GitHub Pages
```

### File Structure Reference

```
shotsbyfra-portfolio/
├── src/
│   ├── components/          # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   └── App.tsx             # Main application
├── public/                 # Static assets
├── dist/                   # Built application (generated)
├── supabase/              # Backend configuration
│   ├── functions/         # Edge Functions
│   └── migrations/        # Database migrations
├── .github/workflows/     # GitHub Actions
├── .env                   # Environment variables (local only)
└── package.json           # Project configuration
```

### Environment Variables Reference

| Variable | Purpose | Where to Set |
|----------|---------|--------------|
| `VITE_SUPABASE_URL` | Supabase project URL | GitHub Secrets + .env |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | GitHub Secrets + .env |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | GitHub Secrets only |
| `GOOGLE_DRIVE_API_KEY` | Google Drive API key | GitHub Secrets only |
| `YOUTUBE_API_KEY` | YouTube API key | GitHub Secrets only |
| `VITE_BASE_PATH` | GitHub Pages base path | GitHub Actions |

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-03  
**Maintained By**: ShotsByFra Development Team  
**Next Review**: 2025-02-03