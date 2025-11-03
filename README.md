# ShotsByFra Portfolio - Deployment Automation Documentation

This directory contains all automation scripts and documentation for deploying the ShotsByFra photography portfolio website.

## Quick Start

### Automatic Deployment (Recommended)
1. Push changes to the `main` branch
2. GitHub Actions automatically builds and deploys
3. Monitor deployment at: https://github.com/franceskomuca/franceskomuca.github.io/actions

### Manual Deployment
```bash
# From the project root directory
cd shotsbyfra-portfolio
../deployment/deploy.sh
```

## Directory Structure

```
deployment/
├── github-actions-workflow.yml    # Enhanced GitHub Actions workflow
├── deploy.sh                      # Manual deployment script
├── README.md                      # This documentation file
├── CUSTOM-DOMAIN-SETUP.md        # Custom domain configuration
└── TROUBLESHOOTING.md            # Common issues and solutions
```

## GitHub Actions Workflow

### Features
- **Automatic deployment** on push to main branch
- **Manual trigger** support via workflow_dispatch
- **Pre-build validation** (linting, type checking)
- **Build verification** and size reporting
- **Post-build checks** for artifact integrity
- **Concurrent deployment** protection

### Workflow Steps
1. **Checkout**: Clone repository with full history
2. **Setup**: Node.js 18, pnpm 8, dependency caching
3. **Validate**: Run linting and type checking
4. **Build**: Create production build with proper base path
5. **Deploy**: Upload artifacts and deploy to GitHub Pages
6. **Verify**: Post-deployment checks and reporting

### Environment Variables
The workflow uses these environment variables:
- `VITE_BASE_PATH`: `/franceskomuca.github.io/` for GitHub Pages
- `NODE_ENV`: `production` for optimized builds

## Manual Deployment Script

### Prerequisites
- Node.js 18+
- pnpm installed globally (`npm install -g pnpm`)
- Git repository initialized
- Remote origin configured

### Script Features
- **Dependency installation** with lockfile validation
- **Pre-build checks** (linting, type checking)
- **Production build** with verification
- **Git operations** (add, commit, push)
- **Build verification** and size reporting
- **Color-coded output** for better readability

### Usage
```bash
# Make executable (if needed)
chmod +x deployment/deploy.sh

# Run deployment
./deployment/deploy.sh

# Or from project root
bash deployment/deploy.sh
```

## Repository Configuration

### Required GitHub Settings
1. **Pages Settings**:
   - Source: GitHub Actions
   - Branch: main (automatic)

2. **Repository Secrets** (for full functionality):
   - `GOOGLE_DRIVE_API_KEY`: For gallery integration
   - `YOUTUBE_API_KEY`: For videos integration

### Branch Protection
Consider enabling branch protection for the main branch:
- Require pull request reviews
- Require status checks to pass
- Include administrators

## Build Process

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for local preview
pnpm build
pnpm preview
```

### Production Build
```bash
# Build optimized production version
pnpm run build

# Build with custom base path
VITE_BASE_PATH=/franceskomuca.github.io/ pnpm run build
```

### Build Output Verification
After building, verify these files exist in `dist/`:
- `index.html` (main entry point)
- `assets/` (JavaScript and CSS bundles)
- `images/` (image assets)

## Deployment Environments

### GitHub Pages URL
- **Primary**: https://franceskomuca.github.io/franceskomuca.github.io/
- **Custom Domain**: https://www.shotsbyfra.com (when configured)

### Environment Configuration
- **Development**: Local development server
- **Staging**: GitHub Actions preview (not implemented yet)
- **Production**: GitHub Pages main branch

## API Integration

### Google Drive Integration
- **Status**: Configured with placeholder images
- **Production**: Will sync 10 images from Google Drive folder
- **API Key**: Stored in GitHub repository secrets

### YouTube Integration
- **Status**: Configured with placeholder videos
- **Production**: Will display latest 3-6 videos from @ShotsByFra
- **API Key**: Stored in GitHub repository secrets

## Performance Optimizations

### Build Optimizations
- **Code Splitting**: Vendor libraries separated
- **Tree Shaking**: Unused code eliminated
- **Minification**: JavaScript and CSS compressed
- **Asset Optimization**: Images optimized for web

### Runtime Optimizations
- **Lazy Loading**: Images load on demand
- **Progressive Enhancement**: Works without JavaScript
- **Responsive Design**: Mobile-first approach

## Monitoring and Analytics

### GitHub Actions Monitoring
- Monitor deployment status at: https://github.com/franceskomuca/franceskomuca.github.io/actions
- Set up notifications for failed deployments
- Review build logs for performance metrics

### Performance Monitoring
- Monitor Core Web Vitals in production
- Track loading times and user experience
- Optimize based on real-world usage data

## Security Considerations

### Repository Security
- Keep API keys in GitHub repository secrets
- Enable branch protection for main branch
- Regular dependency updates

### Content Security
- HTTPS enforced via GitHub Pages
- Content Security Policy headers
- Regular security updates

## Maintenance

### Regular Tasks
1. **Dependency Updates**: Monthly review and updates
2. **Security Patches**: Immediate updates for critical vulnerabilities
3. **Performance Review**: Quarterly optimization review
4. **API Key Rotation**: Annual rotation of API keys

### Backup Strategy
- Git repository serves as primary backup
- Export Google Drive content regularly
- Maintain local copies of critical assets

## Support and Troubleshooting

### Common Issues
- See `TROUBLESHOOTING.md` for detailed solutions
- Check GitHub Actions logs for build failures
- Verify environment variables are set correctly

### Getting Help
- GitHub Issues: Report bugs and feature requests
- Documentation: Review inline code comments
- Community: GitHub Discussions for questions

## Version History

### v1.0 (Current)
- Initial deployment automation setup
- GitHub Actions workflow
- Manual deployment script
- Comprehensive documentation

### Planned Updates
- Staging environment support
- Automated testing integration
- Enhanced monitoring and alerts
- Performance optimization tracking

---

For detailed setup instructions, see:
- `CUSTOM-DOMAIN-SETUP.md` for domain configuration
- `TROUBLESHOOTING.md` for common issues