# ShotsByFra Portfolio - GitHub Pages Deployment Guide

## 📋 Overview

This directory contains the complete deployment configuration for the ShotsByFra Photography Portfolio website to GitHub Pages.

## 🏗️ Structure

```
deployment/
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── index.html                      # Main application entry point
├── 404.html                        # SPA routing fallback
├── assets/                         # Compiled CSS, JS, and vendor files
├── images/                         # Image assets
└── deployment-instructions.md      # This file
```

## 🚀 Deployment Process

### Option 1: Automatic Deployment (Recommended)

1. **Repository Setup**:
   ```bash
   # Create a new GitHub repository named: franceskomuca.github.io
   # Push the project code to this repository
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: `GitHub Actions`
   - Branch: `main` /root

3. **Push to trigger deployment**:
   ```bash
   git push origin main
   ```

4. **Access your site**:
   - URL: `https://franceskomuca.github.io/franceskomuca.github.io/`
   - Deployment takes ~2-3 minutes

### Option 2: Manual Deployment

1. **Build the project locally**:
   ```bash
   cd shotsbyfra-portfolio
   pnpm install
   pnpm run build:gh-pages
   ```

2. **Upload dist contents**:
   - Copy all files from `dist/` folder
   - Upload to your GitHub repository root
   - Or use GitHub Pages deployment tools

3. **Enable Pages**:
   - Settings → Pages → Source: Deploy from a branch
   - Branch: `main` /root

## ✅ Verification Checklist

After deployment, verify:

- [ ] **Homepage loads correctly**: `https://franceskomuca.github.io/franceskomuca.github.io/`
- [ ] **Navigation works**: All menu items function
- [ ] **Gallery displays**: Image loading and lightbox functionality
- [ ] **Videos section**: YouTube integration working
- [ ] **Responsive design**: Mobile and desktop layouts
- [ ] **404 handling**: Refresh on any route shows proper page
- [ ] **HTTPS enabled**: Security certificate is active

## 🔧 GitHub Actions Workflow

The included workflow:
- ✅ Builds the project with proper base path configuration
- ✅ Deploys to GitHub Pages automatically
- ✅ Handles SPA routing with 404.html
- ✅ Optimizes assets for production
- ✅ Runs on every push to main branch

### Workflow Details:
- **Trigger**: Push to `main` branch
- **Node version**: 18.x
- **Package manager**: pnpm
- **Build command**: `pnpm run build:gh-pages`
- **Deployment**: Uses GitHub Pages Deploy action

## 🌐 Custom Domain Setup (Optional)

To use a custom domain like `www.shotsbyfra.com`:

### 1. Repository Configuration:
```
Settings → Pages → Custom domain: www.shotsbyfra.com
```

### 2. DNS Configuration:
```
# CNAME record
Type: CNAME
Name: www
Value: franceskomuca.github.io

# A records for apex domain
Type: A
Name: @
Value: 185.199.108.153
         185.199.109.153
         185.199.110.153
         185.199.111.153
```

### 3. Update Build Configuration:
Modify `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/', // or your custom domain
  // ... other config
})
```

## 📁 Key Configuration Files

### vite.config.ts
- Sets base path for GitHub Pages
- React plugin configuration
- Source identifier plugin (dev only)

### package.json Scripts
- `build:gh-pages`: Builds with correct base path
- `deploy`: Alias for build:gh-pages
- `preview`: Local preview of built site

### .github/workflows/deploy.yml
- Automated deployment workflow
- Handles permissions and environment setup
- Deploys using GitHub Pages action

## 🛠️ Troubleshooting

### Common Issues:

1. **404 errors on refresh**:
   - Ensure 404.html is in repository root
   - Verify SPA routing configuration

2. **Assets not loading**:
   - Check that base path is correctly set
   - Verify file paths in built index.html

3. **Build failures**:
   - Check Node.js version (should be 18+)
   - Clear node_modules and reinstall dependencies

4. **Pages not deploying**:
   - Verify GitHub Actions has pages write permissions
   - Check workflow logs for errors

### Debug Commands:
```bash
# Check build output
pnpm run build:gh-pages

# Preview locally
pnpm preview

# Test specific route
curl -I https://franceskomuca.github.io/franceskomuca.github.io/about
```

## 📊 Performance Optimizations

The deployment includes:
- ✅ **Asset optimization**: Minified CSS/JS
- ✅ **Code splitting**: Vendor libraries separated
- ✅ **Lazy loading**: Images load on demand
- ✅ **Progressive enhancement**: Works without JS
- ✅ **SEO meta tags**: Proper page titles and descriptions

## 🔄 Update Process

To update the website:

1. **Make changes** to source code
2. **Test locally**: `pnpm run dev`
3. **Build**: `pnpm run build:gh-pages`
4. **Commit and push**: Changes deploy automatically
5. **Verify**: Check live site after deployment

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs
2. Verify repository settings
3. Test with manual deployment first
4. Review browser console for errors

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
**Repository**: `franceskomuca/franceskomuca.github.io`