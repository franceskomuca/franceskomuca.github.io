# Deployment Troubleshooting Guide

This guide covers common issues and solutions for deploying the ShotsByFra portfolio website.

## Quick Diagnostics

### Check Deployment Status
1. **GitHub Actions**: https://github.com/franceskomuca/franceskomuca.github.io/actions
2. **Website URL**: https://franceskomuca.github.io/franceskomuca.github.io/
3. **Repository Settings**: Pages section for configuration

### Common Commands
```bash
# Check build locally
pnpm run build

# Check git status
git status

# Test website locally
pnpm preview

# Check Node.js version
node --version

# Check pnpm version
pnpm --version
```

## Build and Deployment Issues

### Issue: Build Failures

#### Symptoms
- GitHub Actions build job fails
- Error messages in build logs
- Local build works but CI fails

#### Solutions

**1. Dependency Issues**:
```bash
# Clear pnpm cache
pnpm store prune

# Delete node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Build with verbose logging
pnpm run build -- --debug
```

**2. Node.js Version Mismatch**:
- Ensure GitHub Actions uses Node.js 18 (configured in workflow)
- Local development should also use Node.js 18
- Check: `.nvmrc` or `package.json` engines field

**3. Environment Variables**:
```bash
# Set required environment variables
export VITE_BASE_PATH=/franceskomuca.github.io/
export NODE_ENV=production

# Verify they're set
echo $VITE_BASE_PATH
echo $NODE_ENV
```

**4. TypeScript Errors**:
```bash
# Run type checking
pnpm run type-check

# Fix common issues:
# - Update @tsconfig/recommended if needed
# - Check import/export statements
# - Verify path mappings in tsconfig.json
```

### Issue: Deployment Not Triggering

#### Symptoms
- Changes pushed but no GitHub Actions run
- Workflow doesn't appear in Actions tab

#### Solutions

**1. Check Branch Name**:
```bash
# Verify you're on main branch
git branch

# If on different branch, merge to main
git checkout main
git merge feature-branch
git push origin main
```

**2. Verify Workflow File**:
- Check: `.github/workflows/deploy.yml` exists
- Verify: YAML syntax is correct
- Ensure: `on:` section includes `push: branches: [ main ]`

**3. Check Repository Permissions**:
- Go to repository Settings → Actions
- Ensure "Allow all actions and reusable workflows" is enabled
- Check if Actions are disabled for the repository

### Issue: Build Works but Website Doesn't Update

#### Symptoms
- GitHub Actions shows successful deployment
- Old content still appears on website
- Cache-related issues

#### Solutions

**1. Clear Browser Cache**:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache and cookies
- Test in incognito/private mode

**2. Verify Deployment URL**:
- Check: Repository Settings → Pages → Your site is published at
- Verify: URL matches your expectations

**3. Force Cache Invalidation**:
```bash
# Add cache-busting query parameter
# Edit index.html to add timestamp
sed -i "s|<title>|<title>$(date +%s)|g" dist/index.html
```

## Git and Repository Issues

### Issue: Git Push Fails

#### Symptoms
- `git push` fails with permission errors
- Authentication failures
- Remote rejects changes

#### Solutions

**1. Check Remote URL**:
```bash
# View remote configuration
git remote -v

# Update remote if needed
git remote set-url origin https://github.com/franceskomuca/franceskomuca.github.io.git
```

**2. Authentication Issues**:
```bash
# Use personal access token instead of password
# Token should have repo permissions
git remote set-url origin https://username:token@github.com/franceskomuca/franceskomuca.github.io.git
```

**3. Branch Protection**:
- Check: Repository Settings → Branches
- If main branch is protected, ensure status checks pass
- May need to create pull request instead of direct push

### Issue: Merge Conflicts

#### Symptoms
- `git merge` or `git pull` fails with conflicts
- Cannot push changes

#### Solutions

**1. Resolve Conflicts**:
```bash
# Check conflict status
git status

# Edit conflicted files
# Remove conflict markers (<<<<<<<, =======, >>>>>>>)

# Add resolved files
git add .

# Complete merge
git commit
```

**2. Abort Merge if Needed**:
```bash
git merge --abort
```

## Network and Connectivity Issues

### Issue: Slow Deployment

#### Symptoms
- GitHub Actions takes >10 minutes
- Build or deployment phase timeout

#### Solutions

**1. Optimize Build Process**:
- Check for unnecessary dependencies
- Use `pnpm install --frozen-lockfile`
- Enable dependency caching in GitHub Actions

**2. Large Asset Issues**:
```bash
# Check build size
du -sh dist/

# Optimize images
# - Compress large images
# - Use WebP format when possible
# - Implement lazy loading for below-fold images
```

### Issue: DNS and Custom Domain Problems

#### Symptoms
- Custom domain doesn't resolve
- Mixed content warnings
- SSL certificate errors

#### Solutions

**1. DNS Propagation**:
```bash
# Check DNS resolution
dig www.shotsbyfra.com

# Use online DNS checker
# https://www.whatsmydns.net/
```

**2. SSL Certificate Issues**:
- Wait for GitHub to provision certificate (up to 24 hours)
- Verify DNS is correctly configured
- Check GitHub Pages settings for HTTPS enforcement

**3. Mixed Content**:
- Ensure all resources use HTTPS URLs
- Check for hardcoded HTTP links in code
- Update any API endpoints to use HTTPS

## Performance Issues

### Issue: Slow Website Loading

#### Symptoms
- High Time to First Byte (TTFB)
- Slow Largest Contentful Paint (LCP)
- Large bundle sizes

#### Solutions

**1. Analyze Bundle Size**:
```bash
# Install bundle analyzer
pnpm add -D @bundle-analyzer/vite-plugin

# Analyze production bundle
pnpm run build:analyze
```

**2. Optimize Images**:
- Compress images before adding to repository
- Use appropriate image formats (WebP, AVIF)
- Implement responsive images

**3. Code Splitting**:
- Review `vite.config.js` for optimization
- Ensure lazy loading for routes
- Check for duplicate dependencies

### Issue: Mobile Performance

#### Symptoms
- Poor mobile experience
- High mobile bounce rate
- Slow mobile load times

#### Solutions

**1. Mobile Optimization**:
```bash
# Test mobile performance
# Use Chrome DevTools device emulation

# Check for:
# - Large images not optimized for mobile
# - Blocking JavaScript
# - Unused CSS
```

**2. Progressive Enhancement**:
- Ensure core content loads without JavaScript
- Use lazy loading for images
- Implement service worker for caching

## Environment-Specific Issues

### Issue: Local vs Production Differences

#### Symptoms
- Works locally but fails in production
- Environment variable issues
- Path resolution problems

#### Solutions

**1. Environment Variables**:
```bash
# Check local environment
echo $NODE_ENV
echo $VITE_BASE_PATH

# Set production-like environment
export NODE_ENV=production
export VITE_BASE_PATH=/franceskomuca.github.io/
pnpm run build
```

**2. Path Resolution**:
- Use relative paths when possible
- Set correct base path for GitHub Pages
- Test with `pnpm preview` before deploying

### Issue: API Integration Failures

#### Symptoms
- Google Drive integration doesn't work
- YouTube videos don't load
- API errors in browser console

#### Solutions

**1. Check API Keys**:
```bash
# Verify GitHub repository secrets
# Repository Settings → Secrets and variables → Actions
# Ensure GOOGLE_DRIVE_API_KEY and YOUTUBE_API_KEY are set
```

**2. API Quota Issues**:
- Check Google Cloud Console quotas
- Monitor YouTube API usage
- Implement fallback for API failures

**3. CORS Issues**:
- Verify API endpoints support CORS
- Check browser console for CORS errors
- Ensure proper API key configuration

## Emergency Procedures

### Rollback Deployment

If deployment causes critical issues:

**1. Revert Git Commit**:
```bash
# Find previous working commit
git log --oneline

# Revert to previous commit
git revert HEAD
git push origin main
```

**2. Use GitHub Actions Rollback**:
- Go to Actions tab
- Find successful workflow run
- Click "Re-run all jobs" for that commit

### Disable Automatic Deployment

If automatic deployment is causing issues:

**1. Disable Workflow**:
```bash
# Temporarily rename workflow file
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled

# Commit and push
git add .
git commit -m "Temporarily disable automatic deployment"
git push
```

**2. Manual-Only Mode**:
- Continue using manual deployment script
- Fix issues before re-enabling automation

## Monitoring and Alerts

### Set Up Monitoring

**1. GitHub Actions Monitoring**:
- Enable notifications for failed deployments
- Set up Slack/Email alerts
- Monitor workflow success rates

**2. Website Monitoring**:
- Use uptime monitoring services
- Monitor Core Web Vitals
- Set up alerts for downtime

### Health Checks

**Weekly Checks**:
- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Images display properly
- [ ] GitHub Actions passing
- [ ] No console errors

**Monthly Checks**:
- [ ] Dependencies up to date
- [ ] Performance metrics acceptable
- [ ] SSL certificate valid
- [ ] Custom domain working (if configured)

## Getting Help

### Documentation Resources
- [Vite Documentation](https://vitejs.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

### Community Support
- [GitHub Discussions](https://github.com/franceskomuca/franceskomuca.github.io/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/github-pages)
- [Vite Discord](https://vitejs.dev/chat)

### Professional Support
- GitHub Support (for repository issues)
- Domain registrar support (for DNS issues)
- Cloud provider support (if using external services)

---

Remember: Most deployment issues are temporary and can be resolved with patience and systematic debugging. When in doubt, check the logs first, then refer to this guide for solutions.