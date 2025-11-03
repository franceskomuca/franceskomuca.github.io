# Custom Domain Setup for ShotsByFra Portfolio

This guide covers setting up a custom domain (e.g., `www.shotsbyfra.com`) for the ShotsByFra portfolio website.

## Overview

Currently, the website is available at:
- **GitHub Pages URL**: https://franceskomuca.github.io/franceskomuca.github.io/

After setup, it will be available at:
- **Custom Domain**: https://www.shotsbyfra.com (recommended)
- **Alternative**: https://shotsbyfra.com (redirects to www)

## Prerequisites

- Domain name registered (e.g., from Namecheap, GoDaddy, etc.)
- Access to your domain's DNS settings
- GitHub repository admin access
- SSL certificate (automatically provided by GitHub Pages)

## Step 1: GitHub Repository Configuration

### 1.1 Enable GitHub Pages with Custom Domain

1. **Navigate to Repository Settings**:
   - Go to: https://github.com/franceskomuca/franceskomuca.github.io
   - Click on **Settings** tab
   - Scroll down to **Pages** section in the left sidebar

2. **Configure Source**:
   - Under **Source**, select **GitHub Actions**

3. **Add Custom Domain**:
   - In **Custom domain** field, enter: `www.shotsbyfra.com`
   - Click **Save**
   - GitHub will create a CNAME file in your repository

4. **Wait for DNS Check**:
   - GitHub will verify DNS configuration
   - This may take a few minutes
   - You may see a yellow warning: "DNS check successful"

5. **Enable HTTPS**:
   - Once DNS is verified, check **Enforce HTTPS** box
   - This may take additional time for certificate provisioning

### 1.2 Verify CNAME File

GitHub should automatically create a CNAME file. Verify it exists:
- Check the repository root for `CNAME` file
- Content should be: `www.shotsbyfra.com`

If it doesn't exist, create it manually:
```bash
# In your local repository
echo "www.shotsbyfra.com" > CNAME
git add CNAME
git commit -m "Add CNAME file for custom domain"
git push
```

## Step 2: DNS Configuration

### 2.1 Access Domain DNS Settings

Log into your domain registrar's control panel:
- **Namecheap**: Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → DNS
- **Cloudflare**: Dashboard → DNS

### 2.2 Add DNS Records

Add the following DNS records:

#### Primary Domain (www.shotsbyfra.com)
```
Type: CNAME
Name: www
Value: franceskomuca.github.io
TTL: 300 (or Auto)
```

#### Root Domain (shotsbyfra.com - Optional)
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 300

Type: A
Name: @
Value: 185.199.109.153
TTL: 300

Type: A
Name: @
Value: 185.199.110.153
TTL: 300

Type: A
Name: @
Value: 185.199.111.153
TTL: 300
```

#### Alternative Root Domain (Alternative)
```
Type: CNAME
Name: @
Value: franceskomuca.github.io
TTL: 300
```

**Note**: Some DNS providers don't allow CNAME for root domains. Use A records if CNAME isn't supported.

### 2.3 DNS Propagation

- **Propagation Time**: 24-48 hours maximum, usually 5-15 minutes
- **Check Status**: Use https://www.whatsmydns.net/
- **Test Domain**: Try accessing your domain in an incognito window

## Step 3: Verification and Testing

### 3.1 DNS Verification

1. **Check DNS Propagation**:
   ```bash
   # Check CNAME record
   nslookup www.shotsbyfra.com
   
   # Check A records
   nslookup shotsbyfra.com
   ```

2. **Online Tools**:
   - https://www.whatsmydns.net/
   - https://dnschecker.org/

### 3.2 Website Verification

1. **Test Custom Domain**:
   - Visit: https://www.shotsbyfra.com
   - Should load the portfolio website
   - Check that HTTPS is working (green padlock)

2. **Test Redirect**:
   - Visit: https://shotsbyfra.com
   - Should redirect to www.shotsbyfra.com (if A records configured)

3. **Verify GitHub Pages**:
   - Repository settings should show: "Your site is ready to be published"
   - HTTPS should be enabled

### 3.3 SSL Certificate

GitHub automatically provisions SSL certificates via Let's Encrypt:
- **Automatic**: No action required
- **Verification**: Check for green padlock in browser
- **Issues**: May take up to 24 hours for first certificate

## Step 4: Update Base Path (if needed)

If you want the website to work directly on the custom domain, update the build configuration:

### 4.1 Modify GitHub Actions Workflow

Edit `deployment/github-actions-workflow.yml`:

```yaml
- name: Build for GitHub Pages
  run: pnpm run build
  env:
    VITE_BASE_PATH: /  # Change from /franceskomuca.github.io/ to /
    NODE_ENV: production
```

### 4.2 Local Build Configuration

For local testing with custom domain:
```bash
# Build with custom domain base path
VITE_BASE_PATH=/ pnpm run build
```

**Important**: Only change this if you're permanently moving away from the GitHub Pages URL.

## Step 5: Advanced Configuration

### 5.1 Domain Redirection

Set up proper redirection rules:

1. **Non-www to www** (Recommended):
   - shotsbyfra.com → www.shotsbyfra.com
   - Add A records as shown above

2. **www to non-www**:
   - www.shotsbyfra.com → shotsbyfra.com
   - Less common, requires different DNS setup

### 5.2 Subdomain Setup

To add subdomains for different sections:

```
Type: CNAME
Name: gallery
Value: franceskomuca.github.io

Type: CNAME  
Name: blog
Value: franceskomuca.github.io
```

### 5.3 Email Integration

For professional email (info@shotsbyfra.com):

1. **Email Hosting**: Use services like:
   - Google Workspace
   - Microsoft 365
   - Zoho Mail

2. **DNS Records**:
   ```
   Type: MX
   Name: @
   Value: ASPMX.L.GOOGLE.COM
   Priority: 1
   
   # Additional MX records as provided by email service
   ```

## Troubleshooting

### Common Issues

#### DNS Not Propagating
- **Wait**: Can take up to 48 hours
- **Check**: Use multiple DNS checking tools
- **Verify**: Ensure no conflicting records

#### HTTPS Not Working
- **Wait**: SSL certificates can take 24 hours
- **Verify**: DNS is properly configured
- **Check**: GitHub Pages settings show HTTPS enabled

#### 404 Errors
- **Verify**: CNAME file exists in repository root
- **Check**: DNS records point to correct GitHub Pages domain
- **Test**: Use https://franceskomuca.github.io as fallback

#### Mixed Content Warnings
- **Cause**: HTTP resources on HTTPS page
- **Fix**: Ensure all resources use HTTPS URLs
- **Check**: Update any hardcoded HTTP links

### Debug Commands

```bash
# Check DNS resolution
dig www.shotsbyfra.com
dig shotsbyfra.com

# Test HTTP response
curl -I http://www.shotsbyfra.com
curl -I https://www.shotsbyfra.com

# Check CNAME
nslookup www.shotsbyfra.com
```

### Support Resources

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **DNS Checker**: https://www.whatsmydns.net/
- **SSL Test**: https://www.ssllabs.com/ssltest/

## Security Best Practices

### HTTPS Enforcement
- Always enforce HTTPS
- Use HSTS headers (configured by GitHub Pages)
- Monitor for mixed content warnings

### Domain Security
- Enable domain lock at registrar
- Use strong passwords for DNS management
- Enable two-factor authentication

### Regular Monitoring
- Monitor website availability
- Check SSL certificate expiration
- Verify DNS records periodically

## Rollback Procedure

If something goes wrong:

1. **Remove DNS Records**:
   - Delete CNAME and A records
   - Site will fallback to GitHub Pages URL

2. **Remove Custom Domain**:
   - Go to GitHub repository Settings → Pages
   - Remove custom domain
   - GitHub will delete CNAME file automatically

3. **Restore Previous State**:
   - Website will be available at: https://franceskomuca.github.io/franceskomuca.github.io/

## Maintenance

### Regular Tasks
- **Monitor SSL Certificate**: Auto-renewed by GitHub
- **Check DNS Records**: Quarterly verification
- **Test Website**: Monthly accessibility check
- **Update Dependencies**: Keep build process current

### Backup Considerations
- DNS records backup (export from registrar)
- Custom domain documentation
- SSL certificate backup (GitHub handles this)

---

For deployment automation, see `README.md` in the deployment directory.